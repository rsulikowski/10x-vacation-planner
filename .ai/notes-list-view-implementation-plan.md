# View Implementation Plan: Notes List View

## 1. Overview
This document outlines the implementation plan for the "Notes List View", a component within the Project Detail page. Its purpose is to allow users to view, create, edit, and delete notes associated with a specific travel project. The view will feature infinite scrolling for note display, filtering capabilities, and modal-based forms for note management.

## 2. View Routing
The view will be accessible at the following path:
- **Path:** `/projects/[projectId]/notes`
This will be an Astro page that hosts the main React component for the notes view.

## 3. Component Structure
The view will be built using a hierarchical component structure. The main React component will be rendered on the Astro page using a `client:load` directive.

```
- pages/projects/[projectId]/notes.astro
  - NotesView (React Client Component)
    - FilterControl
    - Button (Shadcn/ui, for "Add Note")
    - InfiniteScrollGrid
      - NoteCard
      - ...
      - LoadingSpinner
    - NoteModal (Shadcn/ui Dialog, for create/edit)
    - DeleteConfirmationDialog (Shadcn/ui AlertDialog)
```

## 4. Component Details

### `NotesView`
- **Component description:** The main container component that orchestrates the entire notes feature. It utilizes the `useProjectNotes` custom hook to manage state and logic for fetching and manipulating notes.
- **Main elements:** Renders `FilterControl`, the "Add Note" `Button`, `InfiniteScrollGrid`, and conditionally renders `NoteModal` and `DeleteConfirmationDialog`.
- **Handled interactions:** Handles state changes for opening/closing the create/edit and delete confirmation modals.
- **Handled validation:** None.
- **Types:** `NoteDto`, `NoteModalState`.
- **Props:** `{ projectId: string }`.

### `FilterControl`
- **Component description:** A form component with controls to filter the notes list. It allows filtering by priority.
- **Main elements:** A `form` containing a `Select` for priority.
- **Handled interactions:** On input change, it calls the `onFilterChange` prop after debouncing the input to prevent excessive API calls.
- **Handled validation:** None.
- **Types:** `NotesFilterViewModel`.
- **Props:** `{ initialFilters: NotesFilterViewModel, onFilterChange: (filters: NotesFilterViewModel) => void }`.

### `InfiniteScrollGrid`
- **Component description:** Displays the list of notes in a grid layout and implements the infinite scroll functionality. It observes a sentinel element at the end of the list to trigger loading the next page of results.
- **Main elements:** A `div` acting as a grid container, which maps over the notes array to render `NoteCard` components. It also displays a loading spinner when fetching more data and an empty/error state message.
- **Handled interactions:** Detects when the user has scrolled to the bottom of the list and calls the `onLoadMore` prop.
- **Handled validation:** None.
- **Types:** `NoteDto`.
- **Props:** `{ notes: NoteDto[], hasNextPage: boolean, isLoading: boolean, error: Error | null, onLoadMore: () => void, onEdit: (note: NoteDto) => void, onDelete: (note: NoteDto) => void }`.

### `NoteCard`
- **Component description:** A card component to display summary information for a single note. It shows the note's content (truncated to 300 characters), its priority, and associated place tags. It also provides action buttons.
- **Main elements:** `Card` component from Shadcn/ui containing the note's text, priority badge, tags, and a dropdown menu with "Edit" and "Delete" options.
- **Handled interactions:** Handles clicks on the "Edit" and "Delete" buttons, propagating the events to the parent component.
- **Handled validation:** None.
- **Types:** `NoteDto`.
- **Props:** `{ note: NoteDto, onEdit: (note: NoteDto) => void, onDelete: (note: NoteDto) => void }`.

### `NoteModal`
- **Component description:** A modal dialog containing a form for creating or editing a note. It is built using the `Dialog` component from Shadcn/ui.
- **Main elements:** A `form` with a `Textarea` for content, a `Select` for priority (1-3), and an `Input` for comma-separated place tags.
- **Handled interactions:** Form submission, which includes validation and calling the `onSubmit` prop. It also handles the close/cancel action.
- **Handled validation:**
    - `content`: Must not be empty. An error message is shown if the validation fails.
    - `priority`: A value must be selected.
- **Types:** `NoteDto` (for pre-filling), `NoteFormViewModel`, `CreateNoteCommand`, `UpdateNoteCommand`.
- **Props:** `{ isOpen: boolean, mode: 'create' | 'edit', note?: NoteDto, onSubmit: (data: CreateNoteCommand | UpdateNoteCommand) => void, onClose: () => void }`.

## 5. Types
The implementation will use existing DTOs from `src/types.ts` and introduce new ViewModels for managing form and filter state.

### Existing Types
- `NoteDto`: Represents a note object from the API.
- `CreateNoteCommand`: The request body for creating a new note.
- `UpdateNoteCommand`: The request body for updating an existing note.
- `NotesListResponseDto`: The paginated response structure from the notes list API endpoint.

### New ViewModel Types
- **`NoteFormViewModel`**: Represents the state of the form within the `NoteModal`.
  ```typescript
  export interface NoteFormViewModel {
    content: string;
    priority: string; // Stored as string from <select> value, e.g., "1"
    place_tags: string; // Comma-separated string for the input field
  }
  ```
- **`NotesFilterViewModel`**: Represents the state of the `FilterControl` component.
  ```typescript
  export interface NotesFilterViewModel {
    priority: number | null;
    place_tag: string;
  }
  ```
- **`NoteModalState`**: A discriminated union to manage the state of the `NoteModal`.
  ```typescript
  export type NoteModalState =
    | { type: 'closed' }
    | { type: 'create_note' }
    | { type: 'edit_note'; note: NoteDto };
  ```

## 6. State Management
All state and business logic will be encapsulated within a custom React hook, `useProjectNotes`, to promote separation of concerns and reusability.

### `useProjectNotes(projectId: string)`
- **Purpose:** Manages the entire lifecycle of notes data for the view, including data fetching, pagination, filtering, and CRUD operations.
- **Internal State:**
    - `notes: NoteDto[]`: The aggregated list of notes across all fetched pages.
    - `page: number`: The current page to be fetched.
    - `hasNextPage: boolean`: Flag indicating if more results are available.
    - `filters: NotesFilterViewModel`: Current filtering criteria.
    - `isLoading: boolean`: Loading state for the initial fetch.
    - `isFetchingNextPage: boolean`: Loading state for subsequent page fetches.
    - `error: Error | null`: Holds any error object from an API call.
- **Exposed API:**
    - `notes`, `hasNextPage`, `isLoading`, `error`: State values.
    - `fetchNextPage()`: A function to fetch the next page of notes.
    - `setFilters(newFilters: NotesFilterViewModel)`: A function to update filters and reset the notes list.
    - `createNote(command: CreateNoteCommand)`: Function to create a new note.
    - `updateNote(noteId: string, command: UpdateNoteCommand)`: Function to update a note.
    - `deleteNote(noteId: string)`: Function to delete a note.

## 7. API Integration
The `useProjectNotes` hook will be responsible for all communication with the notes API endpoints.

- **List Notes:**
  - **Endpoint:** `GET /api/projects/{projectId}/notes`
  - **Usage:** Called for initial load, infinite scroll, and after a filter change.
  - **Query Params:** `page`, `size`, `priority`, `place_tag`.
  - **Response Type:** `NotesListResponseDto`

- **Create Note:**
  - **Endpoint:** `POST /api/projects/{projectId}/notes`
  - **Usage:** Called when submitting the `NoteModal` in 'create' mode.
  - **Request Type:** `CreateNoteCommand`
  - **Response Type:** `NoteDto`

- **Update Note:**
  - **Endpoint:** `PATCH /api/projects/{projectId}/notes/{noteId}`
  - **Usage:** Called when submitting the `NoteModal` in 'edit' mode.
  - **Request Type:** `UpdateNoteCommand`
  - **Response Type:** `NoteDto`

- **Delete Note:**
  - **Endpoint:** `DELETE /api/projects/{projectId}/notes/{noteId}`
  - **Usage:** Called after user confirmation in the `DeleteConfirmationDialog`.
  - **Response Type:** `204 No Content`

## 8. User Interactions
- **View & Load More:** The user lands on the page, and the first set of notes loads. As the user scrolls, a sentinel element at the bottom of the list triggers the `fetchNextPage` function to load more notes.
- **Filter:** The user selects a priority. After a 500ms debounce, the `setFilters` function is called, and the note list is refreshed with the new criteria.
- **Create:** The user clicks the "Add Note" button, which opens the `NoteModal`. After filling the form and clicking "Save", the `createNote` function is called. On success, the notes list is re-fetched to show the new note, and a success toast is displayed.
- **Edit:** The user clicks the "Edit" action on a `NoteCard`. The `NoteModal` opens, pre-filled with the note's data. After making changes and clicking "Save", the `updateNote` function is called. On success, the list is updated, and a toast is shown.
- **Delete:** The user clicks the "Delete" action on a `NoteCard`. A confirmation dialog appears. Upon confirmation, the `deleteNote` function is called. On success, the note is removed from the list, and a toast is shown.

## 9. Conditions and Validation
- **`NoteModal` Form:**
    - The `content` `Textarea` must not be empty. The "Save" button will be disabled if it is, and a message will be displayed if the user attempts to submit.
    - The `priority` `Select` is a required field. The form will have a default, unselected state to ensure user interaction.
- **API Requests:** All data transformations (e.g., converting `NoteFormViewModel` to `CreateNoteCommand`) will happen just before the API call to ensure the payload matches the API's contract. This includes parsing the priority string to a number and splitting the tags string into an array.

## 10. Error Handling
- **Data Fetching Errors:** If the initial fetch fails, an error message with a "Retry" button will be displayed in place of the notes grid. If a subsequent page fetch fails for infinite scroll, a toast notification will appear.
- **CRUD Operation Errors:** If creating, updating, or deleting a note fails, a descriptive error toast (e.g., from `sonner`) will be displayed to the user. For create/edit failures, the modal will remain open so the user can retry without losing their input.
- **Empty State:** If the API returns no notes for the current project and filters, a message will be displayed inviting the user to create their first note.

## 11. Implementation Steps
1.  **Create Astro Page:** Set up the file at `src/pages/projects/[projectId]/notes.astro`.
2.  **Create ViewModels:** Add `NoteFormViewModel`, `NotesFilterViewModel`, and `NoteModalState` to a relevant types file (e.g., `src/types.ts` or a new `src/view-models.ts`).
3.  **Implement `useProjectNotes` Hook:** Create the custom hook in `src/components/hooks/useProjectNotes.ts`. Implement the state logic and API call functions for listing, creating, updating, and deleting notes.
4.  **Develop UI Components:** Create the following React components in `src/components/`:
    - `NoteCard.tsx`
    - `InfiniteScrollGrid.tsx` (implementing `IntersectionObserver` logic)
    - `FilterControl.tsx` (with debouncing)
    - `NoteModal.tsx`
5.  **Assemble `NotesView` Component:** Create `NotesView.tsx`. Integrate the `useProjectNotes` hook and compose the UI by assembling the `FilterControl`, `InfiniteScrollGrid`, `NoteModal`, and `DeleteConfirmationDialog` components.
6.  **Integrate into Astro:** Render the `NotesView` component in the Astro page, passing the `projectId` from the URL as a prop and using the `client:load` directive.
7.  **Testing:** Manually test all user interactions, including loading, filtering, CRUD operations, error states, and responsive behavior.
