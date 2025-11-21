# API Tests for POST /api/projects

This file contains curl commands for testing the POST `/api/projects` endpoint. These commands can be imported into Postman or executed directly from the command line.

## Setup

Replace the following placeholder before running the tests:

- `{{BASE_URL}}` - Your API base URL (e.g., `http://localhost:4321` or `https://your-domain.com`)

**Note:** Authentication is currently using `DEFAULT_USER_ID` from the codebase. JWT authentication will be implemented later.

## Test Cases

### 1. Successful Project Creation (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trip to Paris",
    "duration_days": 5,
    "planned_date": "2026-03-15"
  }'
```

**Expected Response (201):**

```json
{
  "id": "uuid",
  "name": "Trip to Paris",
  "duration_days": 5,
  "planned_date": "2026-03-15"
}
```

---

### 2. Successful Project Creation Without Planned Date (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekend Getaway",
    "duration_days": 3
  }'
```

**Expected Response (201):**

```json
{
  "id": "uuid",
  "name": "Weekend Getaway",
  "duration_days": 3,
  "planned_date": null
}
```

---

### 3. Invalid JSON Format (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
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

### 4. Empty Project Name (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "duration_days": 5
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
      "message": "Name cannot be empty",
      "path": ["name"]
    }
  ]
}
```

---

### 5. Missing Name Field (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "duration_days": 5
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
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

---

### 6. Invalid Duration (Less Than 1) (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Duration Trip",
    "duration_days": 0
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
      "message": "Duration must be at least 1",
      "path": ["duration_days"]
    }
  ]
}
```

---

### 7. Invalid Duration (Non-Integer) (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Decimal Duration Trip",
    "duration_days": 5.5
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
      "path": ["duration_days"],
      "message": "Expected integer, received float"
    }
  ]
}
```

---

### 8. Invalid Date Format (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Date Trip",
    "duration_days": 5,
    "planned_date": "15-03-2026"
  }'
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "validation": "regex",
      "code": "invalid_string",
      "message": "Invalid date format (YYYY-MM-DD)",
      "path": ["planned_date"]
    }
  ]
}
```

---

### 9. Missing Duration Days (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Missing Duration Trip"
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
      "path": ["duration_days"],
      "message": "Required"
    }
  ]
}
```

---

### 10. Null Planned Date (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trip with Null Date",
    "duration_days": 7,
    "planned_date": null
  }'
```

**Expected Response (201):**

```json
{
  "id": "uuid",
  "name": "Trip with Null Date",
  "duration_days": 7,
  "planned_date": null
}
```

---

## Postman Import Instructions

To import these tests into Postman:

1. Open Postman
2. Create a new Collection named "VacationPlanner API"
3. Add environment variable:
   - `BASE_URL`: Your API base URL (e.g., `http://localhost:4321`)
4. For each test case above:
   - Click "Add Request"
   - Set the method to POST
   - Enter the URL: `{{BASE_URL}}/api/projects`
   - Add headers as specified
   - Paste the JSON body in the Body tab (select "raw" and "JSON")
   - Name the request according to the test case
5. Run the entire collection or individual requests to verify the endpoint

## Notes

- All successful requests return status code 201 (Created)
- All validation errors return status code 400 (Bad Request)
- Database errors would return status code 500 (Internal Server Error)
- The `id` field in successful responses will be a valid UUID generated by the database
- Authentication is currently using `DEFAULT_USER_ID` - JWT authentication will be implemented later
