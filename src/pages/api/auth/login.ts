import type { APIRoute } from "astro";
import { loginSchema } from "../../../lib/schemas/auth.schema.ts";
import { handleApiError, createSuccessResponse, ApiError } from "../../../lib/api-utils.ts";
import { createSupabaseServerInstance } from "../../../db/supabase.client.ts";

export const prerender = false;

/**
 * POST /api/auth/login
 * 
 * Authenticate user with email and password
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Success Response (200):
 * {
 *   "user": {
 *     "id": "uuid",
 *     "email": "user@example.com"
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error (invalid email format, missing fields)
 * - 401: Invalid credentials
 * - 500: Server error
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input with Zod schema
    const validatedData = loginSchema.parse(body);

    // Create Supabase server instance with cookie handling
    const supabase = createSupabaseServerInstance({
      headers: request.headers,
      cookies,
    });

    // Attempt to sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    // Handle authentication errors
    if (error) {
      console.error("Login error:", error);

      // Map Supabase errors to appropriate HTTP status codes
      if (error.message.includes("Invalid login credentials")) {
        throw new ApiError(401, "Invalid credentials. Please try again.");
      }

      if (error.message.includes("Email not confirmed")) {
        throw new ApiError(401, "Please confirm your email before logging in.");
      }

      // Generic authentication error
      throw new ApiError(401, "Authentication failed. Please check your credentials.");
    }

    // Check if user data exists
    if (!data.user) {
      throw new ApiError(401, "Authentication failed. Please try again.");
    }

    // Return success response with user data
    return createSuccessResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
};

