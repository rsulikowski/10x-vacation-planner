import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse, ApiError } from "../../../../lib/api-utils";
import { projectIdParamSchema, updateProjectCommandSchema } from "../../../../lib/schemas/project.schema";
import { projectService } from "../../../../services/project.service";

/**
 * GET /api/projects/{projectId}
 *
 * Endpoint do pobierania pojedynczego projektu.
 *
 * Response 200:
 * {
 *   "id": "uuid",
 *   "name": "Trip to Paris",
 *   "duration_days": 5,
 *   "planned_date": "2026-03-15"
 * }
 *
 * Error Codes:
 * - 400: Invalid projectId UUID format
 * - 401: User not authenticated
 * - 404: Project not found or not owned by user
 * - 500: Server error or database error
 */
export const GET: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const project = await projectService.getProject(projectId, user.id, context.locals.supabase);
    return createSuccessResponse(project, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * PATCH /api/projects/{projectId}
 *
 * Endpoint do aktualizacji projektu (wszystkie pola opcjonalne).
 *
 * Request Body:
 * {
 *   "name": "Updated Trip Name",
 *   "duration_days": 7,
 *   "planned_date": "2026-04-01"
 * }
 *
 * Response 200: Updated project
 *
 * Error Codes:
 * - 400: Invalid input
 * - 401: User not authenticated
 * - 404: Project not found
 * - 500: Server error
 */
export const PATCH: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);

    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON format in request body");
    }

    const command = updateProjectCommandSchema.parse(body);
    const project = await projectService.updateProject(projectId, user.id, command, context.locals.supabase);
    return createSuccessResponse(project, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * DELETE /api/projects/{projectId}
 *
 * Endpoint do usuwania projektu.
 *
 * Response 204: No content
 *
 * Error Codes:
 * - 400: Invalid projectId
 * - 401: User not authenticated
 * - 404: Project not found
 * - 500: Server error
 */
export const DELETE: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    await projectService.deleteProject(projectId, user.id, context.locals.supabase);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
};

export const prerender = false;
