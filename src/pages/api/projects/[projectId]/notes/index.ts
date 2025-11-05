import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse, ApiError } from "../../../../../lib/api-utils";
import {
  projectIdParamSchema,
  createNoteCommandSchema,
  listNotesQuerySchema,
} from "../../../../../lib/schemas/note.schema";
import { noteService } from "../../../../../services/note.service";

/**
 * GET /api/projects/{projectId}/notes
 *
 * Endpoint do pobierania listy notatek projektu z paginacją i filtrami.
 *
 * Query Parameters:
 * - page (integer, optional, default: 1)
 * - size (integer, optional, default: 20)
 * - priority (integer, optional) - Filter by priority (1-3)
 * - place_tag (string, optional) - Filter by place tag
 *
 * Response 200:
 * {
 *   "data": [{ "id": "uuid", "project_id": "uuid", "content": "string", "priority": 1, "place_tags": [...], "updated_on": "..." }],
 *   "meta": { "page": 1, "size": 20, "total": 1 }
 * }
 *
 * Error Codes:
 * - 401: User not authenticated
 */
export const GET: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);

    const query = listNotesQuerySchema.parse({
      page: context.url.searchParams.get("page"),
      size: context.url.searchParams.get("size"),
      priority: context.url.searchParams.get("priority"),
      place_tag: context.url.searchParams.get("place_tag"),
    });

    const result = await noteService.listNotes(projectId, user.id, query, context.locals.supabase);
    return createSuccessResponse(result, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

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
 * - 401: User not authenticated
 * - 404: Project not found or does not belong to user
 * - 500: Server error or database error
 */
export const POST: APIRoute = async (context) => {
  try {
    // Get authenticated user
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    // Krok 1: Walidacja projectId z URL
    const projectId = projectIdParamSchema.parse(context.params.projectId);

    // Krok 2: Weryfikacja własności projektu
    await noteService.verifyProjectOwnership(projectId, user.id, context.locals.supabase);

    // Krok 3: Parsowanie i walidacja JSON body
    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON format in request body");
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
