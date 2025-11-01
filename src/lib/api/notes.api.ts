import type { CreateNoteCommand, NoteDto, NotesListResponseDto, UpdateNoteCommand } from "../../types";

/**
 * API utility functions for notes endpoints
 */

/**
 * Fetch paginated list of notes for a project
 */
export async function fetchNotes(
  projectId: string,
  page = 1,
  size = 20,
  priority?: number | null,
  place_tag?: string
): Promise<NotesListResponseDto> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (priority !== null && priority !== undefined) {
    params.append("priority", priority.toString());
  }

  if (place_tag && place_tag.trim()) {
    params.append("place_tag", place_tag.trim());
  }

  const response = await fetch(`/api/projects/${projectId}/notes?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch notes" }));
    throw new Error(errorData.message || "Failed to fetch notes");
  }

  return response.json();
}

/**
 * Create a new note for a project
 */
export async function createNote(projectId: string, command: CreateNoteCommand): Promise<NoteDto> {
  const response = await fetch(`/api/projects/${projectId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to create note" }));
    throw new Error(errorData.message || "Failed to create note");
  }

  return response.json();
}

/**
 * Update an existing note
 */
export async function updateNote(projectId: string, noteId: string, command: UpdateNoteCommand): Promise<NoteDto> {
  const response = await fetch(`/api/projects/${projectId}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update note" }));
    throw new Error(errorData.message || "Failed to update note");
  }

  return response.json();
}

/**
 * Delete a note
 */
export async function deleteNote(projectId: string, noteId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to delete note" }));
    throw new Error(errorData.message || "Failed to delete note");
  }
}
