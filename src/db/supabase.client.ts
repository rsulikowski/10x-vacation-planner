import type { AstroCookies } from "astro";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import type { Database } from "./database.types.ts";

// Export SupabaseClient type for use in other files
export type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie configuration for Supabase Auth
 * These settings ensure secure, HTTP-only cookie-based authentication
 */
export const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

/**
 * Parse cookie header string into array of cookie objects
 * Required by Supabase SSR getAll() implementation
 */
function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  return cookieHeader.split(";").map((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

/**
 * Create Supabase Server Client for SSR
 * 
 * CRITICAL: This client uses the @supabase/ssr pattern with:
 * - getAll() and setAll() for cookie management (NEVER use get/set/remove individually)
 * - Server-side authentication with proper cookie handling
 * 
 * Usage:
 *   In middleware: const supabase = createSupabaseServerInstance({ headers, cookies })
 *   In API routes: const supabase = createSupabaseServerInstance({ headers: request.headers, cookies })
 *   In Astro pages: const supabase = createSupabaseServerInstance({ headers: Astro.request.headers, cookies: Astro.cookies })
 * 
 * @param context - Object containing headers and cookies from Astro context
 * @returns Configured Supabase client for server-side operations
 */
export const createSupabaseServerInstance = (context: {
  headers: Headers;
  cookies: AstroCookies;
}) => {
  const supabase = createServerClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return parseCookieHeader(context.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            context.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return supabase;
};
