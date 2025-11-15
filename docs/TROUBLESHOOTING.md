# E2E Authentication Troubleshooting Guide

## Current Issue: auth.setup.ts Fails to Navigate to /projects

### What's Happening

The authentication setup is failing at this line:
```
await page.waitForURL(/\/projects/, { timeout: 10000 });
```

This means the login is not completing successfully and redirecting to `/projects`.

## Diagnostic Steps

### Step 1: Check the Screenshot

After the test fails, look at the screenshot:
```
test-results/auth-failure.png
```

This will show you exactly what page you're on after the login attempt.

### Step 2: Check the Console Output

When you run the tests, look for these console messages:
- `Attempting to login with email: [email]`
- Error messages from the page

### Step 3: Verify Your Setup

Run through this checklist:

#### ✅ Checklist

1. **Test User Exists in Supabase**
   - [ ] Go to Supabase Dashboard
   - [ ] Navigate to Authentication → Users
   - [ ] Verify user with email from `.env.test` exists
   - [ ] Verify email is confirmed (green checkmark)

2. **Environment Variables Correct**
   - [ ] `.env.test` file exists in project root
   - [ ] `TEST_USER_EMAIL` matches Supabase user
   - [ ] `TEST_USER_PASSWORD` is correct
   - [ ] `PUBLIC_SUPABASE_URL` is correct
   - [ ] `PUBLIC_SUPABASE_ANON_KEY` is correct

3. **Supabase Configuration**
   - [ ] Supabase project is running
   - [ ] RLS policies allow access
   - [ ] User is active (not disabled)

## Common Issues and Solutions

### Issue 1: Invalid Credentials

**Symptoms:**
- Error message: "Invalid credentials"
- Screenshot shows error on login page

**Solution:**
```bash
# Verify password in Supabase
# Go to Supabase Dashboard → Authentication → Users
# Click on your test user
# Reset password if needed
```

### Issue 2: Email Not Confirmed

**Symptoms:**
- Error message: "Please confirm your email"
- Login fails

**Solution:**
In Supabase Dashboard:
1. Go to Authentication → Users
2. Find your test user
3. Click the three dots menu
4. Select "Confirm Email"

### Issue 3: Wrong Supabase URL/Key

**Symptoms:**
- No error message
- Login just doesn't work
- Console shows network errors

**Solution:**
1. Check your `.env` file (main one) for correct values
2. Copy the correct values to `.env.test`:
```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Issue 4: Environment Variables Not Loading

**Symptoms:**
- Console shows: `Attempting to login with email: test@example.com` (default)
- But your `.env.test` has different values

**Solution:**
The `playwright.config.ts` should have this at the top:
```typescript
import dotenv from 'dotenv';
dotenv.config({ path: resolve(process.cwd(), '.env.test') });
```

✅ This is already in your config, so this should be working.

### Issue 5: User Doesn't Have Access to Projects

**Symptoms:**
- Login succeeds but redirects back to login
- Or redirects to a different page

**Solution:**
Check if there are any RLS (Row Level Security) policies that might be blocking access.

## Manual Testing

To verify your credentials work, try logging in manually:

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open browser to: `http://localhost:3000/auth/login`

3. Try logging in with your test credentials

4. If this fails, the problem is with the credentials/Supabase setup
5. If this succeeds, the problem is with the test setup

## Quick Fix: Create Test User via Script

Here's how to verify/create a test user programmatically:

### Option A: Via Supabase Dashboard

1. **Go to:** Supabase Dashboard → Authentication → Users
2. **Click:** "Add User"
3. **Enter:**
   - Email: `test@example.com`
   - Password: `testpassword123`
   - ✅ Auto Confirm User: YES
4. **Click:** "Create User"

### Option B: Via Supabase SQL Editor

1. Go to SQL Editor in Supabase
2. This won't work directly - Supabase Auth users need to be created via the Auth API

### Option C: Use Supabase CLI (if using local Supabase)

```bash
# If you're using local Supabase
supabase db reset

# Then create user via the dashboard or API
```

## Debug: Enable Verbose Logging

To see more details about what's happening:

### 1. Enable Playwright Debug Mode

```bash
# Windows PowerShell
$env:DEBUG="pw:api"
npm run test:e2e

# Or run specific test in debug mode
npx playwright test e2e/auth.setup.ts --debug
```

### 2. Enable Network Logging

Update `playwright.config.ts`:
```typescript
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on',  // Changed from 'on-first-retry'
  screenshot: 'on',  // Changed from 'only-on-failure'
  video: 'on',  // Add this
},
```

## Verify .env.test Is Correct

Your `.env.test` should look like this:

```env
# Test User Credentials
TEST_USER_EMAIL=your-actual-test-email@example.com
TEST_USER_PASSWORD=your-actual-password

# Supabase Configuration (copy from your main .env or Supabase dashboard)
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

### How to Get Supabase URL and Key

1. Go to your Supabase project dashboard
2. Click on Settings (gear icon) → API
3. Copy:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon/public key** → `PUBLIC_SUPABASE_ANON_KEY`

## Test the Auth Setup Independently

Run just the auth setup to see detailed output:

```bash
npx playwright test e2e/auth.setup.ts --headed
```

This will:
- Show the browser window
- Let you see what's happening
- Stop at any errors

## Alternative: Skip Auth Setup Temporarily

If you need to run other tests while debugging auth:

### Option 1: Use an Already Authenticated Session

1. Manually log in via browser
2. Export cookies/storage
3. Use those in tests

### Option 2: Test Without Protected Routes

Temporarily make the route public (for testing only):

```typescript
// src/middleware/index.ts (TEMPORARY - DON'T COMMIT)
const protectedRoutes = []; // Empty array = nothing protected
```

## Next Steps

1. **Run the test with `--headed` flag:**
   ```bash
   npx playwright test e2e/auth.setup.ts --headed
   ```
   Watch what happens in the browser

2. **Check the screenshot:**
   ```
   test-results/auth-failure.png
   ```

3. **Check console output:**
   - What email is being used?
   - Are there any error messages?

4. **Verify credentials work manually:**
   - Go to `http://localhost:3000/auth/login`
   - Try logging in with your test credentials

5. **Report back with:**
   - Screenshot contents
   - Console output
   - Whether manual login works

## Still Not Working?

If you've tried everything above and it still doesn't work, let me know:

1. What does the screenshot show? (test-results/auth-failure.png)
2. What's in the console output when you run the tests?
3. Does manual login work with the same credentials?
4. What's your Supabase setup? (local vs hosted)

This will help identify the exact issue and provide a specific fix.

