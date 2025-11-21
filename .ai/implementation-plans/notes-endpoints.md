# API Endpoint Implementation Plan: Notes CRUD

## Endpoints

### 1. GET /projects/{projectId}/notes - List Notes

- Paginated list with filters (priority, place_tag)
- Query params: page, size, priority, place_tag

### 2. GET /projects/{projectId}/notes/{noteId} - Get Note

- Return single note by ID
- Verify project ownership

### 3. PATCH /projects/{projectId}/notes/{noteId} - Update Note

- All fields optional
- Verify project ownership

### 4. DELETE /projects/{projectId}/notes/{noteId} - Delete Note

- Remove note
- Verify project ownership

## Implementation

All methods added to NoteService and implemented in route handlers.
