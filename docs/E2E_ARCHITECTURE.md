# Page Object Model Architecture

## Directory Structure

```
e2e/
├── pages/
│   ├── index.ts                      # Barrel export
│   ├── login.page.ts                 # ✅ Existing
│   ├── projects.page.ts              # ✨ NEW
│   ├── project-form-modal.page.ts    # ✨ NEW
│   └── project-list-item.page.ts     # ✨ NEW
│
├── fixtures/
│   └── test-data.ts                  # Test data
│
├── auth.spec.ts                      # ✅ Existing
├── example.spec.ts                   # ✅ Existing
└── create-project.spec.ts            # ✨ NEW (8 tests)
```

## Test Flow Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                     CREATE PROJECT FLOW                      │
└─────────────────────────────────────────────────────────────┘

User Action                 POM Method                  Component
───────────                ────────────               ───────────

1. Navigate              projectsPage.goto()
   to page               ↓
                         [GET /projects]
                         ↓
                    ┌────────────────────┐
                    │  ProjectsPage      │
                    │  [data-testid=     │
                    │   projects-list]   │
                    └────────────────────┘


2. Click "New          projectsPage
   Project"            .clickNewProject()
   button              ↓
                    ┌────────────────────┐
                    │     Button         │
                    │  [data-testid=     │
                    │ new-project-button]│
                    └────────────────────┘


3. Wait for          projectFormModal
   modal to          .waitForModal()
   open              ↓
                    ┌────────────────────┐
                    │ ProjectFormModal   │
                    │  [data-testid=     │
                    │ project-form-modal]│
                    └────────────────────┘


4. Fill name         projectFormModal
   field             .fillName("Paris")
                     ↓
                    ┌────────────────────┐
                    │     Input          │
                    │  [data-testid=     │
                    │ project-name-input]│
                    └────────────────────┘


5. Fill             projectFormModal
   duration         .fillDuration(7)
   field            ↓
                    ┌────────────────────┐
                    │     Input          │
                    │  [data-testid=     │
                    │project-duration-   │
                    │      input]        │
                    └────────────────────┘


6. Fill planned     projectFormModal
   date (opt)       .fillPlannedDate(...)
                    ↓
                    ┌────────────────────┐
                    │     Input          │
                    │  [data-testid=     │
                    │project-planned-    │
                    │   date-input]      │
                    └────────────────────┘


7. Submit           projectFormModal
   form             .submit()
                    ↓
                    ┌────────────────────┐
                    │     Button         │
                    │  [data-testid=     │
                    │ project-form-submit│
                    │      -button]      │
                    └────────────────────┘
                    ↓
                    [POST /api/projects]
                    ↓
                    [Modal closes]


8. Verify new      projectsPage
   project         .getProjectByName()
   appears         ↓
                   new ProjectListItem()
                   .waitForVisible()
                   ↓
                    ┌────────────────────┐
                    │ ProjectListItem    │
                    │  [data-testid=     │
                    │ project-list-item] │
                    │  [data-project-    │
                    │    name="Paris"]   │
                    └────────────────────┘
```

## POM Class Relationships

```
┌────────────────────────────────────────────────────────────┐
│                      Page Object Models                     │
└────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│    LoginPage        │
│  (Existing)         │
│                     │
│  + goto()           │
│  + login()          │
│  + getErrorMessage()│
└─────────────────────┘


┌─────────────────────┐        ┌──────────────────────┐
│   ProjectsPage      │◄───────┤  ProjectFormModal    │
│                     │ uses   │                      │
│  + goto()           │        │  + waitForModal()    │
│  + clickNewProject()│        │  + isCreateMode()    │
│  + getProjectByName()        │  + isEditMode()      │
│  + getProjectById() │        │  + fillName()        │
│  + getAllProjects() │        │  + fillDuration()    │
│  + hasProject()     │        │  + fillPlannedDate() │
│  + getProjectCount()│        │  + submit()          │
└─────────────────────┘        │  + cancel()          │
         │                     │  + createProject()   │
         │ contains            └──────────────────────┘
         │
         ▼
┌─────────────────────┐
│  ProjectListItem    │
│                     │
│  + constructor()    │
│    - by name        │
│    - by id          │
│  + waitForVisible() │
│  + getProjectName() │
│  + getDuration()    │
│  + getPlannedDate() │
│  + clickEdit()      │
│  + clickDelete()    │
│  + clickViewNotes() │
│  + getProjectInfo() │
└─────────────────────┘
```

## Test Suite Structure

```
create-project.spec.ts
├── Test: "should create a new project with all fields"
│   ├── Arrange: Prepare project data, count initial projects
│   ├── Act: Click new project, fill form, submit
│   └── Assert: Modal closed, project visible, count increased
│
├── Test: "should create project without optional date"
│   ├── Arrange: Prepare minimal data
│   ├── Act: Fill and submit
│   └── Assert: Project created successfully
│
├── Test: "should show validation error when name is empty"
│   ├── Arrange: Open modal
│   ├── Act: Submit without name
│   └── Assert: Error shown, modal still open
│
├── Test: "should show validation error for invalid duration"
│   ├── Arrange: Open modal
│   ├── Act: Submit with duration = 0
│   └── Assert: Error shown, modal still open
│
├── Test: "should close modal when cancel is clicked"
│   ├── Arrange: Open modal, fill some data
│   ├── Act: Click cancel
│   └── Assert: Modal closed
│
├── Test: "should disable submit button while creating"
│   ├── Arrange: Fill form
│   ├── Act: Click submit
│   └── Assert: Button disabled during submission
│
├── Test: "should clear form when modal is reopened"
│   ├── Arrange: Open, fill, cancel
│   ├── Act: Reopen modal
│   └── Assert: Form fields are empty
│
└── Test: "should display correct project info in list"
    ├── Arrange: Create project with specific data
    ├── Act: Get project item details
    └── Assert: All info matches, buttons visible
```

## Component → Test ID Mapping

```
Component Tree                          Test IDs
──────────────                          ────────

ProjectsPage
├── Button "New Project"        →  new-project-button
└── ProjectsList                →  projects-list
    └── ProjectListItem         →  project-list-item
        ├── @data-project-id    →  (uuid)
        └── @data-project-name  →  (project name)

ProjectFormModal                →  project-form-modal
├── Input: Name                 →  project-name-input
├── Input: Duration             →  project-duration-input
├── Input: Planned Date         →  project-planned-date-input
├── Button: Cancel              →  project-form-cancel-button
└── Button: Submit              →  project-form-submit-button
```

## Usage Pattern

```typescript
// 1. Import POMs from barrel export
import { ProjectsPage, ProjectFormModal, ProjectListItem } from './pages';

// 2. Initialize in beforeEach
test.beforeEach(async ({ page }) => {
  projectsPage = new ProjectsPage(page);
  projectFormModal = new ProjectFormModal(page);
  await projectsPage.goto();
});

// 3. Use high-level methods in tests
test('example', async ({ page }) => {
  // Navigate and interact
  await projectsPage.clickNewProject();
  
  // Use composite methods for complex actions
  await projectFormModal.createProject({
    name: 'Paris',
    duration: 7,
  });
  
  // Verify with specific POMs
  const item = new ProjectListItem(page, 'Paris');
  await expect(item.container).toBeVisible();
});
```

## Benefits Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    POM BENEFITS                              │
└─────────────────────────────────────────────────────────────┘

Maintainability          Readability            Reliability
─────────────           ───────────            ────────────
Single source      →    Self-documenting  →    Proper waits
of truth                method names           built-in
     ↓                       ↓                       ↓
Easy to update          Tests read like        Reduced
when UI changes         user stories           flakiness
     ↓                       ↓                       ↓
Centralized             Clear intent           Consistent
selectors               shown                  selectors


Type Safety              Reusability           Testability
───────────             ────────────          ────────────
Full TypeScript    →    POMs shared      →    Easy to mock
support                 across tests          and stub
     ↓                       ↓                       ↓
IDE autocomplete        Reduced code           Isolated
                        duplication            testing
     ↓                       ↓                       ↓
Compile-time            Common actions         Component
errors                  encapsulated           independence
```

