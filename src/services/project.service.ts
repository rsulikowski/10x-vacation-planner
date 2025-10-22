import type { CreateProjectCommand, ProjectDto, ProjectsListResponseDto, UpdateProjectCommand } from '../types';
import { ApiError } from '../lib/api-utils';
import type { supabaseClient } from '../db/supabase.client';
import type { ValidatedListProjectsQuery } from '../lib/schemas/project.schema';

type DbClient = typeof supabaseClient;

/**
 * Service odpowiedzialny za zarządzanie projektami podróży
 */
export class ProjectService {
  /**
   * Pobiera listę projektów użytkownika z paginacją
   *
   * @param userId - ID użytkownika
   * @param query - Parametry zapytania (page, size, sort, order)
   * @param db - Klient Supabase
   * @returns Lista projektów z metadanymi paginacji
   * @throws ApiError w przypadku błędów bazy danych
   */
  async listProjects(
    userId: string,
    query: ValidatedListProjectsQuery,
    db: DbClient,
  ): Promise<ProjectsListResponseDto> {
    const { page, size, sort, order } = query;
    const offset = (page - 1) * size;

    // Pobierz całkowitą liczbę projektów
    const { count, error: countError } = await db
      .from('travel_projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error counting projects:', countError);
      throw new ApiError(500, 'Failed to count projects');
    }

    // Pobierz projekty z paginacją i sortowaniem
    const { data, error } = await db
      .from('travel_projects')
      .select('id, name, duration_days, planned_date')
      .eq('user_id', userId)
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + size - 1);

    if (error) {
      console.error('Error listing projects:', error);
      throw new ApiError(500, 'Failed to list projects');
    }

    return {
      data: (data || []) as ProjectDto[],
      meta: {
        page,
        size,
        total: count || 0,
      },
    };
  }

  /**
   * Pobiera pojedynczy projekt po ID
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @returns Projekt
   * @throws ApiError(404) jeśli projekt nie istnieje lub nie należy do użytkownika
   */
  async getProject(projectId: string, userId: string, db: DbClient): Promise<ProjectDto> {
    const { data, error } = await db
      .from('travel_projects')
      .select('id, name, duration_days, planned_date')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.error('Project not found or Supabase error:', error);
      throw new ApiError(404, 'Project not found');
    }

    return data as ProjectDto;
  }

  /**
   * Aktualizuje projekt
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param command - Komenda z danymi do aktualizacji
   * @param db - Klient Supabase
   * @returns Zaktualizowany projekt
   * @throws ApiError(404) jeśli projekt nie istnieje lub nie należy do użytkownika
   */
  async updateProject(
    projectId: string,
    userId: string,
    command: UpdateProjectCommand,
    db: DbClient,
  ): Promise<ProjectDto> {
    // Najpierw sprawdź czy projekt istnieje i należy do użytkownika
    await this.getProject(projectId, userId, db);

    const { data, error } = await db
      .from('travel_projects')
      .update({
        ...(command.name !== undefined && { name: command.name }),
        ...(command.duration_days !== undefined && { duration_days: command.duration_days }),
        ...(command.planned_date !== undefined && { planned_date: command.planned_date }),
      })
      .eq('id', projectId)
      .eq('user_id', userId)
      .select('id, name, duration_days, planned_date')
      .single();

    if (error || !data) {
      console.error('Error updating project:', error);
      throw new ApiError(500, 'Failed to update project');
    }

    return data as ProjectDto;
  }

  /**
   * Usuwa projekt
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @throws ApiError(404) jeśli projekt nie istnieje lub nie należy do użytkownika
   */
  async deleteProject(projectId: string, userId: string, db: DbClient): Promise<void> {
    // Najpierw sprawdź czy projekt istnieje i należy do użytkownika
    await this.getProject(projectId, userId, db);

    const { error } = await db.from('travel_projects').delete().eq('id', projectId).eq('user_id', userId);

    if (error) {
      console.error('Error deleting project:', error);
      throw new ApiError(500, 'Failed to delete project');
    }
  }

  /**
   * Tworzy nowy projekt podróży dla użytkownika
   *
   * @param userId - ID użytkownika tworzącego projekt
   * @param command - Komenda z danymi nowego projektu
   * @param db - Klient Supabase
   * @returns Utworzony projekt
   * @throws ApiError w przypadku błędów bazy danych
   */
  async createProject(userId: string, command: CreateProjectCommand, db: DbClient): Promise<ProjectDto> {
    const { data, error } = await db
      .from('travel_projects')
      .insert({
        user_id: userId,
        name: command.name,
        duration_days: command.duration_days,
        planned_date: command.planned_date ?? null,
      })
      .select('id, name, duration_days, planned_date')
      .single();

    if (error || !data) {
      console.error('Error creating project:', error);
      throw new ApiError(500, 'Failed to create project');
    }

    return data as ProjectDto;
  }
}

/**
 * Singleton instance project service
 */
export const projectService = new ProjectService();

