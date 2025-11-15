import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { testUsers } from './fixtures/test-data';

// Use a separate test instance without authentication
// This overrides the global storageState so we can test the login page
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should show login form', async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should display all form fields', async ({ page }) => {
    // Verify all form elements are present
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should attempt login with credentials', async ({ page }) => {
    // Fill in the form with test credentials
    await loginPage.login(
      testUsers.invalidUser.email,
      testUsers.invalidUser.password,
    );

    // Note: This will fail without valid credentials, which is expected
    // You can check for error message or URL not changing as indication of failure
    await page.waitForTimeout(1000);
    // If login failed, we should still be on login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

