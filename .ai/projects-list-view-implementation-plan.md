# View Implementation Plan: Projects List

## 1. Overview

This document outlines the implementation plan for the Projects List view. The primary purpose of this view is to allow users to see a paginated list of their travel projects, and to perform Create, Read, Update, and Delete (CRUD) operations on them. The view will feature a main list display, a button to initiate project creation, and modals for creating/editing and confirming deletion of a project.

## 2. View Routing

The Projects List view will be accessible at the following application path:

- **Path**: `/projects`

This will be an Astro page (`src/pages/projects/index.astro`) that mounts a client-side rendered React component to handle the dynamic functionality.

## 3. Component Structure

The view will be composed of several React components, organized in a hierarchical structure. We will leverage `shadcn/ui` for base components like buttons, modals, and inputs.

```
/projects (src/pages/projects/index.astro)
└── ProjectsPage.tsx (React Client Component)
    ├── Header (with "New Project" Button)
    ├── ProjectsList
    │   ├── ProjectListItem (mapped from project data)
    │   │   ├── Project Details (Name, Duration, Date)
    │   │   ├── Edit Button
    │   │   └── Delete Button
    │   └── EmptyStateView (shown if no projects exist)
    ├── PaginationControls
    ├── ProjectFormModal (Dialog for Create/Edit)
    │   └── Form (with inputs for name, duration, date)
    └── DeleteConfirmationDialog (AlertDialog for Delete)
```

## 4. Component Details

### `ProjectsPage` (Container)

- **Component description**: The main client-side entry point that orchestrates the entire view. It manages application state, API calls, and controls the visibility and data for modals.
- **Main elements**: Renders `ProjectsList`, `PaginationControls`, and the "New Project" button. It also conditionally renders `ProjectFormModal` and `DeleteConfirmationDialog`.
- **Handled interactions**:
  - Clicking "New Project" button to open the creation modal.
  - Clicking "Edit" on a `ProjectListItem` to open the edit modal.
  - Clicking "Delete" on a `ProjectListItem` to open the confirmation dialog.
  - Handling page changes from `PaginationControls`.
- **Types**: `ProjectsListResponseDto`, `ProjectDto`, `PaginationMetaDto`, `ModalState`.
- **Props**: None.

### `ProjectsList`

- **Component description**: A presentational component that renders the list of projects or an empty state message.
- **Main elements**: A `<ul>` or `<div>` that maps over the project data to render `ProjectListItem` components. If the data array is empty, it renders the `EmptyStateView`.
- **Handled interactions**: Bubbles up `onEdit` and `onDelete` events from `ProjectListItem` to the `ProjectsPage` parent.
- **Types**: `ProjectDto[]`.
- **Props**:
  - `projects: ProjectDto[]`
  - `onEdit: (project: ProjectDto) => void`
  - `onDelete: (project: ProjectDto) => void`

### `ProjectFormModal`

- **Component description**: A modal dialog for creating or editing a project. It contains a form with input fields and validation.
- **Main elements**: `Dialog` (shadcn), `form`, `Input` for name and duration, `DatePicker` for planned date, `Button` for Save/Cancel.
- **Handled interactions**:
  - Form submission.
  - Input field changes.
  - Closing the modal via Cancel button or overlay click.
- **Handled validation**:
  - `name`: required, must not be empty.
  - `duration_days`: required, must be an integer greater than or equal to 1.
  - `planned_date`: optional, must be a valid date if provided.
- **Types**: `ProjectFormViewModel`, `CreateProjectCommand`, `UpdateProjectCommand`, `ProjectDto`.
- **Props**:
  - `isOpen: boolean`
  - `mode: 'create' | 'edit'`
  - `initialData?: ProjectDto`
  - `onSubmit: (formData: ProjectFormViewModel) => void`
  - `onClose: () => void`

### `DeleteConfirmationDialog`

- **Component description**: A simple modal to confirm that the user wants to delete a project, preventing accidental deletion.
- **Main elements**: `AlertDialog` (shadcn), text displaying the name of the project to be deleted, "Confirm" and "Cancel" buttons.
- **Handled interactions**:
  - Clicking "Confirm" to trigger the delete action.
  - Clicking "Cancel" to close the dialog.
- **Types**: `ProjectDto`.
- **Props**:
  - `isOpen: boolean`
  - `project: ProjectDto | null`
  - `onConfirm: () => void`
  - `onCancel: () => void`

### `PaginationControls`

- **Component description**: Renders pagination buttons and displays the current page information.
- **Main elements**: "Previous" and "Next" buttons, text indicating `Page X of Y`.
- **Handled interactions**: Clicking "Previous" or "Next" to change the current page.
- **Types**: `PaginationMetaDto`.
- **Props**:
  - `meta: PaginationMetaDto`
  - `onPageChange: (newPage: number) => void`

## 5. Types

The implementation will use existing DTOs for API communication and introduce new ViewModels for managing component state.

- **`ProjectDto`** (API): `{ id, name, duration_days, planned_date }`
- **`ProjectsListResponseDto`** (API): `{ data: ProjectDto[]; meta: PaginationMetaDto }`
- **`CreateProjectCommand`** (API): `{ name, duration_days, planned_date? }`
- **`UpdateProjectCommand`** (API): `{ name?, duration_days?, planned_date? }`

- **`ProjectFormViewModel`** (New ViewModel): Represents the state of the project creation/edit form.

  ```typescript
  interface ProjectFormViewModel {
    name: string;
    duration_days: string; // Use string for input flexibility, parse on submit
    planned_date: Date | null; // Use Date object for date picker components
  }
  ```

- **`ModalState`** (New ViewModel): A discriminated union to manage the state of all modals in the view, ensuring type safety.
  ```typescript
  type ModalState =
    | { type: "closed" }
    | { type: "create_project" }
    | { type: "edit_project"; project: ProjectDto }
    | { type: "delete_project"; project: ProjectDto };
  ```

## 6. State Management

We will use **TanStack Query (`@tanstack/react-query`)** for server state management. This is ideal for handling data fetching, caching, and mutations (create, update, delete) declaratively.

- **`useQuery`**: Will be used to fetch the paginated list of projects. The query key will include the page number and other filters, e.g., `['projects', { page: 1, size: 10 }]`.
- **`useMutation`**: Separate mutations will be defined for `createProject`, `updateProject`, and `deleteProject`.
- **Callbacks**: The `onSuccess` callbacks for mutations will be used to invalidate the `['projects']` query key, automatically triggering a refetch of the project list to display the latest data.
- **Local State**: Standard React `useState` will be used for managing UI state, such as the current page number and the `ModalState`.

A custom hook, `useProjectsPage`, will encapsulate all this logic to keep the `ProjectsPage` component clean.

## 7. API Integration

The view will interact with the `/api/projects` endpoints. All communication will be handled via `fetch` or a lightweight wrapper like `axios`.

- **`GET /api/projects?page={page}&size={size}`**:
  - **Action**: Fetch the list of projects for the current page.
  - **Response Type**: `ProjectsListResponseDto`.
- **`POST /api/projects`**:
  - **Action**: Create a new project.
  - **Request Type**: `CreateProjectCommand`. The `ProjectFormViewModel` will be transformed into this type before sending.
  - **Response Type**: `ProjectDto`.
- **`PATCH /api/projects/{projectId}`**:
  - **Action**: Update an existing project.
  - **Request Type**: `UpdateProjectCommand`.
  - **Response Type**: `ProjectDto`.
- **`DELETE /api/projects/{projectId}`**:
  - **Action**: Delete a project.
  - **Response Type**: `204 No Content`.

## 8. User Interactions

- **View Projects**: On page load, the first page of projects is fetched and displayed.
- **Navigate Pages**: User clicks "Next" or "Previous" on `PaginationControls`. The `onPageChange` event updates the page number in state, triggering a new API call via TanStack Query.
- **Create Project**:
  1. User clicks the "New Project" button.
  2. The `ProjectFormModal` opens in 'create' mode with an empty form.
  3. User fills the form and clicks "Save".
  4. The `onSubmit` handler triggers the `createProject` mutation. On success, the modal closes and the project list is refreshed.
- **Edit Project**:
  1. User clicks the "Edit" button on a `ProjectListItem`.
  2. The `ProjectFormModal` opens in 'edit' mode, pre-filled with that project's data.
  3. User modifies the form and clicks "Save".
  4. The `onSubmit` handler triggers the `updateProject` mutation. On success, the modal closes and the list is refreshed.
- **Delete Project**:
  1. User clicks the "Delete" button on a `ProjectListItem`.
  2. The `DeleteConfirmationDialog` opens, showing the project name.
  3. User clicks "Confirm".
  4. The `onConfirm` handler triggers the `deleteProject` mutation. On success, the dialog closes and the list is refreshed.

## 9. Conditions and Validation

- **Form Validation**: Performed client-side in the `ProjectFormModal` before submission.
  - An error message is displayed below the respective input field if validation fails (e.g., "Name is required", "Duration must be at least 1").
  - The "Save" button may be disabled until the form is valid.
- **API Conditions**: The frontend must adhere to the API contract.
  - `name`: Must be a non-empty string.
  - `duration_days`: Must be a positive integer.
  - `planned_date`: Must be a string in `YYYY-MM-DD` format or null. The `Date` object from the view model will be formatted correctly before the API call.
- **UI State**:
  - The "Previous" pagination button is disabled on page 1.
  - The "Next" pagination button is disabled on the last page.
  - A loading state (skeleton UI) is shown while the project list is being fetched.
  - A loading indicator is shown on the "Save" button in the modal while a create/update mutation is in progress.

## 10. Error Handling

- **Data Fetching Errors**: If the initial `GET /api/projects` call fails, a full-page error message will be displayed with a "Retry" button. TanStack Query's `isError` and `error` properties will be used to detect this.
- **Mutation Errors**: If a `create`, `update`, or `delete` operation fails:
  - A toast notification (using `sonner` from `shadcn/ui`) will appear with a descriptive error message (e.g., "Failed to create project. Please try again.").
  - The modal will remain open so the user can correct any issues without losing their input.
- **Validation Errors**: If the API returns a 400 Bad Request due to validation failure, the error message should be displayed to the user, ideally next to the relevant form field if possible, or in a general error message area within the modal.

## 11. Implementation Steps

1.  **Setup**: Create the Astro page file `src/pages/projects/index.astro`. Install `@tanstack/react-query` and any required `shadcn/ui` components (`dialog`, `button`, `input`, `sonner`, `alert-dialog`).
2.  **Component Scaffolding**: Create placeholder files for all the React components listed in the structure (`ProjectsPage.tsx`, `ProjectsList.tsx`, etc.).
3.  **Type Definitions**: Add the new `ProjectFormViewModel` and `ModalState` types to a relevant types file (e.g., `src/types.ts` or a new view-specific file).
4.  **API Layer**: Create functions for each API call (`fetchProjects`, `createProject`, etc.). These will be simple wrappers around `fetch`.
5.  **`ProjectsPage` Implementation**:
    - Set up the TanStack Query provider.
    - Implement the `useProjectsPage` custom hook to manage state (`page`, `modalState`) and API calls (`useQuery` for fetching, `useMutation` for CUD operations).
    - Wire up the main component to render children and handle events.
6.  **`ProjectsList` & `ProjectListItem`**: Build the components to display project data. Connect the Edit/Delete buttons to the event handlers passed down from `ProjectsPage`. Add an empty state.
7.  **`PaginationControls`**: Implement the pagination component and connect it to the page state.
8.  **`ProjectFormModal`**:
    - Build the form using `shadcn/ui` components.
    - Implement form state management (e.g., with `react-hook-form` or simple `useState`).
    - Add client-side validation logic.
    - Connect the `onSubmit` to the mutation hook.
9.  **`DeleteConfirmationDialog`**: Implement the simple confirmation dialog.
10. **Styling and UX**: Apply Tailwind CSS for styling. Ensure loading states, disabled states, and error messages are clearly communicated to the user.
11. **Testing**: Manually test all user stories: create, edit, delete, pagination, empty state, and error handling.
