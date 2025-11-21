# UI Architecture for VacationPlanner

## 1. UI Structure Overview

VacationPlanner is structured around isolated authentication routes, a global layout for authenticated sections, and a project-detail view with tabbed subviews. Authentication screens live outside the main layout. Once authenticated, users navigate via a top navigation bar to "Projects" and "Profile." Within a project, a tabbed interface hosts Notes and Plan views. Common components (spinner overlay, toast notifications, form fields) ensure consistent UX, accessibility, and security.

## 2. View List

- **Login View** (`/auth/login`)
  - Main purpose: Authenticate existing users
  - Key information: Email and password fields, login button, links to register and reset
  - Key view components: Form fields with inline validation, primary button, error message area
  - UX/Accessibility/Security: Labels tied to inputs, aria-describedby for errors, rate-limit feedback

- **Register View** (`/auth/register`)
  - Main purpose: Create new account
  - Key information: Email, password, confirm password, register button
  - Key view components: Form fields, password strength indicator, submit button
  - Considerations: Email format validation, password length, focus management, secure data handling

- **Reset Password View** (`/auth/reset`)
  - Main purpose: Request password reset link
  - Key information: Email field, send button, status message
  - Key view components: Form field, confirmation message area
  - Considerations: Link expiration notice, secure token handling

- **Profile View** (`/profile`)
  - Main purpose: Display and update user tourism preferences
  - Key information: Multi-select autocomplete for categories, save button, confirmation toast
  - Key view components: AutocompleteInput, Save changes button, toast notifications
  - Considerations: Keyboard navigation, aria-combobox, disabled state until changes made

- **Projects List View** (`/projects`)
  - Main purpose: List and manage travel projects
  - Key information: Project name, duration, planned date, pagination controls, create button
  - Key view components: Card or list items, New Project button, pagination/infinite scroll
  - Considerations: Empty state call-to-action, accessible list semantics, inline delete confirmation

- **Project Form (Modal)**
  - Main purpose: Create or edit a project
  - Key information: Name, duration days, planned date, save/cancel buttons
  - Key view components: Form inputs, date picker, inline validation messages
  - Considerations: date picker accessibility, keyboard trap in modal, validation feedback

- **Project Detail View** (`/projects/{projectId}`)
  - **Notes Tab** (`/projects/{projectId}/notes`)
    - Purpose: View and manage notes
    - Key info: Note cards truncated to 300 chars, priority, place/time tags
    - Components: InfiniteScrollGrid, NoteCard, FilterControl, Add Note button, NoteModal
    - Considerations: aria-live for loaded items, ellipsis for truncation, filter keyboard support

  - **Plan Tab** (`/projects/{projectId}/plan`)
    - Purpose: Generate and view AI schedule
    - Key info: Generate Plan button, overlay spinner, schedule list by day/activities
    - Components: Button, SpinnerOverlay, ScheduleList, Toast for errors
    - Considerations: aria-busy on overlay, disable button during call, retry prompt on failure

## 3. User Journey Map

1. User lands on `/auth/login`.
2. Registers or logs in.
3. Upon success, redirected to `/projects`.
4. (Optional) Navigates to `/profile` to set preferences.
5. Back at `/projects`, clicks "New Project" → fills and submits form → project appears.
6. Clicks project card → lands in Notes tab.
7. Adds multiple notes via modal.
8. Switches to Plan tab, clicks "Generate Plan" → sees spinner, then schedule or error toast.
9. Views schedule, navigates back to Projects or Profile.

## 4. Layout and Navigation Structure

- **Global Layout**: Top nav bar with links to Projects and Profile, user menu for logout.
- **Auth Layout**: Full-screen routes for login, register, reset, without global nav.
- **Project Detail**: Breadcrumbs (Projects > Project Name), tablist for Notes and Plan.
- **Modals**: Create/edit forms open as overlays with focus trap and escape handling.

## 5. Key Components

- **NavBar**: Accessible navigation links, user menu.
- **AuthGuard**: Redirects unauthenticated users to login.
- **FormField**: Label, input, error message wrapper for inline validation.
- **DatePicker**: Accessible date selection with aria attributes.
- **AutocompleteInput**: For place tags and profile categories, aria-combobox.
- **InfiniteScrollGrid**: Loads paginated data lazily with aria-live.
- **NoteCard**: Displays truncated note, clickable region for modal.
- **Modal**: Generic overlay with focus trap.
- **SpinnerOverlay**: Full-screen spinner with aria-busy.
- **Toast**: Non-blocking notifications, aria-live polite.
- **Tabs**: Semantic tablist/tab elements with role attributes.
- **Button**: Primary/secondary with disabled states and aria-disabled.
