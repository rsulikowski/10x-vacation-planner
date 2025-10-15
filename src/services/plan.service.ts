import type { Database } from '../db/database.types';
import type { GeneratePlanCommand, PlanResponseDto } from '../types';
import { ApiError } from '../lib/api-utils';
import { aiService } from './ai.service.mock';
import { DEFAULT_USER_ID, type supabaseClient } from '../db/supabase.client';

type DbClient = typeof supabaseClient;

/**
 * Service odpowiedzialny za generowanie planu podróży
 */
export class PlanService {
  /**
   * Generuje plan podróży dla projektu
   *
   * @param projectId - ID projektu
   * @param command - Komenda z parametrami generowania
   * @param supabase - Klient Supabase
   * @returns Plan podróży
   * @throws ApiError w przypadku błędów
   */
  async generatePlan(projectId: string, command: GeneratePlanCommand, supabase: DbClient): Promise<PlanResponseDto> {
    const userId = DEFAULT_USER_ID;

    // Krok 1: Weryfikacja istnienia projektu i własności
    const project = await this.fetchAndVerifyProject(projectId, userId, supabase);

    // Krok 2: Pobranie notatek projektu
    const notes = await this.fetchProjectNotes(projectId, supabase);

    // Krok 3: Walidacja zgodności notatek
    this.validateNotes(command.notes, notes);

    // Krok 4: Utworzenie wpisu w ai_logs ze statusem 'pending'
    const logId = await this.createPendingLog(projectId, userId, command, supabase);

    const startTime = Date.now();
    let response: PlanResponseDto;
    let status: Database['public']['Enums']['ai_status'] = 'success';
    let errorMessage: string | null = null;

    try {
      // Krok 5: Wywołanie AI service
      response = await aiService.generatePlan(command);
    } catch (error) {
      // Krok 6a: Obsługa błędu AI service
      status = 'failure';
      errorMessage = error instanceof Error ? error.message : 'Unknown AI service error';
      await this.updateLogStatus(logId, status, null, Date.now() - startTime, errorMessage, supabase);
      throw new ApiError(500, 'Błąd podczas generowania planu przez AI service', { error: errorMessage });
    }

    // Krok 6b: Aktualizacja logu ze statusem 'success'
    const duration = Date.now() - startTime;
    await this.updateLogStatus(logId, status, response, duration, null, supabase);

    return response;
  }

  /**
   * Pobiera projekt i weryfikuje własność
   */
  private async fetchAndVerifyProject(projectId: string, userId: string, supabase: DbClient) {
    const { data: project, error } = await supabase
      .from('travel_projects')
      .select('id, name, user_id, duration_days')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      throw new ApiError(404, 'Projekt nie został znaleziony');
    }

    if (project.user_id !== userId) {
      throw new ApiError(404, 'Projekt nie został znaleziony'); // Nie ujawniamy, że projekt istnieje
    }

    return project;
  }

  /**
   * Pobiera notatki przypisane do projektu
   */
  private async fetchProjectNotes(projectId: string, supabase: DbClient) {
    const { data: notes, error } = await supabase
      .from('notes')
      .select('id, content, priority, place_tags')
      .eq('project_id', projectId)
      .order('priority', { ascending: false });

    if (error) {
      throw new ApiError(500, 'Błąd podczas pobierania notatek projektu');
    }

    return notes || [];
  }

  /**
   * Waliduje zgodność notatek z bazy danych z notatkami w komendzie
   */
  private validateNotes(
    commandNotes: GeneratePlanCommand['notes'],
    dbNotes: Array<{ id: string; content: string; priority: number; place_tags: string[] | null }>,
  ) {
    const dbNoteIds = new Set(dbNotes.map((n) => n.id));

    for (const note of commandNotes) {
      if (!dbNoteIds.has(note.id)) {
        throw new ApiError(400, `Notatka o ID ${note.id} nie należy do tego projektu`);
      }
    }
  }

  /**
   * Tworzy wpis w ai_logs ze statusem 'pending'
   * @returns ID utworzonego logu
   */
  private async createPendingLog(
    projectId: string,
    userId: string,
    command: GeneratePlanCommand,
    supabase: DbClient,
  ): Promise<string> {
    const prompt = aiService.generatePrompt(command);

    const { data, error } = await supabase
      .from('ai_logs')
      .insert({
        project_id: projectId,
        user_id: userId,
        prompt,
        response: null,
        status: 'pending',
        duration_ms: null,
      })
      .select('id')
      .single();

    if (error || !data) {
      throw new ApiError(500, 'Błąd podczas tworzenia wpisu w logach AI');
    }

    return data.id;
  }

  /**
   * Aktualizuje status wpisu w ai_logs
   */
  private async updateLogStatus(
    logId: string,
    status: Database['public']['Enums']['ai_status'],
    response: PlanResponseDto | null,
    durationMs: number,
    errorMessage: string | null,
    supabase: DbClient,
  ) {
    const responseData = status === 'success' && response ? response : { error: errorMessage };

    const { error } = await supabase
      .from('ai_logs')
      .update({
        status,
        response: responseData,
        duration_ms: durationMs,
      })
      .eq('id', logId);

    if (error) {
      console.error('Błąd podczas aktualizacji logu AI:', error);
      // Nie rzucamy błędu - to operacja logowania, nie powinna blokować głównego flow
    }
  }
}

/**
 * Singleton instance plan service
 */
export const planService = new PlanService();

