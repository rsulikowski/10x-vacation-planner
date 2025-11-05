# Authentication Architecture Specification - VacationPlanner

## Document Information

**Version:** 1.0  
**Date:** November 3, 2025  
**Requirements:** US-001, US-002, US-003, US-004 from PRD  
**Tech Stack:** Astro 5, React 19, TypeScript 5, Supabase Auth, Tailwind 4

---

## Executive Summary

This document defines the technical architecture for implementing user authentication in VacationPlanner. The system will provide login and logout functionality using Supabase Auth as the authentication provider. The architecture maintains compatibility with the existing SSR (Server-Side Rendering) model configured in Astro and ensures all existing features continue to work without disruption.

Key architectural decisions:
- **Server-Side Session Management**: Leverage Supabase Auth with server-side session verification
- **Cookie-Based Authentication**: Use HTTP-only cookies for secure token storage
- **Middleware-Based Protection**: Implement route protection at the middleware layer
- **Graceful Degradation**: Authenticated and non-authenticated states clearly separated
- **Minimal MVP**: Login/logout only - user accounts created manually via Supabase Dashboard or by system admin

---

## 1. USER INTERFACE ARCHITECTURE

### 1.1 Page Structure Overview

The authentication system introduces new pages and modifies existing ones to support authenticated and non-authenticated states.

#### 1.1.1 New Authentication Pages

All authentication pages will be Astro pages (`.astro`) that render forms using React components for interactivity. This follows the existing pattern where Astro handles routing and SSR, while React provides client-side interactivity.

**Page: `/login`** (`src/pages/auth/login.astro`)
- **Purpose**: User login interface
- **Accessibility**: Public (unauthenticated only - authenticated users redirect to `/projects`)
- **Components**: LoginForm (React component)
- **Layout**: AuthLayout (new minimal layout without main navigation)
- **Server Logic**: Check if user is already authenticated; if yes, redirect to `/projects`

#### 1.1.2 Modified Existing Pages

**Page: `/` (`src/pages/index.astro`)**
- **Current State**: Shows Welcome component
- **New Behavior**:
  - If **unauthenticated**: Show landing page with login button
  - If **authenticated**: Redirect to `/projects`
- **Components**: 
  - LandingPage (new Astro component replacing Welcome)
  - Includes hero section, feature highlights, CTA button to login
- **Server Logic**: Check authentication status in Astro frontmatter; redirect authenticated users

**Page: `/projects`** (`src/pages/projects/index.astro`)
- **Current State**: Public access, shows ProjectsPage
- **New Behavior**: Protected route - requires authentication
- **Components**: ProjectsPage (existing, no changes)
- **Server Logic**: Middleware will handle redirect to `/login` if unauthenticated
- **Layout**: Layout.astro (extended with user menu)

**Page: `/projects/[projectId]/notes`** (`src/pages/projects/[projectId]/notes.astro`)
- **Current State**: Public access
- **New Behavior**: Protected route - requires authentication
- **Server Logic**: Middleware will handle redirect to `/login` if unauthenticated
- **Layout**: Layout.astro (extended with user menu)

### 1.2 Layout Architecture

#### 1.2.1 AuthLayout (`src/layouts/AuthLayout.astro`)

New minimal layout for authentication pages (login, register, password reset).

**Features:**
- Centered card-based design
- No main navigation
- Theme toggle in top-right corner (reuses ThemeToggle component)
- Toaster for notifications
- Background with subtle gradient

**Structure:**
```astro
<!doctype html>
<html lang="en">
  <head>...</head>
  <body>
    <ThemeToggle />
    <main class="min-h-screen flex items-center justify-center p-4">
      <slot />
    </main>
    <Toaster />
  </body>
</html>
```

#### 1.2.2 Layout.astro (Modified)

Extended to support authenticated state and user menu.

**Changes:**
- Add navigation header with:
  - Logo/App name (left)
  - Navigation links: Projects (for authenticated users)
  - User menu (right): Shows user email and Logout button
- ThemeToggle remains in fixed top-right position
- Responsive navigation for mobile

**User Menu Component** (`src/components/UserMenu.tsx`) - React
- Displays user email
- Dropdown menu with single action:
  - "Logout" button → triggers logout API call
- Uses Shadcn/ui DropdownMenu component

**Navigation Links:**
- "Projects" → `/projects` (visible only when authenticated)

### 1.3 React Components Architecture

All forms are interactive React components using controlled inputs with client-side validation. Form submission calls API endpoints using `fetch`.

#### 1.3.1 LoginForm Component

**Location:** `src/components/auth/LoginForm.tsx`

**Props:** None (standalone)

**State:**
- `email: string` - controlled input
- `password: string` - controlled input
- `isLoading: boolean` - submission state
- `error: string | null` - error message from API

**Validation:**
- Email: Required, valid email format
- Password: Required, minimum 6 characters (client-side)

**User Flow:**
1. User enters email and password
2. Client validates inputs
3. On submit:
   - Disable form, show loading state
   - POST to `/api/auth/login` with credentials
   - On success (200): Reload page or redirect to `/projects`
   - On error (400/401/500): Display error message below form

**Error Messages:**
- 400: "Invalid email or password format"
- 401: "Invalid credentials. Please try again."
- 500: "An unexpected error occurred. Please try again later."

**Accessibility:**
- Labels for all inputs
- Error messages associated with inputs via `aria-describedby`
- Submit button disabled during loading with `aria-busy`
- Focus management: on error, focus first invalid field

#### 1.3.2 UserMenu Component

**Location:** `src/components/UserMenu.tsx`

**Props:**
- `userEmail: string` - displayed in dropdown

**Features:**
- Email initial badge (first letter of email)
- Dropdown menu (Shadcn DropdownMenu)
- Single menu item:
  - Logout → calls logout API and reloads page

**Logout Flow:**
1. User clicks "Logout"
2. POST to `/api/auth/logout`
3. On success: `window.location.href = '/'` (reload to clear state)
4. On error: Display toast notification

### 1.4 Client-Side Routing and Navigation

**Redirects After Authentication Actions:**
- After successful login → `/projects`
- After logout → `/` (home page)

**Protected Route Behavior:**
- Middleware intercepts protected routes
- If not authenticated → redirect to `/login?redirect={original_path}`
- After login → redirect to original requested path (or `/projects` by default)

### 1.5 Error Handling and User Feedback

#### 1.5.1 Form Validation Errors

**Display Strategy:** Inline errors below form fields
- Red border on invalid input
- Error icon + message below field
- Error message connected via `aria-describedby`
- First invalid field receives focus

**Validation Timing:**
- On blur: Validate individual field
- On submit: Validate all fields
- On change (after first blur): Real-time validation

#### 1.5.2 API Errors

**Display Strategy:** Alert/banner above form
- Error icon + error message
- Dismissible close button
- Color-coded by severity (red for errors)

**Common Error Scenarios:**
- Network error: "Unable to connect. Please check your internet connection."
- 500 Server error: "An unexpected error occurred. Please try again later."
- 401 Unauthorized: "Your session has expired. Please log in again."
- 429 Rate limit: "Too many attempts. Please try again in X minutes."

#### 1.5.3 Success Messages

**Display Strategy:** 
- Toast notifications (using Sonner) for non-critical actions
- In-page success messages for critical flows (registration, password reset)
- Success messages include:
  - Checkmark icon
  - Clear success text
  - Next action guidance

**Examples:**
- Login success: Auto-redirect to projects (seamless experience)
- Logout success: Redirect to home page

### 1.6 Accessibility Considerations

All authentication forms and components will follow WCAG 2.1 Level AA standards:

- **Keyboard Navigation:** All interactive elements accessible via Tab, Enter, Escape
- **Screen Reader Support:**
  - Proper heading hierarchy (h1 → h2 → h3)
  - ARIA labels for icon buttons
  - ARIA live regions for dynamic error/success messages
  - Form field labels properly associated
- **Focus Management:**
  - Visible focus indicators on all interactive elements
  - Focus trapped in modals/dialogs
  - Focus moved to first error on validation failure
- **Color Contrast:** Minimum 4.5:1 ratio for text, 3:1 for UI components
- **Error Identification:** Errors identified by text, not color alone

---

## 2. BACKEND LOGIC

### 2.1 API Endpoints Structure

All authentication endpoints follow REST conventions and are located in `src/pages/api/auth/`.

#### 2.1.1 POST `/api/auth/login`

**Purpose:** Authenticate user and create session

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Validation Schema:**
```typescript
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
```

**Server Logic:**
1. Parse and validate request body
2. Call Supabase Auth `signInWithPassword()` with credentials
3. On success, Supabase returns session with access_token and refresh_token
4. Set HTTP-only cookies:
   - `sb-access-token` (access token, httpOnly, secure, sameSite: lax)
   - `sb-refresh-token` (refresh token, httpOnly, secure, sameSite: lax)
5. Return success response with user info

**Response 200 Success:**
```typescript
{
  user: {
    id: string;
    email: string;
  },
  message: "Login successful"
}
```

**Error Responses:**
- 400: Validation error
- 401: Invalid credentials
- 500: Server error

**Implementation File:** `src/pages/api/auth/login.ts`

**Service Dependency:** `AuthService.login()` + cookie management

**Cookie Settings:**
- Path: `/`
- MaxAge: 7 days (refresh token), 1 hour (access token)
- HttpOnly: true
- Secure: true (production only)
- SameSite: "lax"

---

#### 2.1.2 POST `/api/auth/logout`

**Purpose:** Terminate user session

**Request Body:** None (reads cookies)

**Server Logic:**
1. Extract access token from `sb-access-token` cookie
2. Call Supabase Auth `signOut()` with token
3. Clear authentication cookies (set MaxAge to 0)
4. Return success response

**Response 200 Success:**
```typescript
{
  message: "Logout successful"
}
```

**Error Responses:**
- 500: Server error

**Implementation File:** `src/pages/api/auth/logout.ts`

**Note:** This endpoint should succeed even if token is invalid/expired (logout is idempotent)

---

### 2.2 Service Layer

All authentication business logic is encapsulated in the `AuthService` class.

#### 2.2.1 AuthService Class

**Location:** `src/services/auth.service.ts`

**Responsibilities:**
- Interact with Supabase Auth API
- Manage user sessions
- Handle user login and logout

**Class Structure:**

```typescript
export class AuthService {
  /**
   * Authenticate user and return session
   */
  async login(
    email: string, 
    password: string, 
    db: DbClient
  ): Promise<LoginResult>

  /**
   * Sign out user (invalidate session)
   */
  async logout(
    accessToken: string, 
    db: DbClient
  ): Promise<void>

  /**
   * Verify user session (used by middleware)
   */
  async verifySession(
    accessToken: string, 
    db: DbClient
  ): Promise<User | null>
}

export const authService = new AuthService();
```

**Error Handling:**
- Throws `ApiError` with appropriate status codes
- Logs errors for debugging
- Sanitizes error messages before returning to client

---

### 2.3 Data Models and Database Schema

#### 2.3.1 User Authentication (Managed by Supabase Auth)

Supabase manages the `auth.users` table internally. We don't modify this table directly.

**Fields available from Supabase Auth:**
- `id` (UUID) - user ID
- `email` (string) - user email
- `created_at` (timestamp) - account creation date
- `encrypted_password` (string) - hashed password (not accessible)

**Note:** User accounts must be created manually via Supabase Dashboard by system administrators.

#### 2.3.2 Updated Travel Projects Table

**Table Name:** `travel_projects`

**Current Schema:** Already has `user_id` field

**RLS Update Required:** Ensure policies reference `auth.uid()` instead of hardcoded user ID

**Updated RLS Policies:**
```sql
-- Drop existing policies (if any)
DROP POLICY IF EXISTS travel_projects_select_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_insert_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_update_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_delete_policy ON travel_projects;

-- Users can only see their own projects
CREATE POLICY travel_projects_select_policy ON travel_projects
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own projects
CREATE POLICY travel_projects_insert_policy ON travel_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own projects
CREATE POLICY travel_projects_update_policy ON travel_projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own projects
CREATE POLICY travel_projects_delete_policy ON travel_projects
  FOR DELETE USING (auth.uid() = user_id);
```

**Migration File:** `supabase/migrations/20251103_update_rls_policies.sql`

#### 2.3.3 Updated Notes Table

**Table Name:** `notes`

Notes are linked to projects, so RLS policies should verify project ownership.

**Updated RLS Policies:**
```sql
-- Drop existing policies
DROP POLICY IF EXISTS notes_select_policy ON notes;
DROP POLICY IF EXISTS notes_insert_policy ON notes;
DROP POLICY IF EXISTS notes_update_policy ON notes;
DROP POLICY IF EXISTS notes_delete_policy ON notes;

-- Users can only see notes from their projects
CREATE POLICY notes_select_policy ON notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = notes.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );

-- Users can only insert notes into their projects
CREATE POLICY notes_insert_policy ON notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = notes.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );

-- Users can only update notes from their projects
CREATE POLICY notes_update_policy ON notes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = notes.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );

-- Users can only delete notes from their projects
CREATE POLICY notes_delete_policy ON notes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = notes.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );
```

**Migration File:** Same as above (`20251103_update_rls_policies.sql`)

#### 2.3.4 Updated AI Logs Table

**Table Name:** `ai_logs`

AI logs are linked to projects, so RLS policies should verify project ownership.

**Updated RLS Policies:**
```sql
-- Drop existing policies
DROP POLICY IF EXISTS ai_logs_select_policy ON ai_logs;
DROP POLICY IF EXISTS ai_logs_insert_policy ON ai_logs;

-- Users can only see AI logs from their projects
CREATE POLICY ai_logs_select_policy ON ai_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = ai_logs.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );

-- Service can insert AI logs for user's projects
CREATE POLICY ai_logs_insert_policy ON ai_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = ai_logs.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );
```

**Migration File:** Same as above (`20251103_update_rls_policies.sql`)

---

### 2.4 Input Validation

All input validation uses Zod schemas located in `src/lib/schemas/auth.schema.ts`.

**New Schema File:** `src/lib/schemas/auth.schema.ts`

**Schema Definitions:**
- `loginSchema` - validates login input

**Validation Rules:**
- **Email:** Must be valid email format (RFC 5322 compliant)
- **Password:** Minimum 8 characters (client-side validation)

**Error Response Format** (consistent with existing API):
```typescript
{
  error: "Validation Error",
  message: "Invalid input data",
  details: [
    {
      field: "password",
      message: "Password must be at least 8 characters"
    }
  ]
}
```

---

### 2.5 Exception Handling

Exception handling follows the existing pattern using `ApiError` class and `handleApiError` utility.

**Error Categories:**

1. **Validation Errors (400):**
   - Invalid email format
   - Password doesn't meet requirements
   - Missing required fields

2. **Authentication Errors (401):**
   - Invalid credentials
   - Expired or invalid token
   - Session expired

3. **Resource Errors (404):**
   - User not found (internal use only, not exposed to client)

4. **Rate Limit Errors (429):**
   - Too many login attempts

5. **Server Errors (500):**
   - Database connection errors
   - Supabase API errors
   - Unexpected server errors

**Error Logging:**
- All errors logged with `console.error()`
- Include error type, message, stack trace
- For production: Use structured logging with error tracking service (e.g., Sentry)

**Error Sanitization:**
- Never expose internal error details to client
- Generic error messages for 500 errors
- Specific error messages for validation/authentication errors only

---

### 2.6 Server-Side Rendering Updates

#### 2.6.1 Middleware Enhancement

**File:** `src/middleware/index.ts`

**Current Implementation:**
- Attaches Supabase client to `context.locals`

**Updated Implementation:**
- Attach Supabase client
- Extract access token from cookies
- Verify session with Supabase Auth
- Attach user to `context.locals.user` if authenticated
- Handle route protection (redirect unauthenticated users from protected routes)

**Enhanced Middleware Logic:**

```typescript
import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  // Attach Supabase client
  context.locals.supabase = supabaseClient;

  // Extract access token from cookie
  const accessToken = context.cookies.get("sb-access-token")?.value;

  // If access token exists, verify session
  if (accessToken) {
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);
    
    if (!error && user) {
      context.locals.user = user;
    }
  }

  // Define protected routes
  const protectedRoutes = ['/projects'];
  const authRoutes = ['/login'];
  const pathname = new URL(context.request.url).pathname;

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !context.locals.user) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Redirect authenticated users from auth pages to projects
  if (isAuthRoute && context.locals.user) {
    return context.redirect('/projects');
  }

  return next();
});
```

**Updated `env.d.ts` Type Definitions:**

```typescript
import type { User } from "@supabase/supabase-js";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      user?: User; // Add user to locals
    }
  }
}
```

#### 2.6.2 Page-Level Authentication Checks

While middleware handles redirects, individual pages should also check authentication status for conditional rendering.

**Example:** `src/pages/projects/index.astro`

```astro
---
import Layout from "../../layouts/Layout.astro";
import { ProjectsPage } from "../../components/ProjectsPage";

// User is guaranteed to be authenticated here (middleware redirected if not)
const user = Astro.locals.user;
---

<Layout title="Projects | VacationPlanner">
  <ProjectsPage client:load />
</Layout>
```

#### 2.6.3 API Endpoint Authentication

**Pattern for Protected API Endpoints:**

```typescript
export const GET: APIRoute = async (context) => {
  try {
    // Extract user from context (set by middleware)
    const user = context.locals.user;
    
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userId = user.id;

    // Proceed with authorized logic
    // ...
  } catch (error) {
    return handleApiError(error);
  }
};
```

**Alternative: Use `verifyUser()` utility** (for endpoints that need explicit token verification)

```typescript
export const GET: APIRoute = async (context) => {
  try {
    // Verify user and get user ID from token in Authorization header
    const userId = await verifyUser(context);

    // Proceed with authorized logic
    // ...
  } catch (error) {
    return handleApiError(error);
  }
};
```

**Recommendation:** Use `context.locals.user` for most protected pages and endpoints (middleware already verified). Use `verifyUser()` only for API endpoints that might be called from external clients with Authorization header.

---

## 3. AUTHENTICATION SYSTEM

### 3.1 Supabase Auth Integration

VacationPlanner leverages Supabase Auth for all authentication functionality. Supabase provides:

- User registration with email/password
- Email verification with magic links
- Password reset with magic links
- Session management with JWT tokens
- Secure password hashing (bcrypt)

#### 3.1.1 Supabase Configuration

**Environment Variables:**

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

**Supabase Dashboard Configuration:**

1. **Auth Providers:**
   - Email/Password enabled
   - No OAuth providers in MVP (can be added later)

2. **Email Settings:**
   - Disable email confirmations for signups (users can login immediately after registration)
   - Auto-confirm emails: Enabled

3. **User Management:**
   - Email confirmation NOT required before login
   - Users can access the app immediately after registration

#### 3.1.2 Session Management

**Session Flow:**

1. **Login:**
   - User provides email/password
   - Supabase verifies credentials
   - Supabase returns session object with:
     - `access_token` (JWT, expires in 1 hour)
     - `refresh_token` (expires in 7 days)
   - Server stores tokens in HTTP-only cookies

2. **Session Verification:**
   - Middleware reads `access_token` from cookie
   - Calls `supabase.auth.getUser(accessToken)` to verify
   - If valid, user is authenticated
   - If expired, attempt refresh using `refresh_token`

3. **Token Refresh:**
   - Middleware detects expired access token
   - Uses refresh token to get new access token
   - Updates cookies with new tokens
   - Continues request with refreshed session

4. **Logout:**
   - Client calls logout endpoint
   - Server calls `supabase.auth.signOut()`
   - Clears all auth cookies
   - Redirects to home page

**Token Storage Strategy:**

- **Access Token:** HTTP-only cookie, expires in 1 hour
- **Refresh Token:** HTTP-only cookie, expires in 7 days
- **Cookie Attributes:**
  - `HttpOnly`: Prevents JavaScript access (XSS protection)
  - `Secure`: Only sent over HTTPS (production)
  - `SameSite: Lax`: CSRF protection
  - `Path: /`: Available to all routes

**Security Considerations:**

- Tokens never exposed to client JavaScript
- Refresh token rotation (Supabase handles automatically)
- Session revocation on logout (server-side)
- CSRF protection via SameSite cookies


### 3.2 Cookie Management

**Cookie Management Utilities:**

**File:** `src/lib/auth/cookies.ts`

```typescript
import type { AstroCookies } from "astro";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

/**
 * Set authentication cookies
 */
export function setAuthCookies(cookies: AstroCookies, tokens: AuthTokens): void {
  const isProduction = import.meta.env.PROD;

  // Access token (1 hour)
  cookies.set("sb-access-token", tokens.access_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour in seconds
  });

  // Refresh token (7 days)
  cookies.set("sb-refresh-token", tokens.refresh_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(cookies: AstroCookies): void {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
}

/**
 * Get access token from cookies
 */
export function getAccessToken(cookies: AstroCookies): string | undefined {
  return cookies.get("sb-access-token")?.value;
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(cookies: AstroCookies): string | undefined {
  return cookies.get("sb-refresh-token")?.value;
}
```

**Usage in API Endpoints:**

```typescript
// Login endpoint
import { setAuthCookies } from "../../lib/auth/cookies";

export const POST: APIRoute = async (context) => {
  // ... authenticate user
  const { session } = await supabase.auth.signInWithPassword({ email, password });

  // Set cookies
  setAuthCookies(context.cookies, {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  return createSuccessResponse({ user: session.user });
};
```

### 3.3 Security Best Practices

#### 3.3.1 Password Security

- **Minimum Requirements:**
  - 8+ characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - (Optional: special character for extra security)

- **Hashing:**
  - Supabase uses bcrypt (industry standard)
  - Passwords never stored in plaintext
  - Hashing handled automatically by Supabase

#### 3.3.2 Token Security

- **JWT Tokens:**
  - Signed by Supabase (HMAC SHA-256)
  - Include expiration timestamp
  - Include user metadata

- **Storage:**
  - HTTP-only cookies prevent XSS attacks
  - Secure flag ensures HTTPS-only transmission
  - SameSite=Lax prevents CSRF attacks

- **Rotation:**
  - Access tokens expire after 1 hour
  - Refresh tokens expire after 7 days
  - Refresh tokens automatically rotated on use

#### 3.3.3 CSRF Protection

- **SameSite Cookies:**
  - Set to "lax" mode
  - Prevents cross-site request forgery

- **Origin Validation:**
  - Middleware can validate request origin header
  - Reject requests from untrusted origins

#### 3.3.4 Rate Limiting

**Implementation Strategy:**

- **Client-Side:**
  - Disable submit button after click
  - Show loading state during requests

- **Server-Side:**
  - Implement rate limiting for sensitive endpoints:
    - `/api/auth/login`: Max 10 attempts per IP per hour

**Rate Limit Implementation:**

Use in-memory store (for MVP) or Redis (production):

```typescript
// src/lib/rate-limiter.ts
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
}
```

**Usage in endpoints:**

```typescript
export const POST: APIRoute = async (context) => {
  const ip = context.clientAddress;
  
  if (!checkRateLimit(`login:${ip}`, 10, 60 * 60 * 1000)) {
    throw new ApiError(429, "Too many login attempts. Please try again later.");
  }

  // Proceed with login
};
```

#### 3.3.5 Email Enumeration Prevention

**Strategy:**
- Login errors are generic ("Invalid credentials") to prevent email enumeration
- Don't reveal whether email exists or password is incorrect
- Protects user privacy and security

#### 3.3.6 Session Hijacking Prevention

**Mitigations:**
- HTTP-only cookies (prevent JavaScript access)
- Secure flag on cookies (HTTPS only)
- Short-lived access tokens (1 hour)
- Refresh token rotation
- IP validation (optional: track IP on session creation)
- User-Agent validation (optional: detect session from different device)

### 3.4 User Experience Considerations

#### 3.4.1 Loading States

All forms show loading indicators during API calls:
- Disabled form inputs
- Loading spinner on submit button
- Button text changes (e.g., "Logging in..." instead of "Log In")

#### 3.4.2 Success Feedback

- Toast notifications for non-critical actions
- In-page messages for critical actions
- Auto-redirects after success (with countdown)
- Clear next-step instructions

#### 3.4.3 Error Recovery

- Clear, actionable error messages
- "Try Again" buttons for recoverable errors
- "Contact Support" links for persistent errors
- Preserve form data on error (don't clear valid inputs)

#### 3.4.4 Responsive Design

- Web application approach
- Readable font sizes (minimum 16px for inputs)
- Adequate spacing between interactive elements

### 3.5 Testing Considerations

#### 3.5.1 Manual Testing Scenarios

**Login Flow:**
1. Login with valid credentials → Success, redirect to projects
2. Login with invalid email → Error: "Invalid credentials"
3. Login with invalid password → Error: "Invalid credentials"
4. Login, then refresh page → Stay logged in (session persists)
5. Login, then close browser and reopen → Stay logged in (refresh token works)

**Session Management:**
1. Login, then logout → Redirect to home, can't access protected routes
2. Login, wait 1 hour, refresh page → Session refreshed, stay logged in
3. Login, wait 7 days → Session expired, redirect to login

**Protected Routes:**
1. Access `/projects` without login → Redirect to `/login`
2. Access `/login` when logged in → Redirect to `/projects`
3. Logout from any page → Redirect to home

#### 3.5.2 Automated Testing (Future)

Recommended test frameworks:
- **Unit Tests:** Vitest for service layer and utilities
- **Integration Tests:** Testing Library for React components
- **E2E Tests:** Playwright for full user flows

**Priority Test Cases:**
- Login and logout
- Protected route access
- Session persistence
- Token refresh
- Rate limiting on login endpoint

---

## 4. MIGRATION PLAN

### 4.1 Database Migrations

**Migration Files to Create:**

1. **`supabase/migrations/20251103_update_rls_policies.sql`**
   - Update RLS policies for `travel_projects`, `notes`, `ai_logs`
   - Replace hardcoded user ID with `auth.uid()`
   - Enable RLS on all tables

**Note:** User accounts must be created manually via Supabase Dashboard. Create test users for development:
```sql
-- Example: Create test user via Supabase Dashboard or SQL
-- Email: test@example.com
-- Password: TestPassword123
```

**Migration Execution:**
```bash
supabase migration up
```

### 4.2 Code Migration Steps

**Phase 1: Infrastructure**
1. Update `src/middleware/index.ts` with authentication logic
2. Create `src/lib/auth/cookies.ts` utility
3. Update `src/env.d.ts` with User type in Locals
4. Create `src/lib/schemas/auth.schema.ts` with validation schemas

**Phase 2: Service Layer**
1. Create `src/services/auth.service.ts`
2. Update `src/services/project.service.ts` to use `auth.uid()` from context
3. Update `src/services/note.service.ts` (if exists)
4. Update `src/services/plan.service.ts` (if exists)

**Phase 3: API Endpoints**
1. Create authentication endpoints in `src/pages/api/auth/` (login, logout)
2. Update existing API endpoints to use `context.locals.user`
3. Remove `DEFAULT_USER_ID` usage from all endpoints

**Phase 4: UI Components**
1. Create `src/layouts/AuthLayout.astro`
2. Update `src/layouts/Layout.astro` with navigation and user menu
3. Create `src/components/auth/LoginForm.tsx`
4. Create `src/components/UserMenu.tsx`
5. Create `src/components/LandingPage.astro`

**Phase 5: Pages**
1. Create login page: `src/pages/auth/login.astro`
2. Update `src/pages/index.astro` with landing page
3. Update existing pages (no changes needed, middleware handles protection)

**Phase 6: User Creation**
1. Create test users manually in Supabase Dashboard for development
2. Document user creation process for system administrators

**Phase 7: Testing**
1. Manual testing of login and logout flows
2. Test protected route access
3. Test session persistence
4. Test edge cases (expired tokens, rate limiting, etc.)

### 4.3 Rollback Plan

If issues arise during deployment:

1. **Database Rollback:**
   ```bash
   supabase migration down
   ```

2. **Code Rollback:**
   - Revert to previous git commit
   - Re-deploy previous version

3. **Temporary Fixes:**
   - Disable route protection in middleware (allow public access)
   - Add feature flag to toggle authentication on/off

### 4.4 Deployment Checklist

**Pre-Deployment:**
- [ ] All migrations tested in development
- [ ] Login and logout endpoints tested manually
- [ ] Login form tested in different browsers
- [ ] Test users created in Supabase Dashboard
- [ ] Environment variables set in production

**Deployment:**
- [ ] Run database migrations
- [ ] Deploy code to production
- [ ] Verify deployment health
- [ ] Test login and logout flows

**Post-Deployment:**
- [ ] Monitor error logs
- [ ] Monitor Supabase dashboard for auth events
- [ ] Test login and logout from different devices/browsers
- [ ] Verify rate limiting is working
- [ ] Create production user accounts for actual users

---

## 5. FUTURE ENHANCEMENTS

While not part of the MVP, these enhancements can be considered for future iterations:

### 5.1 User Registration

Add self-service user registration:
- Registration form with email and password
- Immediate account creation and login
- Email validation

**Benefits:**
- Users can create their own accounts
- Reduced administrative burden
- Faster onboarding

**Implementation:**
- Add registration page and form
- Create registration API endpoint
- Update landing page with registration link

### 5.2 User Profile Management

Add user profile page:
- View account information
- Update email address
- Change password
- Delete account option

**Benefits:**
- Users can manage their own accounts
- Self-service password changes
- Better user control

**Implementation:**
- Create profile page
- Add change password endpoint
- Add update email endpoint

### 5.3 Travel Preferences

Add user travel preferences (US-005):
- Save preferred travel categories
- Use preferences in AI trip planning
- Customize recommendations

**Benefits:**
- Personalized trip suggestions
- Better AI-generated itineraries
- Improved user experience

**Implementation:**
- Create user_preferences table
- Add preferences API endpoints
- Update profile page with preferences section
- Integrate preferences into AI service

### 5.4 Password Recovery

Add "Forgot Password" functionality:
- Email-based password reset with magic links
- Security questions as alternative
- SMS-based verification

**Benefits:**
- Users can recover forgotten passwords
- Reduced support burden
- Improved user experience

**Implementation:**
- Add forgot password page
- Implement email verification flow
- Add reset password endpoint
- Configure Supabase email templates

### 5.5 Email Verification

Add email verification for new registrations:
- Verify email before full account activation
- Resend verification link option
- Handle expired verification tokens

**Benefits:**
- Reduce spam accounts
- Ensure valid contact information
- Improved security

**Implementation:**
- Enable email confirmation in Supabase
- Add verification callback page
- Add resend verification endpoint
- Configure confirmation email template

### 5.6 OAuth Providers

Add social login options:
- Google OAuth
- GitHub OAuth
- Apple Sign In

**Benefits:**
- Faster registration
- No password to remember
- Trusted identity providers

**Implementation:**
- Supabase Auth supports OAuth out of the box
- Add provider buttons to login/register pages
- Configure OAuth apps in respective platforms

### 5.7 Multi-Factor Authentication (MFA)

Add optional 2FA for enhanced security:
- TOTP (Time-based One-Time Password)
- SMS verification
- Email verification codes

**Benefits:**
- Enhanced account security
- Protection against credential theft

**Implementation:**
- Supabase supports TOTP MFA
- Add MFA settings to profile page

### 5.8 Session Management UI

Allow users to view and manage active sessions:
- List of active sessions (device, location, last active)
- Revoke individual sessions
- "Logout all devices" option

**Benefits:**
- User control over security
- Detect unauthorized access

### 5.9 Email Change Flow

Allow users to change their email address:
- Request email change
- Verify new email
- Verify old email (for security)
- Update email after both verifications

**Benefits:**
- Users can update outdated email addresses
- Account recovery if email compromised

### 5.10 Account Deletion

Allow users to delete their accounts:
- "Delete Account" option in profile
- Confirmation dialog with password verification
- Grace period (e.g., 30 days) before permanent deletion
- Export data option before deletion

**Benefits:**
- GDPR compliance
- User data ownership

### 5.11 Remember Me

Add "Remember Me" checkbox on login:
- Extended refresh token expiration (30 days instead of 7)
- Separate cookie for "remember me" flag

**Benefits:**
- Better UX for frequent users
- Fewer re-logins

---

## 6. APPENDIX

### 6.1 Type Definitions

**New Types in `src/types.ts`:**

```typescript
// Authentication DTOs
export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  user: {
    id: string;
    email: string;
  };
  message: string;
}
```

### 6.2 File Structure Summary

**New Files:**
```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── UserMenu.tsx
│   └── LandingPage.astro
├── layouts/
│   └── AuthLayout.astro (new)
├── lib/
│   ├── auth/
│   │   └── cookies.ts
│   ├── schemas/
│   │   └── auth.schema.ts
│   └── rate-limiter.ts
├── pages/
│   ├── auth/
│   │   └── login.astro
│   └── api/
│       └── auth/
│           ├── login.ts
│           └── logout.ts
├── services/
│   └── auth.service.ts
supabase/
└── migrations/
    └── 20251103_update_rls_policies.sql
```

**Modified Files:**
```
src/
├── middleware/index.ts (updated)
├── layouts/Layout.astro (updated)
├── pages/index.astro (updated)
├── env.d.ts (updated)
├── types.ts (updated)
└── db/supabase.client.ts (remove DEFAULT_USER_ID after migration)
```

### 6.3 Environment Variables

**Required Environment Variables:**

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Application URLs
PUBLIC_APP_URL=http://localhost:3000  # Development
# PUBLIC_APP_URL=https://vacationplanner.com  # Production

# Optional: Rate Limiting (if using Redis)
# REDIS_URL=redis://localhost:6379
```

### 6.4 API Endpoint Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/login` | No | Authenticate user |
| POST | `/api/auth/logout` | Yes | Logout user |

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-03 | Architecture Team | Initial specification |

---

**End of Authentication Architecture Specification**

