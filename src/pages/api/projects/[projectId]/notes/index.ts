import type { APIRoute } from 'astro';
import { handleApiError, createSuccessResponse, ApiError } from '../../../../../lib/api-utils';
import { projectIdParamSchema, createNoteCommandSchema } from '../../../../../lib/schemas/note.schema';
import { noteService } from '../../../../../services/note.service';
import { DEFAULT_USER_ID } from '../../../../../db/supabase.client';

/**
 * POST /api/projects/{projectId}/notes
 *
 * Endpoint do tworzenia nowej notatki dla projektu podróży.
 *
 * URL Parameters:
 * - projectId: UUID projektu
 *
 * Request Body:
 * {
 *   "content": "Visit Eiffel Tower at sunset",
 *   "priority": 1,
 *   "place_tags": ["Paris", "Monuments"]  // opcjonalne
 * }
 *
 * Response 201:
 * {
 *   "id": "uuid",
 *   "project_id": "uuid",
 *   "content": "Visit Eiffel Tower at sunset",
 *   "priority": 1,
 *   "place_tags": ["Paris", "Monuments"],
 *   "updated_on": "2025-10-21T12:00:00Z"
 * }
 *
 * Error Codes:
 * - 400: Invalid projectId UUID or input data validation failure
 * - 404: Project not found or does not belong to user
 * - 500: Server error or database error
 *
 * UWAGA: Autoryzacja JWT zostanie zaimplementowana później.
 * Obecnie używany jest DEFAULT_USER_ID z konfiguracji Supabase.
 */
export const POST: APIRoute = async (context) => {
  try {
    // Krok 1: Walidacja projectId z URL
    const projectId = projectIdParamSchema.parse(context.params.projectId);

    // Krok 2: Weryfikacja własności projektu
    await noteService.verifyProjectOwnership(projectId, DEFAULT_USER_ID, context.locals.supabase);

    // Krok 3: Parsowanie i walidacja JSON body
    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, 'Invalid JSON format in request body');
    }

    // Krok 4: Walidacja danych wejściowych za pomocą Zod
    const command = createNoteCommandSchema.parse(body);

    // Krok 5: Wywołanie serwisu do utworzenia notatki
    const note = await noteService.createNote(projectId, command, context.locals.supabase);

    // Krok 6: Zwrócenie odpowiedzi 201 Created
    return createSuccessResponse(note, 201);
  } catch (error) {
    // Obsługa wszystkich błędów przez centralny handler
    return handleApiError(error);
  }
};

export const prerender = false;

