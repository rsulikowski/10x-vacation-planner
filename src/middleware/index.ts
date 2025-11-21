import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client.ts";

/**
 * Authentication middleware
 *
 * Responsibilities:
 * 1. Create Supabase server client for each request
 * 2. Verify user session from cookies
 * 3. Attach user to context.locals if authenticated
 * 4. Redirect unauthenticated users from protected routes
 * 5. Redirect authenticated users from auth pages
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, request, url, redirect } = context;

  // Create Supabase server client with proper SSR cookie handling
  const supabase = createSupabaseServerInstance({
    headers: request.headers,
    cookies,
  });

  // Attach Supabase client to context for use in routes
  context.locals.supabase = supabase;

  // IMPORTANT: Always get user session first before any other operations
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Attach user to context if authenticated
  if (user) {
    context.locals.user = user;
  }

  // Check if current path is public
  const pathname = url.pathname;

  // Define protected routes (routes that require authentication)
  const protectedRoutes = ["/projects"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Define auth routes (login, register, etc.)
  const authRoutes = ["/auth/login"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !user) {
    return redirect(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Redirect authenticated users from auth pages to projects
  if (isAuthRoute && user) {
    return redirect("/projects");
  }

  return next();
});
