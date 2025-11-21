# API Endpoint Implementation Plan: Create Note

## 1. Endpoint Overview

Create a new note for a specific travel project.

- **HTTP Method:** POST
- **URL:** `/api/projects/{projectId}/notes`
- **Purpose:** Allow a user to add a new note to their existing travel project, specifying content, priority, and optional place tags.

## 2. Request Details

- **URL Parameters:**
  - `projectId` (string, UUID) - The ID of the travel project
- **Request Body (JSON):**
  ```json
  {
    "content": "Visit Eiffel Tower at sunset",
    "priority": 1,
    "place_tags": ["Paris", "Monuments"]
  }
  ```
- **Parameters:**
  - Required:
    - `content` (string, nonempty)
    - `priority` (integer, between 1 and 3)
  - Optional:
    - `place_tags` (array of strings, nullable)

## 3. Used Types

- **CreateNoteCommand** (`src/types.ts`):
  ```ts
  export type CreateNoteCommand = {
    project_id: string;
    content: string;
    priority: number;
    place_tags?: string[] | null;
  };
  ```
- **NoteDto** (`src/types.ts`):
  ```ts
  export type NoteDto = {
    id: string;
    project_id: string;
    content: string;
    priority: number;
    place_tags: string[] | null;
    updated_on: string;
  };
  ```

## 4. Response Details

- **201 Created:**
  - Body: the newly created `NoteDto`, e.g.:
    ```json
    {
      "id": "uuid",
      "project_id": "uuid",
      "content": "Visit Eiffel Tower at sunset",
      "priority": 1,
      "place_tags": ["Paris", "Monuments"],
      "updated_on": "2025-10-21T12:00:00Z"
    }
    ```
- **400 Bad Request:** malformed JSON, invalid UUID, or validation failure
- **404 Not Found:** project does not exist or does not belong to user
- **500 Internal Server Error:** database failures or unexpected errors

## 5. Data Flow

1. **Validate projectId parameter:**
   - Parse `projectId` from URL and validate it's a valid UUID.
2. **Verify project ownership:**
   - Check that the project with `projectId` exists and belongs to `DEFAULT_USER_ID`.
   - Return 404 if project doesn't exist or doesn't belong to the user.
3. **Parse & validate input:**
   - `await context.request.json()` → handle JSON parse errors.
   - Validate against a Zod schema (`createNoteCommandSchema`).
4. **Business logic in service:**
   - `NoteService.createNote(projectId, command, supabase)`
   - Inserts into `notes`:
     - `project_id = projectId`
     - `content`, `priority`, `place_tags`
   - Returns inserted row mapped to `NoteDto`.
5. **Return response:**
   - `createSuccessResponse<NoteDto>(note, 201)`.
6. **Error handling:**
   - Catch Zod errors → `handleZodError` (400)
   - Catch `ApiError` → `createErrorResponse` with its status
   - Unexpected → 500 via `handleApiError`

## 6. Security Considerations

- **Project ownership verification:** Ensure the project belongs to `DEFAULT_USER_ID` before allowing note creation.
- **Input sanitization:** Zod schema enforces correct types and formats.
- **SQL injection:** Supabase client is parameterized.
- **Authorization:** Only allow creating notes for projects owned by the authenticated user (currently `DEFAULT_USER_ID`).

## 7. Error Handling

| Scenario                               | Status Code | Handling                             |
| -------------------------------------- | ----------- | ------------------------------------ |
| Invalid projectId UUID format          | 400         | Zod validation error                 |
| Malformed JSON body                    | 400         | catch JSON parse exception           |
| Schema validation failure (Zod)        | 400         | `handleZodError`                     |
| Project not found or not owned by user | 404         | `ApiError(404, 'Project not found')` |
| Database insertion error               | 500         | log via `console.error`; return 500  |
| Unexpected exception                   | 500         | `handleApiError`                     |

## 8. Performance Considerations

- Single project ownership check + single-row insert.
- Ensure `notes.project_id` is indexed (it is the FK).
- Response payload is minimal.

## 9. Implementation Steps

1. **Define Zod schema**
   - Create `src/lib/schemas/note.schema.ts`:

     ```ts
     import { z } from "zod";

     /**
      * Schemat walidacji parametru projectId w URL
      */
     export const projectIdParamSchema = z.string().uuid("Project ID must be a valid UUID");

     /**
      * Schemat walidacji dla tworzenia notatki
      */
     export const createNoteCommandSchema = z.object({
       content: z.string().min(1, "Content cannot be empty"),
       priority: z.number().int().min(1).max(3, "Priority must be between 1 and 3"),
       place_tags: z.array(z.string()).nullable().optional(),
     });

     /**
      * Typ wynikowy z walidacji schematu
      */
     export type ValidatedCreateNoteCommand = z.infer<typeof createNoteCommandSchema>;
     ```

2. **Create NoteService**
   - File: `src/services/note.service.ts`
   - Methods:

     ```ts
     import type { CreateNoteCommand, NoteDto } from "../types";
     import { ApiError } from "../lib/api-utils";
     import type { supabaseClient } from "../db/supabase.client";

     type DbClient = typeof supabaseClient;

     export class NoteService {
       /**
        * Weryfikuje istnienie projektu i własność
        */
       async verifyProjectOwnership(projectId: string, userId: string, db: DbClient): Promise<void> {
         const { data: project, error } = await db
           .from("travel_projects")
           .select("id, user_id")
           .eq("id", projectId)
           .single();

         if (error || !project) {
           console.error("Project not found or Supabase error:", error);
           throw new ApiError(404, "Project not found");
         }

         if (project.user_id !== userId) {
           console.error(`User ID mismatch - Project user_id: ${project.user_id}, Expected user_id: ${userId}`);
           throw new ApiError(404, "Project not found"); // Don't reveal that the project exists
         }
       }

       /**
        * Tworzy nową notatkę dla projektu
        */
       async createNote(
         projectId: string,
         command: Omit<CreateNoteCommand, "project_id">,
         db: DbClient
       ): Promise<NoteDto> {
         const { data, error } = await db
           .from("notes")
           .insert({
             project_id: projectId,
             content: command.content,
             priority: command.priority,
             place_tags: command.place_tags ?? null,
           })
           .select("id, project_id, content, priority, place_tags, updated_on")
           .single();

         if (error || !data) {
           console.error("Error creating note:", error);
           throw new ApiError(500, "Failed to create note");
         }

         return data as NoteDto;
       }
     }

     export const noteService = new NoteService();
     ```

3. **Implement API route**
   - File: `src/pages/api/projects/[projectId]/notes/index.ts`
   - Handler:

     ```ts
     import type { APIRoute } from "astro";
     import { handleApiError, createSuccessResponse, ApiError } from "../../../../../lib/api-utils";
     import { projectIdParamSchema, createNoteCommandSchema } from "../../../../../lib/schemas/note.schema";
     import { noteService } from "../../../../../services/note.service";
     import { DEFAULT_USER_ID } from "../../../../../db/supabase.client";

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
           throw new ApiError(400, "Invalid JSON format in request body");
         }

         // Krok 4: Walidacja danych wejściowych za pomocą Zod
         const command = createNoteCommandSchema.parse(body);

         // Krok 5: Wywołanie serwisu do utworzenia notatki
         const note = await noteService.createNote(projectId, command, context.locals.supabase);

         // Krok 6: Zwrócenie odpowiedzi 201 Created
         return createSuccessResponse(note, 201);
       } catch (error) {
         return handleApiError(error);
       }
     };

     export const prerender = false;
     ```

4. **Authentication**
   - Currently using `DEFAULT_USER_ID` - JWT authentication will be implemented later.
   - Middleware already provides `context.locals.supabase`.

5. **Testing**
   - Write curl-based tests for Postman import:
     - Invalid projectId format → 400
     - Project not found → 404
     - Invalid payload → 400
     - Successful creation → 201 + returned object
