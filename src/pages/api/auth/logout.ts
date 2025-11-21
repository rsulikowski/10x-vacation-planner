import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse } from "../../../lib/api-utils.ts";
import { createSupabaseServerInstance } from "../../../db/supabase.client.ts";

export const prerender = false;

/**
 * POST /api/auth/logout
 *
 * Sign out user and clear authentication cookies
 *
 * Request Body: None (reads cookies automatically)
 *
 * Success Response (200):
 * {
 *   "message": "Logout successful"
 * }
 *
 * Error Responses:
 * - 500: Server error
 *
 * Note: This endpoint succeeds even if user is not logged in (idempotent)
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Create Supabase server instance with cookie handling
    const supabase = createSupabaseServerInstance({
      headers: request.headers,
      cookies,
    });

    // Sign out user (this invalidates the session and clears cookies)
    const { error } = await supabase.auth.signOut();

    // Log error but don't fail the request
    // Logout should be idempotent - always succeed even if session is invalid
    if (error) {
      // eslint-disable-next-line no-console
      console.warn("Logout warning (non-critical):", error);
    }

    // Return success response
    return createSuccessResponse({
      message: "Logout successful",
    });
  } catch (error) {
    return handleApiError(error);
  }
};
