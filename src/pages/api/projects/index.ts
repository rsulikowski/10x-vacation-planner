import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse, ApiError } from "../../../lib/api-utils";
import { createProjectCommandSchema, listProjectsQuerySchema } from "../../../lib/schemas/project.schema";
import { projectService } from "../../../services/project.service";

/**
 * GET /api/projects
 *
 * Endpoint do pobierania listy projektów użytkownika z paginacją.
 *
 * Query Parameters:
 * - page (integer, optional, default: 1)
 * - size (integer, optional, default: 20)
 * - sort (string, optional, default: "created_on")
 * - order (string, optional, default: "desc")
 *
 * Response 200:
 * {
 *   "data": [{ "id": "uuid", "name": "string", "duration_days": 5, "planned_date": "2026-03-15" }],
 *   "meta": { "page": 1, "size": 20, "total": 1 }
 * }
 *
 * Error Codes:
 * - 400: Invalid query parameters
 * - 401: User not authenticated
 * - 500: Server error or database error
 */
export const GET: APIRoute = async (context) => {
  try {
    // Get authenticated user from middleware
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const userId = user.id;

    // Parsowanie i walidacja parametrów zapytania
    const query = listProjectsQuerySchema.parse({
      page: context.url.searchParams.get("page"),
      size: context.url.searchParams.get("size"),
      sort: context.url.searchParams.get("sort"),
      order: context.url.searchParams.get("order"),
    });

    // Wywołanie serwisu do pobrania listy projektów
    const result = await projectService.listProjects(userId, query, context.locals.supabase);

    return createSuccessResponse(result, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

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
 * - 401: User not authenticated
 * - 500: Server error or database error
 */
export const POST: APIRoute = async (context) => {
  try {
    // Get authenticated user from middleware
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const userId = user.id;

    // Krok 2: Parsowanie i walidacja JSON body
    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON format in request body");
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
