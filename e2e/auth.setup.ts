import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages';

/**
 * Path to store authenticated state
 */
const authFile = 'playwright/.auth/user.json';

/**
 * Setup authentication before running tests
 * This will be run once and the authentication state will be reused
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Navigate to login page
  await loginPage.goto();
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Verify we're on the login page
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.submitButton).toBeVisible();
  
  // Get credentials from environment
  const email = process.env.TEST_USER_EMAIL || 'testuser@mail.com';
  const password = process.env.TEST_USER_PASSWORD || 'testpassword123';
  
  // Perform login with test credentials
  await loginPage.login(email, password);
  
  // Wait for navigation or error message
  // The login form does a client-side redirect with window.location.href
  try {
    // Wait for successful navigation to projects page
    await page.waitForURL(/\/projects/, { timeout: 10000 });
    
    // Verify we're authenticated by checking for projects page elements
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
    
    // Save authenticated state
    await page.context().storageState({ path: authFile });
  } catch (error) {
    // Check if there's an error message on the page
    const errorElement = page.getByRole('alert').first();
    const hasError = await errorElement.isVisible().catch(() => false);
    
    if (hasError) {
      const errorText = await errorElement.textContent();
      console.error('Login failed with error:', errorText);
      throw new Error(`Login failed: ${errorText}`);
    }
    
    // Check current URL
    const currentUrl = page.url();
    console.error('Current URL after login attempt:', currentUrl);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/auth-failure.png', fullPage: true });
    
    throw new Error(`Authentication failed. Still on: ${currentUrl}. Check test-results/auth-failure.png for details.`);
  }
});

