# API Tests for GET /api/projects

## Test Cases

### 1. List Projects - Default Parameters (200 OK)

```bash
curl -X GET "{{BASE_URL}}/api/projects"
```

**Expected Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Trip to Paris",
      "duration_days": 5,
      "planned_date": "2026-03-15"
    }
  ],
  "meta": {
    "page": 1,
    "size": 20,
    "total": 1
  }
}
```

### 2. List Projects - With Pagination (200 OK)

```bash
curl -X GET "{{BASE_URL}}/api/projects?page=1&size=10"
```

### 3. List Projects - With Sorting (200 OK)

```bash
curl -X GET "{{BASE_URL}}/api/projects?sort=name&order=asc"
```

### 4. Invalid Page Number (400 Bad Request)

```bash
curl -X GET "{{BASE_URL}}/api/projects?page=0"
```

**Expected Response (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [...]
}
```

### 5. Invalid Size (400 Bad Request)

```bash
curl -X GET "{{BASE_URL}}/api/projects?size=200"
```
