import type { NoteDto, NotesListResponseDto, UpdateNoteCommand } from '../types';
import { ApiError } from '../lib/api-utils';
import type { supabaseClient } from '../db/supabase.client';
import type { ValidatedListNotesQuery } from '../lib/schemas/note.schema';

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
   * Pobiera listę notatek projektu z paginacją i filtrami
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param query - Parametry zapytania (page, size, priority, place_tag)
   * @param db - Klient Supabase
   * @returns Lista notatek z metadanymi paginacji
   * @throws ApiError w przypadku błędów
   */
  async listNotes(
    projectId: string,
    userId: string,
    query: ValidatedListNotesQuery,
    db: DbClient,
  ): Promise<NotesListResponseDto> {
    // Najpierw zweryfikuj własność projektu
    await this.verifyProjectOwnership(projectId, userId, db);

    const { page, size, priority, place_tag } = query;
    const offset = (page - 1) * size;

    // Buduj zapytanie z filtrami
    let countQuery = db.from('notes').select('*', { count: 'exact', head: true }).eq('project_id', projectId);

    let dataQuery = db.from('notes').select('id, project_id, content, priority, place_tags, updated_on').eq('project_id', projectId);

    // Dodaj filtry jeśli są podane
    if (priority !== undefined) {
      countQuery = countQuery.eq('priority', priority);
      dataQuery = dataQuery.eq('priority', priority);
    }

    if (place_tag) {
      countQuery = countQuery.contains('place_tags', [place_tag]);
      dataQuery = dataQuery.contains('place_tags', [place_tag]);
    }

    // Pobierz całkowitą liczbę notatek
    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting notes:', countError);
      throw new ApiError(500, 'Failed to count notes');
    }

    // Pobierz notatki z paginacją
    const { data, error } = await dataQuery.order('priority', { ascending: false }).range(offset, offset + size - 1);

    if (error) {
      console.error('Error listing notes:', error);
      throw new ApiError(500, 'Failed to list notes');
    }

    return {
      data: (data || []) as NoteDto[],
      meta: {
        page,
        size,
        total: count || 0,
      },
    };
  }

  /**
   * Pobiera pojedynczą notatkę po ID
   *
   * @param noteId - ID notatki
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @returns Notatka
   * @throws ApiError(404) jeśli notatka nie istnieje lub projekt nie należy do użytkownika
   */
  async getNote(noteId: string, projectId: string, userId: string, db: DbClient): Promise<NoteDto> {
    // Najpierw zweryfikuj własność projektu
    await this.verifyProjectOwnership(projectId, userId, db);

    const { data, error } = await db
      .from('notes')
      .select('id, project_id, content, priority, place_tags, updated_on')
      .eq('id', noteId)
      .eq('project_id', projectId)
      .single();

    if (error || !data) {
      console.error('Note not found or Supabase error:', error);
      throw new ApiError(404, 'Note not found');
    }

    return data as NoteDto;
  }

  /**
   * Aktualizuje notatkę
   *
   * @param noteId - ID notatki
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param command - Komenda z danymi do aktualizacji
   * @param db - Klient Supabase
   * @returns Zaktualizowana notatka
   * @throws ApiError(404) jeśli notatka nie istnieje
   */
  async updateNote(
    noteId: string,
    projectId: string,
    userId: string,
    command: UpdateNoteCommand,
    db: DbClient,
  ): Promise<NoteDto> {
    // Najpierw sprawdź czy notatka istnieje i należy do projektu użytkownika
    await this.getNote(noteId, projectId, userId, db);

    const { data, error } = await db
      .from('notes')
      .update({
        ...(command.content !== undefined && { content: command.content }),
        ...(command.priority !== undefined && { priority: command.priority }),
        ...(command.place_tags !== undefined && { place_tags: command.place_tags }),
      })
      .eq('id', noteId)
      .eq('project_id', projectId)
      .select('id, project_id, content, priority, place_tags, updated_on')
      .single();

    if (error || !data) {
      console.error('Error updating note:', error);
      throw new ApiError(500, 'Failed to update note');
    }

    return data as NoteDto;
  }

  /**
   * Usuwa notatkę
   *
   * @param noteId - ID notatki
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @throws ApiError(404) jeśli notatka nie istnieje
   */
  async deleteNote(noteId: string, projectId: string, userId: string, db: DbClient): Promise<void> {
    // Najpierw sprawdź czy notatka istnieje i należy do projektu użytkownika
    await this.getNote(noteId, projectId, userId, db);

    const { error } = await db.from('notes').delete().eq('id', noteId).eq('project_id', projectId);

    if (error) {
      console.error('Error deleting note:', error);
      throw new ApiError(500, 'Failed to delete note');
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

