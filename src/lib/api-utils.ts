import type { APIContext } from 'astro';
import { z } from 'zod';

/**
 * Standardowa struktura odpowiedzi błędu API
 */
export type ApiErrorResponse = {
  error: string;
  message: string;
  details?: unknown;
};

/**
 * Klasa reprezentująca błąd API z odpowiednim kodem statusu
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Tworzy odpowiedź JSON z błędem
 */
export function createErrorResponse(statusCode: number, error: string, message: string, details?: unknown): Response {
  const body: ApiErrorResponse = { error, message, details };
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Tworzy odpowiedź JSON z sukcesem
 */
export function createSuccessResponse<T>(data: T, statusCode = 200): Response {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Obsługuje błędy Zod i tworzy odpowiednią odpowiedź API
 */
export function handleZodError(error: z.ZodError): Response {
  return createErrorResponse(400, 'Validation Error', 'Nieprawidłowe dane wejściowe', error.errors);
}

/**
 * Główna funkcja obsługi błędów API
 */
export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return createErrorResponse(error.statusCode, 'API Error', error.message, error.details);
  }

  if (error instanceof z.ZodError) {
    return handleZodError(error);
  }

  // Nieoczekiwany błąd serwera
  return createErrorResponse(500, 'Internal Server Error', 'Wystąpił nieoczekiwany błąd serwera');
}

/**
 * Pobiera i weryfikuje token JWT z nagłówka Authorization
 */
export function getAuthToken(context: APIContext): string {
  const authHeader = context.request.headers.get('Authorization');

  if (!authHeader) {
    throw new ApiError(401, 'Brak tokenu autoryzacyjnego');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new ApiError(401, 'Nieprawidłowy format tokenu autoryzacyjnego');
  }

  return parts[1];
}

/**
 * Weryfikuje użytkownika i zwraca user_id
 */
export async function verifyUser(context: APIContext): Promise<string> {
  const token = getAuthToken(context);
  const supabase = context.locals.supabase;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new ApiError(401, 'Nieważny lub wygasły token autoryzacyjny');
  }

  return user.id;
}

