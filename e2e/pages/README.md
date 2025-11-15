# E2E Testing - Page Object Models

This directory contains Page Object Models (POMs) for the Vacation Planner application, following Playwright best practices.

## Structure

```
e2e/
├── pages/
│   ├── index.ts                      # Barrel export file
│   ├── login.page.ts                 # Login page POM
│   ├── projects.page.ts              # Projects list page POM
│   ├── project-form-modal.page.ts    # Project form modal POM
│   └── project-list-item.page.ts     # Individual project card POM
├── fixtures/
│   └── test-data.ts                  # Test data and fixtures
└── *.spec.ts                         # Test files

```

## Page Object Models

### LoginPage (`login.page.ts`)
Handles authentication flow.

**Methods:**
- `goto()` - Navigate to login page
- `login(email, password)` - Perform login
- `getErrorMessage()` - Get error message text

### ProjectsPage (`projects.page.ts`)
Handles the main projects list page.

**Methods:**
- `goto()` - Navigate to projects page
- `clickNewProject()` - Open the create project modal
- `getProjectByName(name)` - Get project locator by name
- `getProjectById(id)` - Get project locator by ID
- `getAllProjects()` - Get all project items
- `waitForProjectsList()` - Wait for list to be visible
- `hasProject(name)` - Check if project exists
- `getProjectCount()` - Get number of projects

### ProjectFormModal (`project-form-modal.page.ts`)
Handles the project creation/edit modal dialog.

**Methods:**
- `waitForModal()` - Wait for modal to appear
- `waitForModalClose()` - Wait for modal to close
- `isCreateMode()` - Check if in create mode
- `isEditMode()` - Check if in edit mode
- `fillName(name)` - Fill project name
- `fillDuration(days)` - Fill duration
- `fillPlannedDate(date)` - Fill planned date
- `clearForm()` - Clear all fields
- `fillForm(data)` - Fill entire form
- `submit()` - Submit the form
- `cancel()` - Cancel the form
- `createProject(data)` - Complete flow: fill and submit
- `isSubmitDisabled()` - Check if submit button is disabled
- `isSubmitLoading()` - Check if submit is in loading state
- `getNameValue()` - Get current name value
- `getDurationValue()` - Get current duration value
- `getPlannedDateValue()` - Get current date value
- `hasNameError()` - Check if name validation error is shown
- `hasDurationError()` - Check if duration validation error is shown

### ProjectListItem (`project-list-item.page.ts`)
Represents an individual project card in the list.

**Constructor:**
- `new ProjectListItem(page, 'Project Name')` - By name
- `new ProjectListItem(page, { name: 'Project Name' })` - By name object
- `new ProjectListItem(page, { id: 'uuid' })` - By ID

**Methods:**
- `waitForVisible()` - Wait for item to be visible
- `isVisible()` - Check if item is visible
- `getProjectName()` - Get project name
- `getDuration()` - Get duration text
- `getPlannedDate()` - Get planned date text
- `clickViewNotes()` - Click View Notes button
- `clickEdit()` - Click Edit button
- `clickDelete()` - Click Delete button
- `getProjectInfo()` - Get all project info as object

## Usage Examples

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { ProjectsPage, ProjectFormModal, ProjectListItem } from './pages';

test.describe('Project Management', () => {
  let projectsPage: ProjectsPage;
  let projectFormModal: ProjectFormModal;

  test.beforeEach(async ({ page }) => {
    projectsPage = new ProjectsPage(page);
    projectFormModal = new ProjectFormModal(page);
    await projectsPage.goto();
  });

  test('should create a project', async ({ page }) => {
    // Arrange
    const projectData = {
      name: 'Trip to Paris',
      duration: 7,
      plannedDate: '2025-12-01',
    };

    // Act
    await projectsPage.clickNewProject();
    await projectFormModal.createProject(projectData);

    // Assert
    await expect(projectsPage.getProjectByName(projectData.name)).toBeVisible();
  });
});
```

### Working with Project List Items

```typescript
test('should edit a project', async ({ page }) => {
  // Get a specific project
  const projectItem = new ProjectListItem(page, 'Trip to Paris');
  
  // Click edit
  await projectItem.clickEdit();
  
  // Edit in modal
  await projectFormModal.waitForModal();
  await projectFormModal.fillName('Trip to London');
  await projectFormModal.submit();
  
  // Verify update
  const newProjectItem = new ProjectListItem(page, 'Trip to London');
  await expect(newProjectItem.container).toBeVisible();
});
```

### Validation Testing

```typescript
test('should show validation errors', async () => {
  await projectsPage.clickNewProject();
  await projectFormModal.waitForModal();
  
  // Try to submit empty form
  await projectFormModal.submit();
  
  // Check for errors
  expect(await projectFormModal.hasNameError()).toBe(true);
  expect(await projectFormModal.isSubmitDisabled()).toBe(false);
});
```

## Test Data Attributes

The following `data-testid` attributes are available:

### Projects Page
- `new-project-button` - The "New Project" button
- `projects-list` - The grid container of projects
- `project-list-item` - Each project card (also has `data-project-id` and `data-project-name`)

### Project Form Modal
- `project-form-modal` - The modal container
- `project-name-input` - Name input field
- `project-duration-input` - Duration input field
- `project-planned-date-input` - Planned date input field
- `project-form-submit-button` - Submit button
- `project-form-cancel-button` - Cancel button

## Best Practices

1. **Use POMs consistently** - Always access page elements through POM methods
2. **Follow AAA pattern** - Structure tests as Arrange, Act, Assert
3. **Wait explicitly** - Use `waitForModal()`, `waitForVisible()` methods
4. **Use semantic locators** - POMs abstract away implementation details
5. **Keep tests readable** - POMs make tests read like user stories
6. **Reuse POMs** - Import from `./pages` barrel export
7. **Test validation** - Use POM methods to check error states
8. **Chain actions** - POMs provide high-level methods like `createProject()`

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test e2e/create-project.spec.ts

# Run in headed mode
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with trace
npx playwright test --trace on
```

## Viewing Test Results

```bash
# Open last test report
npx playwright show-report

# Open trace viewer
npx playwright show-trace trace.zip
```

