# API Endpoint Implementation Plan: List Projects

## 1. Endpoint Overview
Retrieve a paginated list of travel projects for the authenticated user.

- **HTTP Method:** GET  
- **URL:** `/api/projects`  
- **Purpose:** Allow users to view all their travel projects with pagination and sorting options.

## 2. Request Details
- **Query Parameters:**
  - `page` (integer, optional, default: 1) - Page number
  - `size` (integer, optional, default: 20) - Items per page
  - `sort` (string, optional, default: "created_on") - Field to sort by
  - `order` (string, optional, default: "desc") - Sort order (asc/desc)

## 3. Used Types
- **ProjectDto** (`src/types.ts`)
- **ProjectsListResponseDto** (`src/types.ts`):
  ```ts
  export type ProjectsListResponseDto = {
    data: ProjectDto[];
    meta: {
      page: number;
      size: number;
      total: number;
    };
  };
  ```

## 4. Response Details
- **200 OK:**
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
- **400 Bad Request:** Invalid query parameters
- **500 Internal Server Error:** Database failures

## 5. Data Flow
1. Parse and validate query parameters (page, size, sort, order)
2. Calculate offset: `(page - 1) * size`
3. Query database for projects belonging to DEFAULT_USER_ID
4. Get total count of projects
5. Return paginated response with metadata

## 6. Security Considerations
- Filter projects by user_id to ensure users only see their own projects
- Validate and sanitize query parameters
- Limit maximum page size to prevent resource exhaustion

## 7. Error Handling
| Scenario                    | Status Code | Handling                    |
|-----------------------------|-------------|-----------------------------|
| Invalid query parameters    | 400         | Zod validation error        |
| Database query error        | 500         | Log and return 500          |

## 8. Performance Considerations
- Use pagination to limit result sets
- Index on user_id and created_on for efficient queries
- Consider caching for frequently accessed data

## 9. Implementation Steps
1. Define query parameter schema in `src/lib/schemas/project.schema.ts`
2. Add `listProjects` method to `ProjectService`
3. Implement GET handler in `src/pages/api/projects/index.ts`
4. Create 5 curl tests

