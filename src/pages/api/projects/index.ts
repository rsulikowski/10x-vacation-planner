import type { APIRoute } from 'astro';
import { handleApiError, createSuccessResponse, ApiError } from '../../../lib/api-utils';
import { createProjectCommandSchema } from '../../../lib/schemas/project.schema';
import { projectService } from '../../../services/project.service';
import { DEFAULT_USER_ID } from '../../../db/supabase.client';

/**
 * POST /api/projects
 *
 * Endpoint do tworzenia nowego projektu podróży dla użytkownika.
 *
 * Request Body:
 * {
 *   "name": "Trip to Paris",
 *   "duration_days": 5,
 *   "planned_date": "2026-03-15"  // opcjonalne
 * }
 *
 * Response 201:
 * {
 *   "id": "uuid",
 *   "name": "Trip to Paris",
 *   "duration_days": 5,
 *   "planned_date": "2026-03-15"
 * }
 *
 * Error Codes:
 * - 400: Invalid input data validation
 * - 500: Server error or database error
 *
 * UWAGA: Autoryzacja JWT zostanie zaimplementowana później.
 * Obecnie używany jest DEFAULT_USER_ID z konfiguracji Supabase.
 */
export const POST: APIRoute = async (context) => {
  try {
    // Krok 1: Użycie DEFAULT_USER_ID (autoryzacja JWT będzie dodana później)
    const userId = DEFAULT_USER_ID;

    // Krok 2: Parsowanie i walidacja JSON body
    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, 'Invalid JSON format in request body');
    }

    // Krok 3: Walidacja danych wejściowych za pomocą Zod
    const command = createProjectCommandSchema.parse(body);

    // Krok 4: Wywołanie serwisu do utworzenia projektu
    const project = await projectService.createProject(userId, command, context.locals.supabase);

    // Krok 5: Zwrócenie odpowiedzi 201 Created
    return createSuccessResponse(project, 201);
  } catch (error) {
    // Obsługa wszystkich błędów przez centralny handler
    return handleApiError(error);
  }
};

export const prerender = false;

