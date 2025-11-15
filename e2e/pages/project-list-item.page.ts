import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for individual Project List Item
 * Represents a single project card in the projects list
 */
export class ProjectListItem {
  readonly page: Page;
  readonly container: Locator;
  readonly projectName: Locator;
  readonly durationText: Locator;
  readonly plannedDateText: Locator;
  readonly viewNotesButton: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page, projectIdentifier: string | { name: string } | { id: string }) {
    this.page = page;
    
    // Locate the container based on identifier type
    if (typeof projectIdentifier === 'string') {
      // If string, assume it's a project name
      this.container = page.locator(`[data-testid="project-list-item"][data-project-name="${projectIdentifier}"]`);
    } else if ('name' in projectIdentifier) {
      this.container = page.locator(`[data-testid="project-list-item"][data-project-name="${projectIdentifier.name}"]`);
    } else {
      this.container = page.locator(`[data-testid="project-list-item"][data-project-id="${projectIdentifier.id}"]`);
    }

    // Define child locators
    this.projectName = this.container.getByRole('heading', { level: 3 });
    this.durationText = this.container.locator('text=/\\d+ days?/');
    this.plannedDateText = this.container.locator('text=/\\w{3} \\d{1,2}, \\d{4}|No date set/');
    this.viewNotesButton = this.container.getByRole('link', { name: /view notes/i });
    this.editButton = this.container.getByRole('button', { name: /edit/i });
    this.deleteButton = this.container.getByRole('button', { name: /delete/i });
  }

  /**
   * Wait for the project item to be visible
   */
  async waitForVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  /**
   * Check if the project item is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.container.isVisible();
  }

  /**
   * Get the project name text
   */
  async getProjectName(): Promise<string> {
    return await this.projectName.textContent() ?? '';
  }

  /**
   * Get the duration text
   */
  async getDuration(): Promise<string> {
    return await this.durationText.textContent() ?? '';
  }

  /**
   * Get the planned date text
   */
  async getPlannedDate(): Promise<string> {
    return await this.plannedDateText.textContent() ?? '';
  }

  /**
   * Click the "View Notes" button
   */
  async clickViewNotes() {
    await this.viewNotesButton.click();
  }

  /**
   * Click the "Edit" button to open the edit modal
   */
  async clickEdit() {
    await this.editButton.click();
  }

  /**
   * Click the "Delete" button to open the delete confirmation
   */
  async clickDelete() {
    await this.deleteButton.click();
  }

  /**
   * Get all project information
   */
  async getProjectInfo(): Promise<{
    name: string;
    duration: string;
    plannedDate: string;
  }> {
    return {
      name: await this.getProjectName(),
      duration: await this.getDuration(),
      plannedDate: await this.getPlannedDate(),
    };
  }
}

