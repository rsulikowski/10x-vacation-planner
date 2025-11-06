# Testing Guide

This project uses a comprehensive testing strategy with both unit tests and end-to-end tests.

## Tech Stack

- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Browser**: Chromium (Desktop Chrome)

## Prerequisites

All testing dependencies are installed automatically when you run:

```bash
npm install
```

For Playwright, browsers are already installed during the setup process.

## Unit Tests (Vitest)

### Running Unit Tests

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Unit Tests

Unit tests should be placed next to the component/module they test with the `.spec.ts` or `.spec.tsx` extension.

Example structure:
```
src/
  components/
    ui/
      button.tsx
      button.spec.tsx  ← Unit test file
```

#### Example Unit Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<MyComponent onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Guidelines

- Use `describe` blocks to group related tests
- Follow the Arrange-Act-Assert pattern
- Use the custom `render` function from `@/test/test-utils` for React components
- Use `vi.fn()` for mocks and `vi.spyOn()` for spies
- Prefer `userEvent` over `fireEvent` for user interactions
- Use inline snapshots for readable assertions: `expect(value).toMatchInlineSnapshot()`

### Coverage Thresholds

The project has coverage thresholds set at 70% for:
- Lines
- Functions
- Branches
- Statements

## E2E Tests (Playwright)

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Show test report
npm run test:e2e:report
```

**Note**: E2E tests will automatically start the development server on `http://localhost:3000` if it's not already running.

### Writing E2E Tests

E2E tests should be placed in the `e2e/` directory with the `.spec.ts` extension.

#### Directory Structure

```
e2e/
  fixtures/         ← Test data
  pages/            ← Page Object Models
  example.spec.ts   ← Test files
  auth.spec.ts
```

#### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform action', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: /click me/i });
    
    // Act
    await button.click();
    
    // Assert
    await expect(page).toHaveURL(/\/success/);
  });
});
```

#### Using Page Object Model

```typescript
import { LoginPage } from './pages/login.page';

test('should login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  
  await expect(page).toHaveURL(/\/dashboard/);
});
```

### E2E Testing Guidelines

- Use Page Object Model for maintainable tests
- Use browser contexts for test isolation
- Prefer `getByRole()` and accessible locators
- Use `expect(page).toHaveScreenshot()` for visual regression
- Implement test hooks (`beforeEach`, `afterEach`) for setup/teardown
- Use the codegen tool for recording tests: `npx playwright codegen http://localhost:3000`
- Use trace viewer for debugging: `npx playwright show-trace trace.zip`

## Test Organization

### Unit Tests
- Place test files next to the code they test
- Use `.spec.ts` or `.spec.tsx` extension
- Test individual components, functions, and modules
- Mock external dependencies

### E2E Tests
- Place test files in the `e2e/` directory
- Use `.spec.ts` extension
- Test complete user flows
- Test real integrations (no mocks for external services)

## CI/CD Integration

Tests are configured to run in CI environments:
- Unit tests run on every commit
- E2E tests run with retry logic (2 retries on CI)
- Coverage reports are generated automatically
- Playwright tests fail on CI if `test.only` is accidentally left in code

## Debugging Tests

### Unit Tests
```bash
# Run tests in watch mode and filter by name
npm test -- -t "MyComponent"

# Open Vitest UI for visual debugging
npm run test:ui
```

### E2E Tests
```bash
# Run with debug mode (opens browser inspector)
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Run tests with headed browser
npx playwright test --headed

# Generate trace for debugging
npx playwright test --trace on
```

## Best Practices

1. **Write tests first** (TDD approach) or immediately after implementing features
2. **Test behavior, not implementation** - focus on what the user sees and does
3. **Keep tests simple and focused** - one test should verify one thing
4. **Use descriptive test names** - `it('should show error when email is invalid')`
5. **Avoid test interdependence** - each test should run independently
6. **Mock external dependencies** in unit tests, use real ones in E2E tests
7. **Use semantic queries** - prefer `getByRole` over `getByTestId`
8. **Clean up after tests** - use `afterEach` hooks

## Troubleshooting

### Vitest Issues

**Problem**: Tests fail with module resolution errors
**Solution**: Check `vitest.config.ts` path aliases match `tsconfig.json`

**Problem**: Tests timeout
**Solution**: Increase timeout in test: `{ timeout: 10000 }`

### Playwright Issues

**Problem**: Browser not installed
**Solution**: Run `npx playwright install chromium`

**Problem**: Server not starting
**Solution**: Ensure port 3000 is available, or change `baseURL` in `playwright.config.ts`

**Problem**: Tests failing on CI
**Solution**: Check trace files in `test-results/` directory

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

