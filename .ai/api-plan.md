# REST API Plan

## 1. Resources
- **User** (`users`)
- **Travel Project** (`travel_projects`)
- **Note** (`notes`)
- **AI Log** (`ai_logs`)

## 2. Endpoints


### 2.2 Profile & Preferences

#### Get Profile
- Method: GET
- Path: `/users/me`
- Description: Get current user profile
- Response (200):
  ```json
  { "id": "uuid", "email": "string", "preferences": {"categories": []} }
  ```

#### Update Preferences
- Method: PATCH
- Path: `/users/me/preferences`
- Description: Update tourism preferences
- Request:
  ```json
  { "preferences": { "categories": ["beach", "mountains"] } }
  ```
- Response (200):
  ```json
  { "preferences": { ... } }
  ```

### 2.3 Travel Projects

#### List Projects
- Method: GET
- Path: `/projects`
- Description: Paginated list of user’s projects
- Query Params: `?page=1&size=20&sort=created_on&order=desc`
- Response (200):
  ```json
  { "data": [ { "id": "uuid", "name": "string", "duration_days": 3, "planned_date": "YYYY-MM-DD" } ], "meta": { "page":1,"size":20,"total":N } }
  ```

#### Create Project
- Method: POST
- Path: `/projects`
- Request:
  ```json
  { "name": "string", "duration_days": integer, "planned_date": "YYYY-MM-DD" }
  ```
- Response (201): Created project object
- Validation: `name` nonempty, `duration_days` ≥1

#### Get Project
- Method: GET
- Path: `/projects/{projectId}`

#### Update Project
- Method: PATCH
- Path: `/projects/{projectId}`
- Request: same as create (all optional)

#### Delete Project
- Method: DELETE
- Path: `/projects/{projectId}`

### 2.4 Notes

#### List Notes
- Method: GET
- Path: `/projects/{projectId}/notes`
- Query: `?page=1&size=20&priority=1&place_tag=Paris`

#### Create Note
- Method: POST
- Path: `/projects/{projectId}/notes`
- Request:
  ```json
  { "content":"string","priority":1,"place_tags":["string"] }
  ```
- Response (201): Created note object
- Validation: `content` nonempty, `priority` between 1 and 3

#### Get Note
- Method: GET
- Path: `/projects/{projectId}/notes/{noteId}`

#### Update Note
- Method: PATCH
- Path: `/projects/{projectId}/notes/{noteId}`

#### Delete Note
- Method: DELETE
- Path: `/projects/{projectId}/notes/{noteId}`

### 2.5 AI Plan Generation

#### Generate Plan
- Method: POST
- Path: `/projects/{projectId}/plan`
- Description: Synchronous AI plan generation
- Request:
  ```json
  {
    "model": "gpt-5",                   // AI model to use
    "notes": [                           // all notes in project
      { "id": "uuid", "content": "string", "priority": 1, "place_tags": ["string"] }
    ],
    "preferences": { "categories": ["string"] }  // user profile preferences
  }
  ```
- Response (200):
  ```json
  { "schedule": [ { "day":1,"activities":["..."] } ] }
  ```
- Errors:
  - 400: Invalid Input
  - 500: AI service errors
- On request, server logs to `ai_logs` with status `pending`, updates to `success`/`failure` and increments `version`

#### Get AI Logs
- Method: GET
- Path: `/projects/{projectId}/logs`
- Query: `?page=1&size=20`

#### Get AI Log by ID
- Method: GET
- Path: `/projects/{projectId}/logs/{logId}`
- Description: Retrieve a specific AI log entry
- Response (200):
  ```json
  { "id": "uuid", "project_id": "uuid", "prompt": "string", "response": {}, "status": "success", "duration_ms": 123, "version": 1, "created_on": "timestamp" }
  ```

#### List Failed AI Logs
- Method: GET
- Path: `/logs/failed`
- Description: Retrieve all AI log entries with status failure
- Query Params: `?page=1&size=20`
- Response (200):
  ```json
  { "data": [ /* array of ai_logs with status='failure' */ ], "meta": { "page":1,"size":20,"total":N } }
  ```

## 3. Authentication and Authorization
- Token-based authentication using Supabase Auth via `Authorization: Bearer <token>` header
- Users authenticate via `/auth/register` or `/auth/login` to receive a bearer token
- Protected endpoints require a valid token; user_id is enforced as JWT sub
- RLS policies enforced at DB layer where possible

## 4. Validation and Business Logic

### Validation
- `users.email`: valid email format
- `password`: minimum 8 chars
- `projects.name`: nonempty
- `duration_days` (optional): integer ≥1
- `planned_date` (optional): valid date
- `notes.content`: nonempty
- `priority`: integer 1–3
- `place_tags` (optional): array of strings

### Business Logic
- AI plan generation: synchronous call with spinner and retry on failure
- Log all AI interactions in `