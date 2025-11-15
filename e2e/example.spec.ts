import { test, expect } from '@playwright/test';

// Override authentication for these tests since we're testing public pages
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Landing Page', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/VacationPlanner/i);
  });

  test('should have a login button or link', async ({ page }) => {
    await page.goto('/');
    
    // Look for login button/link (adjust the text to match your actual button)
    const loginElement = page.locator('a[href*="login"], button:has-text("Log")').first();
    await expect(loginElement).toBeVisible();
  });

  test('should navigate to login page directly', async ({ page }) => {
    // Navigate directly to login page to verify it loads
    await page.goto('/auth/login');
    
    // Verify we're on the login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should display login form', async ({ page }) => {
    // Check for email and password inputs
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    // Check for submit button
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('should display login form elements', async ({ page }) => {
    // Verify login form has required elements
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    const submitButton = page.getByRole('button', { name: /log in/i });
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});

