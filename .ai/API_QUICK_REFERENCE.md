# API Quick Reference Guide

Base URL: `http://localhost:4321/api` (or your deployment URL)

## Projects API

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/projects` | Create project | DEFAULT_USER_ID |
| GET | `/projects` | List projects | DEFAULT_USER_ID |
| GET | `/projects/{id}` | Get project | DEFAULT_USER_ID |
| PATCH | `/projects/{id}` | Update project | DEFAULT_USER_ID |
| DELETE | `/projects/{id}` | Delete project | DEFAULT_USER_ID |

### Create Project
```json
POST /projects
{
  "name": "Summer Trip",
  "duration_days": 7,
  "planned_date": "2026-06-15"  // optional
}
→ 201 Created
```

### List Projects
```
# All parameters are optional!
GET /projects
GET /projects?page=1&size=20
GET /projects?sort=name&order=asc
→ 200 OK
{
  "data": [...],
  "meta": { "page": 1, "size": 20, "total": 5 }
}

# Defaults: page=1, size=20, sort=created_on, order=desc
```

### Update Project
```json
PATCH /projects/{id}
{
  "name": "Updated Trip",  // all fields optional
  "duration_days": 10
}
→ 200 OK
```

### Delete Project
```
DELETE /projects/{id}
→ 204 No Content
```

---

## Notes API

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/projects/{projectId}/notes` | Create note | DEFAULT_USER_ID |
| GET | `/projects/{projectId}/notes` | List notes | DEFAULT_USER_ID |
| GET | `/projects/{projectId}/notes/{noteId}` | Get note | DEFAULT_USER_ID |
| PATCH | `/projects/{projectId}/notes/{noteId}` | Update note | DEFAULT_USER_ID |
| DELETE | `/projects/{projectId}/notes/{noteId}` | Delete note | DEFAULT_USER_ID |

### Create Note
```json
POST /projects/{projectId}/notes
{
  "content": "Visit Eiffel Tower",
  "priority": 1,  // 1=high, 2=medium, 3=low
  "place_tags": ["Paris", "Landmarks"]  // optional
}
→ 201 Created
```

### List Notes
```
# All parameters are optional!
GET /projects/{projectId}/notes
GET /projects/{projectId}/notes?page=1&size=20
GET /projects/{projectId}/notes?priority=1
GET /projects/{projectId}/notes?place_tag=Paris
→ 200 OK
{
  "data": [...],
  "meta": { "page": 1, "size": 20, "total": 3 }
}

# Defaults: page=1, size=20
```

### Update Note
```json
PATCH /projects/{projectId}/notes/{noteId}
{
  "content": "Updated content",  // all fields optional
  "priority": 2
}
→ 200 OK
```

### Delete Note
```
DELETE /projects/{projectId}/notes/{noteId}
→ 204 No Content
```

---

## AI Plan Generation

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/projects/{projectId}/plan` | Generate AI plan | DEFAULT_USER_ID |

### Generate Plan
```json
POST /projects/{projectId}/plan
{
  "model": "gpt-4",
  "notes": [
    {
      "id": "uuid",
      "content": "Visit Eiffel Tower",
      "priority": 1,
      "place_tags": ["Paris"]
    }
  ],
  "preferences": {  // optional
    "categories": ["culture", "history"]
  }
}
→ 200 OK
{
  "schedule": [
    { "day": 1, "activities": ["Morning: Eiffel Tower", "..."] }
  ]
}
```

---

## Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful read/update |
| 201 | Created | Successful create |
| 204 | No Content | Successful delete |
| 400 | Bad Request | Validation error, invalid input |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Database/server error |

---

## Common Parameters

**⚠️ ALL PARAMETERS ARE OPTIONAL** - The API works without any parameters!

### Pagination (Optional)
- `page` (integer, optional, default: 1) - Page number
- `size` (integer, optional, default: 20, max: 100) - Items per page

### Projects Sorting (Optional)
- `sort` (string, optional, default: "created_on") - Field to sort by
  - Options: `created_on`, `name`, `duration_days`, `planned_date`
  - Invalid values are ignored and default to `created_on`
- `order` (string, optional, default: "desc") - Sort order
  - Options: `asc`, `desc`
  - Invalid values are ignored and default to `desc`

### Notes Filtering (Optional)
- `priority` (integer, optional, 1-3) - Filter by priority
  - Invalid values are ignored (no filtering applied)
- `place_tag` (string, optional) - Filter by place tag

---

## Validation Rules

### Projects
- `name`: non-empty string (required)
- `duration_days`: integer ≥ 1 (required)
- `planned_date`: YYYY-MM-DD format (optional)

### Notes
- `content`: non-empty string (required)
- `priority`: integer 1-3 (required)
  - 1 = High priority
  - 2 = Medium priority
  - 3 = Low priority
- `place_tags`: array of strings (optional)

### AI Plan
- `model`: one of ["gpt-4", "gpt-5", "claude-3-opus", "claude-3.5-sonnet"]
- `notes`: array, 1-100 items
- `preferences.categories`: array of strings (optional)

---

## Error Response Format

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_small",
      "path": ["duration_days"],
      "message": "Duration must be at least 1"
    }
  ]
}
```

---

## Quick Start Example

```bash
# 1. Create a project
curl -X POST http://localhost:4321/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Paris Trip", "duration_days": 5}'

# Response: { "id": "abc-123", ... }

# 2. Add a note
curl -X POST http://localhost:4321/api/projects/abc-123/notes \
  -H "Content-Type: application/json" \
  -d '{"content": "Visit Louvre", "priority": 1, "place_tags": ["Paris"]}'

# 3. List all notes
curl http://localhost:4321/api/projects/abc-123/notes

# 4. Generate plan
curl -X POST http://localhost:4321/api/projects/abc-123/plan \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4", "notes": [{"id": "note-id", "content": "Visit Louvre", "priority": 1, "place_tags": ["Paris"]}]}'
```

---

## Files & Schemas

### Service Files
- `src/services/project.service.ts` - Project operations
- `src/services/note.service.ts` - Note operations
- `src/services/plan.service.ts` - AI plan generation
- `src/services/ai.service.mock.ts` - Mock AI service

### Schema Files
- `src/lib/schemas/project.schema.ts` - Project validation
- `src/lib/schemas/note.schema.ts` - Note validation
- `src/lib/schemas/plan.schema.ts` - Plan validation

### Utility Files
- `src/lib/api-utils.ts` - Error handling, responses, auth helpers
- `src/types.ts` - TypeScript type definitions

---

## Testing

See test files:
- `.ai/project-creation-tests.md` (10 test cases)
- `.ai/note-creation-tests.md` (14 test cases)
- `.ai/implementation-plans/all-endpoints-tests.md` (All endpoints)

Import curl commands to Postman for easy testing.

---

## Current Limitations

⚠️ **Authentication**: Currently using `DEFAULT_USER_ID` constant
- JWT authentication planned for future implementation
- All endpoints will require Bearer token authentication

✅ **Database**: Full PostgreSQL via Supabase
✅ **Validation**: Comprehensive Zod schemas
✅ **Error Handling**: Centralized and consistent
✅ **Documentation**: Complete JSDoc comments

