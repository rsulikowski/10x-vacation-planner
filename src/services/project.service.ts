import type { CreateProjectCommand, ProjectDto } from '../types';
import { ApiError } from '../lib/api-utils';
import type { supabaseClient } from '../db/supabase.client';

type DbClient = typeof supabaseClient;

/**
 * Service odpowiedzialny za zarządzanie projektami podróży
 */
export class ProjectService {
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

