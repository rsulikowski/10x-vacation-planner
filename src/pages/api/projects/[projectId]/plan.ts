import type { APIRoute } from "astro";
import { generatePlanCommandSchema, projectIdParamSchema } from "../../../../lib/schemas/plan.schema";
import { planService } from "../../../../services/plan.service";
import { createSuccessResponse, createErrorResponse, ApiError } from "../../../../lib/api-utils";
import { getAIService } from "../../../../services/ai.service";
import { z } from "zod";
import type { Json } from "../../../../db/database.types";

export const prerender = false;

/**
 * GET /api/projects/{projectId}/plan
 *
 * Fetches the latest successfully generated plan for a project
 */
export const GET: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      return createErrorResponse(401, "Unauthorized", "User not authenticated");
    }

    const projectId = context.params.projectId;

    if (!projectId) {
      return createErrorResponse(400, "Bad Request", "Project ID is required");
    }

    // Fetch the latest successful plan from ai_logs (most recent by created_on)
    // RLS will automatically filter by user_id
    const { data: aiLog, error } = await context.locals.supabase
      .from("ai_logs")
      .select("response, version, created_on")
      .eq("project_id", projectId)
      .eq("status", "success")
      .order("created_on", { ascending: false })
      .limit(1)
      .single();

    if (error || !aiLog) {
      return createErrorResponse(404, "Not Found", "No plan found for this project");
    }

    // Extract schedule from response
    const response = aiLog.response as { schedule?: unknown };

    return createSuccessResponse(
      {
        schedule: response.schedule || [],
        version: aiLog.version,
        createdOn: aiLog.created_on,
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(500, "Server Error", message);
  }
};

/**
 * POST /api/projects/{projectId}/plan
 *
 * Endpoint do synchronicznego generowania planu podróży dla projektu.
 *
 * Request Body:
 * {
 *   "model": "gpt-4o-mini",  // User-facing model name (mapped to GROQ model internally)
 *   "project_name": "Summer Trip to Paris",  // Name of the travel project
 *   "duration_days": 5,                      // Number of days for the itinerary
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
 * - 401: User not authenticated
 * - 404: Project does not exist or does not belong to user
 * - 500: Server error or AI service error
 */
export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return createErrorResponse(401, "Unauthorized", "User not authenticated");
  }

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
    const aiService = getAIService();
    prompt = aiService.generatePrompt(command);
    const { data: pendingData, error: pendingError } = await context.locals.supabase
      .from("ai_logs")
      .insert({
        project_id: projectId,
        user_id: user.id,
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
      // eslint-disable-next-line no-console
      console.error("Error creating AI log entry:", pendingError);
    } else {
      logId = pendingData.id;
    }

    // Call service and return result
    const { plan } = await planService.generatePlan(projectId, user.id, command, context.locals.supabase);
    const duration = Date.now() - startTime;
    responseCode = 200;

    if (logId) {
      await context.locals.supabase
        .from("ai_logs")
        .update({
          status: "success",
          response: plan as unknown as Json,
          response_code: responseCode,
          duration_ms: duration,
        })
        .eq("id", logId);
    }
    return createSuccessResponse(plan, 200);
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
      const user = context.locals.user;
      if (user && context.params.projectId) {
        await context.locals.supabase.from("ai_logs").insert({
          project_id: context.params.projectId,
          user_id: user.id,
          prompt,
          request_body: requestBody as Json,
          response: { error: message },
          response_code: responseCode,
          status: "failure",
          duration_ms: duration,
        });
      }
    }

    // Return error response with the same status code logged to database
    const errorType = responseCode === 400 ? "Validation Error" : responseCode === 404 ? "Not Found" : "Server Error";
    return createErrorResponse(responseCode, errorType, message, details);
  }
};
