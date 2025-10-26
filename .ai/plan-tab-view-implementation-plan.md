# View Implementation Plan: Plan Tab

## 1. Overview
This document outlines the implementation plan for the "Plan Tab" view. This view allows users to generate a detailed, day-by-day travel itinerary using an AI service based on the notes they have added to a specific travel project. The view will handle the user interaction for triggering the generation, provide clear feedback during the process, display the resulting schedule, and manage potential errors gracefully.

## 2. View Routing
The view will be accessible at the following path:
- **Path**: `/projects/:projectId/plan`

This will be an Astro page (`src/pages/projects/[projectId]/plan.astro`) that renders the main React component responsible for the view's interactivity.

## 3. Component Structure
The view will be composed of a single container component that manages state and several presentational components for the UI.

```
/src/pages/projects/[projectId]/plan.astro
└── /src/components/PlanGenerator.tsx (client:visible)
    ├── /src/components/ui/Button.tsx (GeneratePlanButton)
    ├── /src/components/ScheduleDisplay.tsx
    ├── /src/components/LoadingOverlay.tsx
    └── /src/components/ui/Toast.tsx (ErrorNotification)
```

## 4. Component Details

### `PlanGenerator.tsx`
- **Component description**: This is the main stateful container component for the Plan Tab. It is responsible for fetching project notes and user preferences, managing the UI state (idle, loading, success, error), handling the API call to generate the plan, and rendering the appropriate child components.
- **Main elements**: It will render child components conditionally based on the current `status`. It will not have much of its own markup, serving primarily as a logic controller.
- **Handled interactions**:
  - Handles the `click` event from the `GeneratePlanButton` to initiate the API call.
  - Handles the `retry` event from the `ErrorNotification` to re-run the generation process.
- **Handled validation**:
  - Verifies that a `projectId` is present.
  - Checks if the project has notes before enabling the generate button. If there are no notes, the button will be disabled, and a message will be shown.
- **Types**: `PlanViewState`, `GeneratePlanCommand`, `PlanResponseDto`.
- **Props**: `{ projectId: string }`.

### `GeneratePlanButton` (variant of `ui/button.tsx`)
- **Component description**: A button that the user clicks to start the plan generation. Its label may change (e.g., "Generate Plan", "Re-generate Plan").
- **Main elements**: An HTML `<button>` element.
- **Handled interactions**: `onClick`.
- **Handled validation**: The button will be in a disabled state when a request is in progress (`isLoading={true}`) or when there are no notes to generate a plan from.
- **Types**: N/A.
- **Props**: `{ onClick: () => void; isLoading: boolean; isDisabled: boolean; }`.

### `ScheduleDisplay.tsx`
- **Component description**: A presentational component that renders the AI-generated schedule. It will display a list of days, each with a corresponding list of activities.
- **Main elements**: Uses `<div>`, `<h2>` for the day number (e.g., "Day 1"), and `<ul>`/`<li>` for the list of activities.
- **Handled interactions**: None.
- **Handled validation**: Displays a message if the `schedule` prop is null, empty, or malformed.
- **Types**: `ScheduleItemDto`.
- **Props**: `{ schedule: ScheduleItemDto[] }`.

### `LoadingOverlay.tsx`
- **Component description**: A modal overlay that covers the view while the AI is generating the plan. It displays a spinner and a message to inform the user that the process is ongoing.
- **Main elements**: A fixed-position `<div>` with a semi-transparent background, a spinner element, and a text block (e.g., `<p>Generating plan...</p>`).
- **Handled interactions**: None. It is meant to block interactions.
- **Handled validation**: Should have `aria-busy="true"` for accessibility when visible.
- **Types**: N/A.
- **Props**: `{ isLoading: boolean }`.

### `ErrorNotification` (using `ui/Toast.tsx`)
- **Component description**: A toast notification that appears when the API call fails. It displays a user-friendly error message and provides a "Try Again" action.
- **Main elements**: Toast component from `shadcn/ui`.
- **Handled interactions**: `onClick` on the "Try Again" action button.
- **Handled validation**: Only renders when an error is present in the parent's state.
- **Types**: N/A.
- **Props**: `{ message: string; onRetry: () => void; }`.

## 5. Types

### ViewModel Types
```typescript
// To manage the view's state
export type PlanGenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PlanViewState {
  status: PlanGenerationStatus;
  schedule: ScheduleItemDto[] | null;
  error: string | null;
}
```

### DTOs (from `src/types.ts`)
The implementation will use the following existing types for API communication:
- `GeneratePlanCommand`: For the `POST` request body.
- `PlanResponseDto`: For the successful `POST` response.
- `ScheduleItemDto`: For items within the `schedule` array.
- `NoteDto`: For fetching and preparing the project notes.
- `PreferencesDto`: For fetching user preferences.

## 6. State Management
State will be managed locally within the `PlanGenerator.tsx` component. A custom hook, `usePlanGenerator`, will be created to encapsulate all business logic, state, and side effects.

### `usePlanGenerator.ts`
This hook will:
- Use React's `useReducer` to manage the `PlanViewState`.
- Contain a `useEffect` to fetch initial data required for the plan generation (all project notes and user preferences) when the component mounts.
- Expose the current state (`status`, `schedule`, `error`).
- Expose an async function `generatePlan` that builds the `GeneratePlanCommand` and executes the `POST` request. This function will dispatch actions to the reducer to update the state based on the API call's progress and outcome.

## 7. API Integration
Integration will target the plan generation endpoint.

- **Endpoint**: `POST /api/projects/:projectId/plan`
- **Request Type**: `GeneratePlanCommand`
  ```typescript
  // Example Request Body
  {
    "model": "gpt-5", // Or another model from config
    "notes": [ /* Array of NoteDto objects for the project */ ],
    "preferences": { /* User's PreferencesDto object */ }
  }
  ```
- **Response Type**: `PlanResponseDto`
  ```typescript
  // Example Response Body (200 OK)
  {
    "schedule": [
      { "day": 1, "activities": ["Visit the museum", "Lunch at a local cafe"] }
    ]
  }
  ```
- **Prerequisite API Calls**:
  - `GET /api/projects/:projectId/notes`: To fetch all notes for the project.
  - `GET /api/user/profile`: To fetch the user's travel preferences. (This endpoint is assumed to exist).

## 8. User Interactions
- **Initial View Load**: The component fetches project notes and preferences. If a previously generated plan exists, it can be displayed (enhancement). Otherwise, the view is idle.
- **Click "Generate Plan"**:
  1. The UI enters the `loading` state.
  2. The `LoadingOverlay` is displayed.
  3. The `generatePlan` function in the hook is called, triggering the `POST` request.
- **Generation Success**:
  1. The UI transitions to the `success` state.
  2. The `LoadingOverlay` is hidden.
  3. The `ScheduleDisplay` component renders the received schedule.
- **Generation Failure**:
  1. The UI transitions to the `error` state.
  2. The `LoadingOverlay` is hidden.
  3. An `ErrorNotification` toast appears with an error message and a "Try Again" button.
- **Click "Try Again"**:
  1. The `generatePlan` function is called again, restarting the process.

## 9. Conditions and Validation
- **Project has no notes**: The "Generate Plan" button will be disabled. A message like "Please add notes to your project to generate a plan" will be displayed.
- **Request in progress**: The "Generate Plan" button will be disabled to prevent multiple submissions.

## 10. Error Handling
- **Client-Side Errors**:
  - **No notes**: Handled by disabling the generate button.
  - **Failure to fetch initial data (notes/preferences)**: The view will enter a persistent error state, showing a message like "Could not load project data. Please refresh the page."
- **API Errors**:
  - **400 Bad Request**: The error toast will show a message: "Invalid data provided. Please ensure your project notes are correct."
  - **500 Internal Server Error**: The error toast will show a message: "An unexpected error occurred while generating your plan. Please try again later."
  - **Network Error**: A generic message will be shown: "Network error. Please check your connection and try again."
- **Request Timeout**: If the request takes longer than 60 seconds, it will be timed out, and a server error will be shown.

## 11. Implementation Steps
1.  Create the Astro page file at `src/pages/projects/[projectId]/plan.astro`.
2.  Create the main React component file `src/components/PlanGenerator.tsx`.
3.  Implement the `usePlanGenerator.ts` custom hook to manage state and API logic.
    -   Define `PlanViewState` and `PlanGenerationStatus` types.
    -   Set up a `useReducer` for state management.
    -   Implement the `useEffect` for fetching initial notes and user preferences.
    -   Implement the `generatePlan` function to perform the `POST` request and handle responses.
4.  In `PlanGenerator.tsx`, use the `usePlanGenerator` hook and render the UI conditionally based on the state.
5.  Create the `ScheduleDisplay.tsx` component to render the plan.
6.  Create the `LoadingOverlay.tsx` component.
7.  Integrate the existing `shadcn/ui` `Button` for the `GeneratePlanButton` and `Toast` for the `ErrorNotification`.
8.  Add the `PlanGenerator` component to the Astro page, passing the `projectId` as a prop and setting the `client:visible` directive.
9.  (not in this stage) Write unit/integration tests for the `usePlanGenerator` hook to cover all state transitions and API call scenarios.
10. Manually test the end-to-end flow in the browser, covering success, error, and validation cases.
