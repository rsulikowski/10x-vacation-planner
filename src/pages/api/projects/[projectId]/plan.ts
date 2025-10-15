import type { APIRoute } from 'astro';
import { generatePlanCommandSchema, projectIdParamSchema } from '../../../../lib/schemas/plan.schema';
import { planService } from '../../../../services/plan.service';
import { createSuccessResponse, handleApiError } from '../../../../lib/api-utils';

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
 * - 400: Błędna walidacja danych wejściowych
 * - 404: Projekt nie istnieje lub nie należy do użytkownika
 * - 500: Błąd serwera lub AI service
 *
 * UWAGA: Autoryzacja JWT zostanie zaimplementowana później.
 * Obecnie używany jest DEFAULT_USER_ID z konfiguracji Supabase.
 */
export const POST: APIRoute = async (context) => {
  try {
    // Krok 1: Walidacja parametru projectId z URL
    const projectId = projectIdParamSchema.parse(context.params.projectId);

    // Krok 2: Parsowanie i walidacja body żądania
    let requestBody;
    try {
      requestBody = await context.request.json();
    } catch {
      return createSuccessResponse(
        {
          error: 'Invalid JSON',
          message: 'Nieprawidłowy format JSON w body żądania',
        },
        400,
      );
    }

    const command = generatePlanCommandSchema.parse(requestBody);

    // Krok 3: Wywołanie serwisu generowania planu
    const result = await planService.generatePlan(projectId, command, context.locals.supabase);

    // Krok 4: Zwrócenie wyniku
    return createSuccessResponse(result, 200);
  } catch (error) {
    // Krok 5: Obsługa błędów
    return handleApiError(error);
  }
};

