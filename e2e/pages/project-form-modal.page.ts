import type { Page, Locator } from "@playwright/test";

/**
 * Page Object Model for Project Form Modal
 * Handles both Create and Edit modes
 */
export class ProjectFormModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly nameInput: Locator;
  readonly durationInput: Locator;
  readonly plannedDateInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly nameError: Locator;
  readonly durationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByTestId("project-form-modal");
    this.modalTitle = this.modal.getByRole("heading", { level: 2 });
    this.nameInput = page.getByTestId("project-name-input");
    this.durationInput = page.getByTestId("project-duration-input");
    this.plannedDateInput = page.getByTestId("project-planned-date-input");
    this.submitButton = page.getByTestId("project-form-submit-button");
    this.cancelButton = page.getByTestId("project-form-cancel-button");
    this.nameError = this.modal.locator("text=Name is required");
    this.durationError = this.modal.locator("text=/Duration .* required|Duration must be/");
  }

  /**
   * Wait for the modal to be visible
   */
  async waitForModal() {
    await this.modal.waitFor({ state: "visible" });
  }

  /**
   * Wait for the modal to be hidden
   */
  async waitForModalClose() {
    await this.modal.waitFor({ state: "hidden" });
  }

  /**
   * Check if the modal is in Create mode
   */
  async isCreateMode(): Promise<boolean> {
    const title = await this.modalTitle.textContent();
    return title?.includes("Create New Project") ?? false;
  }

  /**
   * Check if the modal is in Edit mode
   */
  async isEditMode(): Promise<boolean> {
    const title = await this.modalTitle.textContent();
    return title?.includes("Edit Project") ?? false;
  }

  /**
   * Fill the project name field
   */
  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  /**
   * Fill the duration field
   */
  async fillDuration(days: number | string) {
    await this.durationInput.fill(days.toString());
  }

  /**
   * Fill the planned date field
   * @param date - Date in YYYY-MM-DD format or Date object
   */
  async fillPlannedDate(date: string | Date) {
    const dateString = typeof date === "string" ? date : date.toISOString().split("T")[0];
    await this.plannedDateInput.fill(dateString);
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.nameInput.clear();
    await this.durationInput.clear();
    await this.plannedDateInput.clear();
  }

  /**
   * Fill the entire form
   */
  async fillForm(data: { name: string; duration: number | string; plannedDate?: string | Date }) {
    await this.fillName(data.name);
    await this.fillDuration(data.duration);
    if (data.plannedDate) {
      await this.fillPlannedDate(data.plannedDate);
    }
  }

  /**
   * Submit the form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Cancel the form
   */
  async cancel() {
    await this.cancelButton.click();
  }

  /**
   * Create a new project (fill form and submit)
   */
  async createProject(data: { name: string; duration: number | string; plannedDate?: string | Date }) {
    await this.waitForModal();
    await this.fillForm(data);
    await this.submit();
    await this.waitForModalClose();
  }

  /**
   * Check if the submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  /**
   * Check if the submit button is in loading state
   */
  async isSubmitLoading(): Promise<boolean> {
    const hasLoader = await this.submitButton.locator("svg.animate-spin").count();
    return hasLoader > 0;
  }

  /**
   * Get the current value of the name input
   */
  async getNameValue(): Promise<string> {
    return await this.nameInput.inputValue();
  }

  /**
   * Get the current value of the duration input
   */
  async getDurationValue(): Promise<string> {
    return await this.durationInput.inputValue();
  }

  /**
   * Get the current value of the planned date input
   */
  async getPlannedDateValue(): Promise<string> {
    return await this.plannedDateInput.inputValue();
  }

  /**
   * Check if name validation error is visible
   */
  async hasNameError(): Promise<boolean> {
    return await this.nameError.isVisible();
  }

  /**
   * Check if duration validation error is visible
   */
  async hasDurationError(): Promise<boolean> {
    return await this.durationError.isVisible();
  }
}
