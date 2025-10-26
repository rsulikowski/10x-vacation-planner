import type { APIRoute } from "astro";
import { generatePlanCommandSchema, projectIdParamSchema } from "../../../../lib/schemas/plan.schema";
import { planService } from "../../../../services/plan.service";
import { createSuccessResponse, createErrorResponse, ApiError } from "../../../../lib/api-utils";
import { DEFAULT_USER_ID } from "../../../../db/supabase.client";
import { aiService } from "../../../../services/ai.service.mock";
import { z } from "zod";
import type { Json } from "../../../../db/database.types";

/**
 * POST /api/projects/{projectId}/plan
 *
 * Endpoint do synchronicznego generowania planu podróży dla projektu.
 *
 * Request Body:
 * {
 *   "model": "gpt-5",
 *   "notes": [{ "id": "uuid", "content": "string", "priority": 1, "place_tags": ["string"] }],
 *   "preferences": { "categories": ["string"] }  // opcjonalne
 * }
 *
 * Response 200:
 * {
 *   "schedule": [{ "day": 1, "activities": ["..."] }]
 * }
 *
 * Error Codes:
 * - 400: Invalid input data validation
 * - 404: Project does not exist or does not belong to user
 * - 500: Server error or AI service error
 *
 * UWAGA: Autoryzacja JWT zostanie zaimplementowana później.
 * Obecnie używany jest DEFAULT_USER_ID z konfiguracji Supabase.
 */
export const POST: APIRoute = async (context) => {
  const startTime = Date.now();
  let logId: string | null = null;
  let prompt = "";
  let requestBody: unknown = null;
  let responseCode = 500; // Default to server error

  try {
    // Capture raw request body first for logging (even if invalid JSON)
    const rawBody = await context.request.text();
    try {
      requestBody = JSON.parse(rawBody);
    } catch {
      requestBody = { raw: rawBody }; // Store invalid JSON as raw text
      responseCode = 400;
      throw new Error("Invalid JSON format in request body");
    }

    // Krok 1: Validate URL params and request body
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const command = generatePlanCommandSchema.parse(requestBody);

    // Prepare prompt and create pending log
    prompt = aiService.generatePrompt(command);
    const { data: pendingData, error: pendingError } = await context.locals.supabase
      .from("ai_logs")
      .insert({
        project_id: projectId,
        user_id: DEFAULT_USER_ID,
        prompt,
        request_body: requestBody as Json,
        response: {},
        response_code: null,
        status: "pending",
        duration_ms: null,
      })
      .select("id")
      .single();
    if (pendingError || !pendingData) {
      console.error("Error creating AI log entry:", pendingError);
    } else {
      logId = pendingData.id;
    }

    // Call service and return result
    const result = await planService.generatePlan(projectId, command, context.locals.supabase);
    const duration = Date.now() - startTime;
    responseCode = 200;

    if (logId) {
      await context.locals.supabase
        .from("ai_logs")
        .update({ status: "success", response: result, response_code: responseCode, duration_ms: duration })
        .eq("id", logId);
    }
    return createSuccessResponse(result, 200);
  } catch (error) {
    // Determine response code based on error type
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : String(error);
    let details: unknown = undefined;

    // Determine appropriate response code if not already set
    if (responseCode === 500) {
      if (error instanceof ApiError) {
        responseCode = error.statusCode;
        details = error.details;
      } else if (error instanceof z.ZodError) {
        responseCode = 400;
        details = error.errors;
      } else if (message.includes("Invalid JSON")) {
        responseCode = 400;
      }
    }

    // Update or insert failure log
    if (logId) {
      await context.locals.supabase
        .from("ai_logs")
        .update({ status: "failure", response: { error: message }, response_code: responseCode, duration_ms: duration })
        .eq("id", logId);
    } else {
      await context.locals.supabase.from("ai_logs").insert({
        project_id: context.params.projectId!,
        user_id: DEFAULT_USER_ID,
        prompt,
        request_body: requestBody as Json,
        response: { error: message },
        response_code: responseCode,
        status: "failure",
        duration_ms: duration,
      });
    }

    // Return error response with the same status code logged to database
    const errorType = responseCode === 400 ? "Validation Error" : responseCode === 404 ? "Not Found" : "Server Error";
    return createErrorResponse(responseCode, errorType, message, details);
  }
};
