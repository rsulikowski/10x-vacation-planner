import { test, expect } from '@playwright/test';
import { ProjectsPage, ProjectFormModal, ProjectListItem } from './pages';

test.describe('Create Project Flow', () => {
  let projectsPage: ProjectsPage;
  let projectFormModal: ProjectFormModal;

  test.beforeEach(async ({ page }) => {
    projectsPage = new ProjectsPage(page);
    projectFormModal = new ProjectFormModal(page);
    
    // Authentication is handled by auth.setup.ts
    // The authenticated state is reused across all tests
    await projectsPage.goto();
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the projects page
    await projectsPage.pageTitle.waitFor({ state: 'visible' });
  });

  test('should create a new project with all fields', async () => {
    // Arrange
    const projectData = {
      name: `Trip to Paris ${Date.now()}`, // Make unique to avoid conflicts
      duration: 7,
      plannedDate: '2025-12-01',
    };

    // Act
    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();
    
    // Verify modal is in create mode
    expect(await projectFormModal.isCreateMode()).toBe(true);
    
    // Fill and submit the form
    await projectFormModal.createProject(projectData);

    // Assert
    // Verify the modal closed
    await expect(projectFormModal.modal).not.toBeVisible();
    
    // Verify the new project appears in the list
    await expect(projectsPage.getProjectByName(projectData.name)).toBeVisible();
  });

  test('should create a new project without optional planned date', async () => {
    // Arrange
    const projectData = {
      name: `Weekend Getaway ${Date.now()}`, // Make unique
      duration: 3,
    };

    // Act
    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();
    await projectFormModal.fillForm(projectData);
    await projectFormModal.submit();

    // Assert
    await expect(projectFormModal.modal).not.toBeVisible();
    await expect(projectsPage.getProjectByName(projectData.name)).toBeVisible();
  });

  test('should show validation error when name is empty', async () => {
    // Arrange
    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();

    // Act - try to submit without filling name
    await projectFormModal.fillDuration(5);
    await projectFormModal.submit();

    // Assert - modal should still be visible and show error
    await expect(projectFormModal.modal).toBeVisible();
    expect(await projectFormModal.hasNameError()).toBe(true);
  });

  test('should show validation error when duration is invalid', async () => {
    // Arrange
    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();

    // Act - try to submit with invalid duration (negative or 0)
    await projectFormModal.fillName('Test Project');
    await projectFormModal.fillDuration('-1'); // Try negative first
    await projectFormModal.submit();

    // Assert - modal should still be visible
    // Note: If validation doesn't trigger on -1, the test might need adjustment
    // based on actual validation behavior
    await expect(projectFormModal.modal).toBeVisible();
    
    // Check if we're still in the modal (validation prevented submission)
    const isStillInModal = await projectFormModal.modal.isVisible();
    expect(isStillInModal).toBe(true);
  });

  test('should close modal when cancel button is clicked', async () => {
    // Arrange
    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();
    
    // Fill some data
    await projectFormModal.fillName('Test Project');

    // Act
    await projectFormModal.cancel();

    // Assert
    await expect(projectFormModal.modal).not.toBeVisible();
  });

  test('should disable submit button while creating project', async () => {
    // Arrange
    const projectData = {
      name: 'Test Project',
      duration: 5,
    };

    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();
    await projectFormModal.fillForm(projectData);

    // Act
    await projectFormModal.submit();

    // Assert - button should be disabled during submission
    // Note: This test might be flaky depending on response time
    // In a real scenario, you might need to intercept the API call
    await expect(projectFormModal.submitButton).toBeDisabled();
  });

  test('should clear form when modal is reopened', async () => {
    // Arrange
    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();
    
    // Fill and cancel
    await projectFormModal.fillName('First Project');
    await projectFormModal.fillDuration(5);
    await projectFormModal.cancel();

    // Act - reopen modal
    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();

    // Assert - fields should be empty
    expect(await projectFormModal.getNameValue()).toBe('');
    expect(await projectFormModal.getDurationValue()).toBe('');
    expect(await projectFormModal.getPlannedDateValue()).toBe('');
  });

  test('should display correct project information in the list item', async ({ page }) => {
    // Arrange
    const projectData = {
      name: `Summer Vacation ${Date.now()}`, // Make unique
      duration: 10,
      plannedDate: '2025-07-15',
    };

    // Act
    await projectsPage.clickNewProject();
    await projectFormModal.waitForModal();
    await projectFormModal.createProject(projectData);

    // Create ProjectListItem POM for the new project
    const projectItem = new ProjectListItem(page, projectData.name);
    await projectItem.waitForVisible();

    // Assert
    const projectInfo = await projectItem.getProjectInfo();
    expect(projectInfo.name).toBe(projectData.name);
    expect(projectInfo.duration).toContain('10 days');
    expect(projectInfo.plannedDate).toContain('Jul 15, 2025');
    
    // Verify all action buttons are visible
    await expect(projectItem.viewNotesButton).toBeVisible();
    await expect(projectItem.editButton).toBeVisible();
    await expect(projectItem.deleteButton).toBeVisible();
  });
});

