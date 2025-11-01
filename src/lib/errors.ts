/**
 * Custom Error Classes for Service Layer
 *
 * This file contains custom error classes for handling various
 * error scenarios across the application services.
 */

/**
 * Base error class for all service errors
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Network-related errors (timeouts, connection failures)
 */
export class NetworkError extends ServiceError {
  constructor(message: string, details?: unknown) {
    super(message, "NETWORK_ERROR", undefined, details);
  }
}

/**
 * Authentication and authorization errors (401, 403)
 */
export class AuthenticationError extends ServiceError {
  constructor(message: string, statusCode = 401, details?: unknown) {
    super(message, "AUTHENTICATION_ERROR", statusCode, details);
  }
}

/**
 * Rate limiting errors (429)
 */
export class RateLimitError extends ServiceError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    details?: unknown
  ) {
    super(message, "RATE_LIMIT_ERROR", 429, details);
  }
}

/**
 * Validation errors (schema validation, input validation)
 */
export class ValidationError extends ServiceError {
  constructor(
    message: string,
    public readonly validationErrors?: unknown[],
    details?: unknown
  ) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

/**
 * Generic API errors (4xx, 5xx)
 */
export class ApiError extends ServiceError {
  constructor(
    message: string,
    statusCode: number,
    public readonly responseBody?: unknown,
    details?: unknown
  ) {
    super(message, "API_ERROR", statusCode, details);
  }
}

/**
 * Configuration errors (missing required config, invalid config)
 */
export class ConfigurationError extends ServiceError {
  constructor(message: string, details?: unknown) {
    super(message, "CONFIGURATION_ERROR", undefined, details);
  }
}

/**
 * Timeout errors for long-running operations
 */
export class TimeoutError extends ServiceError {
  constructor(
    message: string,
    public readonly timeoutMs: number,
    details?: unknown
  ) {
    super(message, "TIMEOUT_ERROR", undefined, details);
  }
}

/**
 * Error handler utility to determine if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof TimeoutError) return true;
  if (error instanceof RateLimitError) return true;
  if (error instanceof ApiError && error.statusCode && error.statusCode >= 500) {
    return true;
  }
  return false;
}

/**
 * Extract retry-after value from error
 */
export function getRetryAfter(error: unknown): number | undefined {
  if (error instanceof RateLimitError) {
    return error.retryAfter;
  }
  return undefined;
}
