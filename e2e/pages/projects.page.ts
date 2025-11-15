import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Projects Page
 */
export class ProjectsPage {
  readonly page: Page;
  readonly newProjectButton: Locator;
  readonly projectsList: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newProjectButton = page.getByTestId('new-project-button');
    this.projectsList = page.getByTestId('projects-list');
    this.pageTitle = page.getByRole('heading', { name: /projects/i, level: 1 });
  }

  /**
   * Navigate to the projects page
   */
  async goto() {
    await this.page.goto('/projects');
  }

  /**
   * Click the "New Project" button to open the modal
   */
  async clickNewProject() {
    await this.newProjectButton.click();
  }

  /**
   * Get a specific project item by name
   */
  getProjectByName(name: string): Locator {
    return this.page.locator(`[data-testid="project-list-item"][data-project-name="${name}"]`);
  }

  /**
   * Get a specific project item by ID
   */
  getProjectById(id: string): Locator {
    return this.page.locator(`[data-testid="project-list-item"][data-project-id="${id}"]`);
  }

  /**
   * Get all project items
   */
  getAllProjects(): Locator {
    return this.page.getByTestId('project-list-item');
  }

  /**
   * Wait for the projects list to be visible
   */
  async waitForProjectsList() {
    await this.projectsList.waitFor({ state: 'visible' });
  }

  /**
   * Check if a project exists by name
   */
  async hasProject(name: string): Promise<boolean> {
    const project = this.getProjectByName(name);
    return await project.isVisible();
  }

  /**
   * Get the count of projects displayed
   */
  async getProjectCount(): Promise<number> {
    return await this.getAllProjects().count();
  }
}

