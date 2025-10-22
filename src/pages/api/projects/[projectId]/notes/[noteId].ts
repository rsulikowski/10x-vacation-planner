import type { APIRoute } from 'astro';
import { handleApiError, createSuccessResponse, ApiError } from '../../../../../lib/api-utils';
import {
  projectIdParamSchema,
  noteIdParamSchema,
  updateNoteCommandSchema,
} from '../../../../../lib/schemas/note.schema';
import { noteService } from '../../../../../services/note.service';
import { DEFAULT_USER_ID } from '../../../../../db/supabase.client';

/**
 * GET /api/projects/{projectId}/notes/{noteId}
 *
 * Endpoint do pobierania pojedynczej notatki.
 */
export const GET: APIRoute = async (context) => {
  try {
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const noteId = noteIdParamSchema.parse(context.params.noteId);
    const note = await noteService.getNote(noteId, projectId, DEFAULT_USER_ID, context.locals.supabase);
    return createSuccessResponse(note, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * PATCH /api/projects/{projectId}/notes/{noteId}
 *
 * Endpoint do aktualizacji notatki (wszystkie pola opcjonalne).
 */
export const PATCH: APIRoute = async (context) => {
  try {
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const noteId = noteIdParamSchema.parse(context.params.noteId);

    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, 'Invalid JSON format in request body');
    }

    const command = updateNoteCommandSchema.parse(body);
    const note = await noteService.updateNote(noteId, projectId, DEFAULT_USER_ID, command, context.locals.supabase);
    return createSuccessResponse(note, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * DELETE /api/projects/{projectId}/notes/{noteId}
 *
 * Endpoint do usuwania notatki.
 */
export const DELETE: APIRoute = async (context) => {
  try {
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const noteId = noteIdParamSchema.parse(context.params.noteId);
    await noteService.deleteNote(noteId, projectId, DEFAULT_USER_ID, context.locals.supabase);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
};

export const prerender = false;

