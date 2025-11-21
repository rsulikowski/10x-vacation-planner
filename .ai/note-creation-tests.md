# API Tests for POST /api/projects/{projectId}/notes

This file contains curl commands for testing the POST `/api/projects/{projectId}/notes` endpoint. These commands can be imported into Postman or executed directly from the command line.

## Setup

Replace the following placeholders before running the tests:

- `{{BASE_URL}}` - Your API base URL (e.g., `http://localhost:4321` or `https://your-domain.com`)
- `{{PROJECT_ID}}` - A valid project ID (UUID) that belongs to the DEFAULT_USER_ID
- `{{INVALID_PROJECT_ID}}` - A valid UUID that doesn't exist or doesn't belong to the user

**Note:** Authentication is currently using `DEFAULT_USER_ID` from the codebase. JWT authentication will be implemented later.

## Test Cases

### 1. Successful Note Creation (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Visit Eiffel Tower at sunset",
    "priority": 1,
    "place_tags": ["Paris", "Monuments"]
  }'
```

**Expected Response (201):**

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

---

### 2. Successful Note Creation Without Place Tags (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Book hotel for 3 nights",
    "priority": 2
  }'
```

**Expected Response (201):**

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "content": "Book hotel for 3 nights",
  "priority": 2,
  "place_tags": null,
  "updated_on": "2025-10-21T12:00:00Z"
}
```

---

### 3. Successful Note Creation with Null Place Tags (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Low priority reminder",
    "priority": 3,
    "place_tags": null
  }'
```

**Expected Response (201):**

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "content": "Low priority reminder",
  "priority": 3,
  "place_tags": null,
  "updated_on": "2025-10-21T12:00:00Z"
}
```

---

### 4. Invalid Project ID Format (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/not-a-valid-uuid/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This should fail",
    "priority": 1
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "validation": "uuid",
      "code": "invalid_string",
      "message": "Project ID must be a valid UUID",
      "path": []
    }
  ]
}
```

---

### 5. Project Not Found (404 Not Found)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{INVALID_PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This project does not exist",
    "priority": 1
  }'
```

**Expected Response (404):**

```json
{
  "error": "API Error",
  "message": "Project not found"
}
```

---

### 6. Invalid JSON Format (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d 'this is not valid json'
```

**Expected Response (400):**

```json
{
  "error": "API Error",
  "message": "Invalid JSON format in request body"
}
```

---

### 7. Empty Content (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "",
    "priority": 1
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Content cannot be empty",
      "path": ["content"]
    }
  ]
}
```

---

### 8. Missing Content Field (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "priority": 1
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["content"],
      "message": "Required"
    }
  ]
}
```

---

### 9. Priority Below Minimum (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Invalid priority note",
    "priority": 0
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Priority must be between 1 and 3",
      "path": ["priority"]
    }
  ]
}
```

---

### 10. Priority Above Maximum (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Invalid priority note",
    "priority": 4
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_big",
      "maximum": 3,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Priority must be between 1 and 3",
      "path": ["priority"]
    }
  ]
}
```

---

### 11. Non-Integer Priority (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Decimal priority note",
    "priority": 1.5
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "integer",
      "received": "float",
      "path": ["priority"],
      "message": "Expected integer, received float"
    }
  ]
}
```

---

### 12. Missing Priority Field (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Missing priority note"
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "undefined",
      "path": ["priority"],
      "message": "Required"
    }
  ]
}
```

---

### 13. Invalid Place Tags Type (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Invalid tags note",
    "priority": 1,
    "place_tags": "should-be-array"
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "array",
      "received": "string",
      "path": ["place_tags"],
      "message": "Expected array, received string"
    }
  ]
}
```

---

### 14. Empty Array for Place Tags (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Note with empty tags array",
    "priority": 2,
    "place_tags": []
  }'
```

**Expected Response (201):**

```json
{
  "id": "uuid",
  "project_id": "uuid",
  "content": "Note with empty tags array",
  "priority": 2,
  "place_tags": [],
  "updated_on": "2025-10-21T12:00:00Z"
}
```

---

## Postman Import Instructions

To import these tests into Postman:

1. Open Postman
2. Create a new Collection named "VacationPlanner API - Notes"
3. Add environment variables:
   - `BASE_URL`: Your API base URL (e.g., `http://localhost:4321`)
   - `PROJECT_ID`: A valid project UUID from your database
   - `INVALID_PROJECT_ID`: A valid UUID format that doesn't exist (e.g., `00000000-0000-0000-0000-000000000000`)
4. For each test case above:
   - Click "Add Request"
   - Set the method to POST
   - Enter the URL: `{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes` (or with `{{INVALID_PROJECT_ID}}` for test #5)
   - Add headers as specified
   - Paste the JSON body in the Body tab (select "raw" and "JSON")
   - Name the request according to the test case
5. Run the entire collection or individual requests to verify the endpoint

## Getting a Valid Project ID

To get a valid `PROJECT_ID` for testing:

1. First create a project using the POST `/api/projects` endpoint
2. Copy the `id` from the response
3. Use that ID as your `{{PROJECT_ID}}` variable in Postman

Example:

```bash
# Create a project first
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "duration_days": 5
  }'

# Use the returned ID for note creation tests
```

## Notes

- All successful requests return status code 201 (Created)
- All validation errors return status code 400 (Bad Request)
- Project not found errors return status code 404 (Not Found)
- Database errors would return status code 500 (Internal Server Error)
- The `id` and `updated_on` fields in successful responses are generated by the database
- Authentication is currently using `DEFAULT_USER_ID` - JWT authentication will be implemented later
- Priority values: 1 (high), 2 (medium), 3 (low)
- `place_tags` can be omitted, set to `null`, or be an array of strings (including empty array)
