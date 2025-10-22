# Quick Tests for All REST API Endpoints

Replace `{{BASE_URL}}`, `{{PROJECT_ID}}`, and `{{NOTE_ID}}` with actual values.

## Projects Endpoints

### 1. Create Project (POST /api/projects)
```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{"name": "Summer Vacation", "duration_days": 7, "planned_date": "2026-06-15"}'
```

### 2. List Projects (GET /api/projects)
```bash
curl -X GET "{{BASE_URL}}/api/projects?page=1&size=20&sort=created_on&order=desc"
```

### 3. Get Project (GET /api/projects/{projectId})
```bash
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}"
```

### 4. Update Project (PATCH /api/projects/{projectId})
```bash
curl -X PATCH "{{BASE_URL}}/api/projects/{{PROJECT_ID}}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Vacation", "duration_days": 10}'
```

### 5. Delete Project (DELETE /api/projects/{projectId})
```bash
curl -X DELETE "{{BASE_URL}}/api/projects/{{PROJECT_ID}}"
```

---

## Notes Endpoints

### 6. Create Note (POST /api/projects/{projectId}/notes)
```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Visit Eiffel Tower", "priority": 1, "place_tags": ["Paris", "Landmarks"]}'
```

### 7. List Notes (GET /api/projects/{projectId}/notes)
```bash
# Basic list
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes"

# With filters
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes?priority=1&page=1&size=10"

# Filter by place tag
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes?place_tag=Paris"
```

### 8. Get Note (GET /api/projects/{projectId}/notes/{noteId})
```bash
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes/{{NOTE_ID}}"
```

### 9. Update Note (PATCH /api/projects/{projectId}/notes/{noteId})
```bash
curl -X PATCH "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes/{{NOTE_ID}}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Updated: Visit Eiffel Tower at sunset", "priority": 2}'
```

### 10. Delete Note (DELETE /api/projects/{projectId}/notes/{noteId})
```bash
curl -X DELETE "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes/{{NOTE_ID}}"
```

---

## AI Plan Generation

### 11. Generate Plan (POST /api/projects/{projectId}/plan)
```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "notes": [
      {"id": "uuid", "content": "Visit Eiffel Tower", "priority": 1, "place_tags": ["Paris"]},
      {"id": "uuid", "content": "Louvre Museum", "priority": 2, "place_tags": ["Paris"]}
    ],
    "preferences": {"categories": ["culture", "history"]}
  }'
```

---

## Complete Workflow Example

```bash
# 1. Create a project
PROJECT_RESPONSE=$(curl -s -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{"name": "Paris Trip", "duration_days": 5, "planned_date": "2026-05-01"}')

PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.id')
echo "Created project: $PROJECT_ID"

# 2. Add some notes
NOTE1=$(curl -s -X POST "{{BASE_URL}}/api/projects/$PROJECT_ID/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Visit Eiffel Tower", "priority": 1, "place_tags": ["Paris"]}' | jq -r '.id')

NOTE2=$(curl -s -X POST "{{BASE_URL}}/api/projects/$PROJECT_ID/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Louvre Museum", "priority": 1, "place_tags": ["Paris"]}' | jq -r '.id')

echo "Created notes: $NOTE1, $NOTE2"

# 3. List all notes
curl -s -X GET "{{BASE_URL}}/api/projects/$PROJECT_ID/notes" | jq

# 4. Generate plan
curl -s -X POST "{{BASE_URL}}/api/projects/$PROJECT_ID/plan" \
  -H "Content-Type: application/json" \
  -d "{\"model\": \"gpt-4\", \"notes\": [{\"id\": \"$NOTE1\", \"content\": \"Visit Eiffel Tower\", \"priority\": 1, \"place_tags\": [\"Paris\"]}, {\"id\": \"$NOTE2\", \"content\": \"Louvre Museum\", \"priority\": 1, \"place_tags\": [\"Paris\"]}]}" | jq

# 5. Update project
curl -s -X PATCH "{{BASE_URL}}/api/projects/$PROJECT_ID" \
  -H "Content-Type: application/json" \
  -d '{"duration_days": 7}' | jq

# 6. Get updated project
curl -s -X GET "{{BASE_URL}}/api/projects/$PROJECT_ID" | jq
```

---

## Error Test Cases

### Invalid UUID Format (400)
```bash
curl -X GET "{{BASE_URL}}/api/projects/not-a-uuid"
```

### Project Not Found (404)
```bash
curl -X GET "{{BASE_URL}}/api/projects/00000000-0000-0000-0000-000000000000"
```

### Invalid Pagination (400)
```bash
curl -X GET "{{BASE_URL}}/api/projects?page=0"
```

### Empty Content (400)
```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "", "priority": 1}'
```

### Invalid Priority (400)
```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test", "priority": 5}'
```

