import type { Database } from "../db/database.types";
import type { GeneratePlanCommand, PlanResponseDto } from "../types";
import { ApiError } from "../lib/api-utils";
import { aiService } from "./ai.service.mock";
import { DEFAULT_USER_ID, type supabaseClient } from "../db/supabase.client";

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

    // Krok 4: Wywołanie AI service (logowanie przeniesione do trasy API)
    return await aiService.generatePlan(command);
  }

  /**
   * Pobiera projekt i weryfikuje własność
   */
  private async fetchAndVerifyProject(projectId: string, userId: string, supabase: DbClient) {
    const { data: project, error } = await supabase
      .from("travel_projects")
      .select("id, name, user_id, duration_days")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      console.error("Project not found or Supabase error:", error);
      throw new ApiError(404, "Project not found");
    }

    if (project.user_id !== userId) {
      console.error(`User ID mismatch - Project user_id: ${project.user_id}, Expected user_id: ${userId}`);
      throw new ApiError(404, "Project not found"); // Don't reveal that the project exists
    }

    return project;
  }

  /**
   * Pobiera notatki przypisane do projektu
   */
  private async fetchProjectNotes(projectId: string, supabase: DbClient) {
    const { data: notes, error } = await supabase
      .from("notes")
      .select("id, content, priority, place_tags")
      .eq("project_id", projectId)
      .order("priority", { ascending: false });

    if (error) {
      throw new ApiError(500, "Error fetching project notes");
    }

    return notes || [];
  }

  /**
   * Waliduje zgodność notatek z bazy danych z notatkami w komendzie
   */
  private validateNotes(
    commandNotes: GeneratePlanCommand["notes"],
    dbNotes: { id: string; content: string; priority: number; place_tags: string[] | null }[]
  ) {
    const dbNoteIds = new Set(dbNotes.map((n) => n.id));

    for (const note of commandNotes) {
      if (!dbNoteIds.has(note.id)) {
        throw new ApiError(400, `Note with ID ${note.id} does not belong to this project`);
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
    supabase: DbClient
  ): Promise<string> {
    const prompt = aiService.generatePrompt(command);

    const { data, error } = await supabase
      .from("ai_logs")
      .insert({
        project_id: projectId,
        user_id: userId,
        prompt,
        response: {}, // Pusty obiekt zamiast null (response jest NOT NULL w bazie)
        status: "pending",
        duration_ms: null,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Error creating AI log entry:", error);
      throw new ApiError(500, "Error creating AI log entry");
    }

    return data.id;
  }

  /**
   * Aktualizuje status wpisu w ai_logs
   */
  private async updateLogStatus(
    logId: string,
    status: Database["public"]["Enums"]["ai_status"],
    response: PlanResponseDto | null,
    durationMs: number,
    errorMessage: string | null,
    supabase: DbClient
  ) {
    const responseData = status === "success" && response ? response : { error: errorMessage };

    const { error } = await supabase
      .from("ai_logs")
      .update({
        status,
        response: responseData,
        duration_ms: durationMs,
      })
      .eq("id", logId);

    if (error) {
      console.error("Error updating AI log:", error);
      // Don't throw error - this is a logging operation, shouldn't block the main flow
    }
  }
}

/**
 * Singleton instance plan service
 */
export const planService = new PlanService();
