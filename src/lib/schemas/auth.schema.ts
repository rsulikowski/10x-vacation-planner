import { z } from "zod";

/**
 * Login validation schema
 * 
 * Validates user login credentials:
 * - Email: Must be valid email format
 * - Password: Required, minimum 1 character (backend validates with Supabase)
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

/**
 * Type inference for login data
 */
export type LoginInput = z.infer<typeof loginSchema>;

