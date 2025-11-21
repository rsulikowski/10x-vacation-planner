# API Endpoint Implementation Plan: Get Project

## 1. Endpoint Overview

Retrieve a single travel project by ID.

- **HTTP Method:** GET
- **URL:** `/api/projects/{projectId}`
- **Purpose:** Get detailed information about a specific project.

## 2. Request Details

- **URL Parameters:**
  - `projectId` (string, UUID) - The ID of the project

## 3. Used Types

- **ProjectDto** (`src/types.ts`)

## 4. Response Details

- **200 OK:** Project object
- **400 Bad Request:** Invalid UUID format
- **404 Not Found:** Project not found or not owned by user
- **500 Internal Server Error:** Database failures

## 5. Data Flow

1. Validate projectId from URL
2. Query database for project with matching ID and user_id
3. Return project or 404

## 6. Implementation Steps

1. Add `getProject` method to `ProjectService`
2. Create GET handler in `src/pages/api/projects/[projectId]/index.ts`
3. Add tests
