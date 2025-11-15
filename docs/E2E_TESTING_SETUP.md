# E2E Testing Setup Guide

## Problem: Test Authentication

The E2E tests were failing with timeout errors because the `/projects` route requires authentication. Without proper authentication, the tests were being redirected to `/auth/login`, causing the tests to fail when looking for project page elements.

## Solution: Playwright Authentication Setup

We've implemented Playwright's authentication state storage pattern to handle authentication efficiently.

### How It Works

1. **Authentication Setup File** (`e2e/auth.setup.ts`)
   - Runs once before all tests
   - Logs in with test credentials
   - Saves authentication state to `playwright/.auth/user.json`

2. **Test Configuration** (`playwright.config.ts`)
   - Configured to run `auth.setup.ts` as a dependency
   - All tests use the stored authentication state
   - No need to log in for each test (faster execution)

3. **Test Files**
   - Tests automatically use the authenticated state
   - Can directly navigate to protected routes
   - Authentication is transparent to test code

## Setup Instructions

### 1. Create Test User in Database

You need a valid test user in your Supabase database. You have two options:

#### Option A: Create via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Create a user with:
   - Email: `test@example.com` (or your choice)
   - Password: `testpassword123` (or your choice)
   - Confirm email (mark as verified)

#### Option B: Create via SQL (if using local Supabase)
```sql
-- This is a placeholder - actual implementation depends on your Supabase setup
-- You may need to create the user through Supabase Auth API
```

### 2. Configure Test Credentials

Add test user credentials to your `.env.test` file:

```env
# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123

# Supabase Configuration (should match your dev/test environment)
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Verify `.gitignore`

Ensure the authentication state is not committed to git:

```gitignore
playwright/.auth/
```

✅ This has been added to `.gitignore`

## Running Tests

### First Time Setup
```bash
# Install dependencies (if not already done)
npm install

# Run tests (this will automatically run auth setup first)
npm run test:e2e
```

### Subsequent Runs
```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test e2e/create-project.spec.ts

# Run with UI mode
npx playwright test --ui

# Run in headed mode (see the browser)
npx playwright test --headed

# Debug a specific test
npx playwright test --debug e2e/create-project.spec.ts
```

### Re-run Authentication Setup
If you need to refresh the authentication state (e.g., credentials changed):

```bash
# Delete the stored auth state
rm -rf playwright/.auth

# Run tests again (will re-run auth setup)
npm run test:e2e
```

Or on Windows:
```powershell
# Delete the stored auth state
Remove-Item -Recurse -Force playwright\.auth

# Run tests again
npm run test:e2e
```

## Troubleshooting

### Issue: Tests still failing with authentication errors

**Possible causes:**
1. Test user doesn't exist in database
2. Wrong credentials in `.env.test`
3. Supabase configuration incorrect

**Solutions:**
1. Verify test user exists in Supabase dashboard
2. Check `.env.test` has correct credentials
3. Verify Supabase URL and keys are correct
4. Delete `playwright/.auth/` and re-run tests

### Issue: "Cannot find module" errors

**Solution:**
```bash
npm install
```

### Issue: Port 3000 already in use

**Solution:**
- Stop any running dev servers
- Or change the port in `playwright.config.ts`

### Issue: Tests are slow

**Possible causes:**
- Running tests serially instead of parallel
- Re-authenticating for each test

**Solutions:**
- Ensure `fullyParallel: true` in `playwright.config.ts` ✅
- Verify auth state is being reused (check for `playwright/.auth/user.json`) ✅

## Test Structure

```
e2e/
├── auth.setup.ts              # Authentication setup (runs first)
├── create-project.spec.ts     # Project creation tests
├── auth.spec.ts               # Authentication tests (doesn't need auth)
└── pages/                     # Page Object Models
    ├── login.page.ts
    ├── projects.page.ts
    └── ...
```

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Test Execution Flow                        │
└─────────────────────────────────────────────────────────────┘

1. Start Tests
   ↓
2. Run "setup" Project
   ↓
   auth.setup.ts
   ├── Navigate to /auth/login
   ├── Fill credentials
   ├── Submit login form
   ├── Wait for redirect to /projects
   └── Save state → playwright/.auth/user.json
   ↓
3. Run "chromium" Project (depends on "setup")
   ↓
   Load auth state from playwright/.auth/user.json
   ↓
4. Run Tests
   ├── create-project.spec.ts (authenticated ✓)
   ├── other-tests.spec.ts (authenticated ✓)
   └── ...
```

## Benefits of This Approach

✅ **Fast** - Authenticate once, reuse for all tests
✅ **Reliable** - Consistent authentication state
✅ **Simple** - Tests don't need to handle login
✅ **Maintainable** - Single source of truth for auth
✅ **Parallel** - Tests can run in parallel with shared auth

## Alternative Approaches (Not Recommended)

❌ **Login in each test** - Slow, repetitive
❌ **Skip authentication** - Won't work for protected routes
❌ **Mock authentication** - Doesn't test real auth flow
❌ **Disable middleware** - Unrealistic test environment

## Next Steps

1. ✅ Create test user in database
2. ✅ Configure `.env.test` with credentials
3. ✅ Run `npm run test:e2e`
4. ✅ Verify tests pass
5. Consider adding more test users for different roles (if applicable)

## References

- [Playwright Authentication Guide](https://playwright.dev/docs/auth)
- [Playwright Storage State](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)

