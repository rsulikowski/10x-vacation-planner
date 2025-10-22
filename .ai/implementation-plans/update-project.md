# API Endpoint Implementation Plan: Update Project

## 1. Endpoint Overview
Update an existing travel project.

- **HTTP Method:** PATCH  
- **URL:** `/api/projects/{projectId}`  
- **Purpose:** Update project fields (all optional).

## 2. Request Details
- **URL Parameters:** `projectId` (UUID)
- **Request Body:** Same as create (all optional)
  ```json
  { "name": "string", "duration_days": integer, "planned_date": "YYYY-MM-DD" }
  ```

## 3. Used Types
- **UpdateProjectCommand** (`src/types.ts`)
- **ProjectDto** (`src/types.ts`)

## 4. Response Details
- **200 OK:** Updated project
- **400 Bad Request:** Invalid input
- **404 Not Found:** Project not found
- **500 Internal Server Error:** Database failures

## 5. Implementation Steps
1. Define `updateProjectCommandSchema` in schemas
2. Add `updateProject` method to `ProjectService`
3. Add PATCH handler to `src/pages/api/projects/[projectId]/index.ts`

