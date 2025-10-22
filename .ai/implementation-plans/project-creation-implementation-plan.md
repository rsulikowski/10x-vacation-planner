# API Endpoint Implementation Plan: Create Project

## 1. Endpoint Overview
Create a new travel project for the authenticated user.

- **HTTP Method:** POST  
- **URL:** `/api/projects`  
- **Purpose:** Allow a signed-in user to create a new travel project by specifying its name, duration, and optional planned date.

## 2. Request Details
- **Headers:**  
  - `Authorization: Bearer <JWT>`  
- **Request Body (JSON):**
  ```json
  {
    "name": "Trip to Paris",
    "duration_days": 5,
    "planned_date": "2026-03-15"
  }
  ```
- **Parameters:**
  - Required:
    - `name` (string, nonempty)
    - `duration_days` (integer, ≥ 1)
  - Optional:
    - `planned_date` (string matching `YYYY-MM-DD`)

## 3. Used Types
- **CreateProjectCommand** (`src/types.ts`):
  ```ts
  export type CreateProjectCommand = {
    name: string;
    duration_days: number;
    planned_date?: string | null;
  };
  ```
- **ProjectDto** (`src/types.ts`):
  ```ts
  export type ProjectDto = {
    id: string;
    name: string;
    duration_days: number;
    planned_date: string | null;
  };
  ```

## 4. Response Details
- **201 Created:**  
  - Body: the newly created `ProjectDto`, e.g.:
    ```json
    {
      "id": "uuid",
      "name": "Trip to Paris",
      "duration_days": 5,
      "planned_date": "2026-03-15"
    }
    ```
- **400 Bad Request:** malformed JSON or validation failure  
- **401 Unauthorized:** missing or invalid JWT  
- **500 Internal Server Error:** database failures or unexpected errors  

## 5. Data Flow
1. **Authenticate user:**  
   - Call `verifyUser(context)` → returns `userId` or throws `ApiError(401)`.  
2. **Parse & validate input:**  
   - `await context.request.json()` → handle JSON parse errors.  
   - Validate against a Zod schema (`createProjectCommandSchema`).  
3. **Business logic in service:**  
   - `ProjectService.createProject(userId, command, supabase)`  
   - Inserts into `travel_projects`:
     - `user_id = userId`
     - `name`, `duration_days`, `planned_date`
   - Returns inserted row mapped to `ProjectDto`.  
4. **Return response:**  
   - `createSuccessResponse<ProjectDto>(project, 201)`.  
5. **Error handling:**  
   - Catch Zod errors → `handleZodError` (400)  
   - Catch `ApiError` → `createErrorResponse` with its status  
   - Unexpected → 500 via `handleApiError`

## 6. Security Considerations
- **Authentication:** require and validate Bearer JWT using Supabase auth.  
- **Row ownership:** `service.createProject` uses only the verified `userId` (no ability to set arbitrary `user_id`).  
- **Input sanitization:** Zod schema enforces correct types and formats.  
- **SQL injection:** Supabase client is parameterized.  

## 7. Error Handling
| Scenario                                    | Status Code | Handling                                  |
|---------------------------------------------|-------------|-------------------------------------------|
| Missing/invalid Authorization header        | 401         | `ApiError(401, 'Missing or invalid token')` |
| Malformed JSON body                         | 400         | catch JSON parse exception                |
| Schema validation failure (Zod)             | 400         | `handleZodError`                          |
| Database insertion error                    | 500         | log via `console.error`; return 500       |
| Unexpected exception                        | 500         | `handleApiError`                          |

## 8. Performance Considerations
- Single-row insert; no heavy joins or scans.
- Ensure `travel_projects.user_id` is indexed (it is the FK).
- Response payload is minimal.

## 9. Implementation Steps
1. **Define Zod schema**  
   - Create `src/lib/schemas/project.schema.ts`:
     ```ts
     import { z } from 'zod';

     export const createProjectCommandSchema = z.object({
       name: z.string().min(1, 'Name cannot be empty'),
       duration_days: z.number().int().min(1, 'Duration must be at least 1'),
       planned_date: z
         .string()
         .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
         .optional(),
     });
     export type ValidatedCreateProjectCommand = z.infer<typeof createProjectCommandSchema>;
     ```
2. **Create ProjectService**  
   - File: `src/services/project.service.ts`  
   - Method:
     ```ts
     import type { CreateProjectCommand, ProjectDto } from '../types';
     import { ApiError } from '../lib/api-utils';
     import { DEFAULT_USER_ID, supabaseClient } from '../db/supabase.client';

     type DbClient = typeof supabaseClient;

     export class ProjectService {
       async createProject(
         userId: string,
         command: CreateProjectCommand,
         db: DbClient
       ): Promise<ProjectDto> {
         const { data, error } = await db
           .from('travel_projects')
           .insert({ user_id: userId, ...command })
           .select('id, name, duration_days, planned_date')
           .single();

         if (error || !data) {
           console.error('Error creating project:', error);
           throw new ApiError(500, 'Failed to create project');
         }
         return data as ProjectDto;
       }
     }

     export const projectService = new ProjectService();
     ```
3. **Implement API route**  
   - File: `src/pages/api/projects/index.ts`  
   - Handler:
     ```ts
     import type { APIRoute } from 'astro';
     import { verifyUser, handleApiError, createSuccessResponse } from '../../../lib/api-utils';
     import { createProjectCommandSchema } from '../../../lib/schemas/project.schema';
     import { projectService } from '../../../services/project.service';

     export const POST: APIRoute = async (context) => {
       try {
         const userId = await verifyUser(context);
         let body: unknown;
         try {
           body = await context.request.json();
         } catch {
           throw new ApiError(400, 'Invalid JSON');
         }
         const command = createProjectCommandSchema.parse(body);
         const project = await projectService.createProject(userId, command, context.locals.supabase);
         return createSuccessResponse(project, 201);
       } catch (err) {
         return handleApiError(err);
       }
     };
     ```
4. **Wire up authentication**  
   - Ensure `src/middleware/index.ts` applies Supabase client and that `verifyUser` is available.  
   - Confirm `context.locals.supabase` is the Supabase client.  
5. **Testing**  
   - Write minimal integration tests for happy path and error cases:  
     - Missing token → 401  
     - Invalid payload → 400  
     - Successful creation → 201 + returned object  
