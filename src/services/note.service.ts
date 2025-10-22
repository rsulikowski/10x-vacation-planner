import type { NoteDto } from '../types';
import { ApiError } from '../lib/api-utils';
import type { supabaseClient } from '../db/supabase.client';

type DbClient = typeof supabaseClient;

/**
 * Typ dla komendy tworzenia notatki (bez project_id, który pochodzi z URL)
 */
type CreateNoteInput = {
  content: string;
  priority: number;
  place_tags?: string[] | null;
};

/**
 * Service odpowiedzialny za zarządzanie notatkami
 */
export class NoteService {
  /**
   * Weryfikuje istnienie projektu i własność
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @throws ApiError(404) jeśli projekt nie istnieje lub nie należy do użytkownika
   */
  async verifyProjectOwnership(projectId: string, userId: string, db: DbClient): Promise<void> {
    const { data: project, error } = await db
      .from('travel_projects')
      .select('id, user_id')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      console.error('Project not found or Supabase error:', error);
      throw new ApiError(404, 'Project not found');
    }

    if (project.user_id !== userId) {
      console.error(`User ID mismatch - Project user_id: ${project.user_id}, Expected user_id: ${userId}`);
      throw new ApiError(404, 'Project not found'); // Don't reveal that the project exists
    }
  }

  /**
   * Tworzy nową notatkę dla projektu
   *
   * @param projectId - ID projektu
   * @param command - Komenda z danymi nowej notatki
   * @param db - Klient Supabase
   * @returns Utworzona notatka
   * @throws ApiError w przypadku błędów bazy danych
   */
  async createNote(projectId: string, command: CreateNoteInput, db: DbClient): Promise<NoteDto> {
    const { data, error } = await db
      .from('notes')
      .insert({
        project_id: projectId,
        content: command.content,
        priority: command.priority,
        place_tags: command.place_tags ?? null,
      })
      .select('id, project_id, content, priority, place_tags, updated_on')
      .single();

    if (error || !data) {
      console.error('Error creating note:', error);
      throw new ApiError(500, 'Failed to create note');
    }

    return data as NoteDto;
  }
}

/**
 * Singleton instance note service
 */
export const noteService = new NoteService();

