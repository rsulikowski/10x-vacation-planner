/**
 * GROQ Service
 *
 * Service class for interfacing with the GROQ API to perform
 * LLM-based chat operations with structured JSON response validation.
 */

import Ajv, { type ValidateFunction } from "ajv";
import type {
  ChatRequest,
  ChatResponse,
  GroqPayload,
  GroqServiceConfig,
  GroqApiResponse,
  ChatMessage,
  ResponseFormat,
  JSONSchema,
} from "./groq.types";
import {
  NetworkError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  ApiError,
  ConfigurationError,
  TimeoutError,
  isRetryableError,
  getRetryAfter,
} from "./errors";

/**
 * Default configuration values
 */
const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "gpt-4";
const DEFAULT_PARAMS = {
  temperature: 0.8,
  max_tokens: 1500,
};
const DEFAULT_TIMEOUT_MS = 30000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

/**
 * GROQService class for managing GROQ API interactions
 */
export class GROQService {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;
  private defaultParams: Record<string, unknown>;
  private ajv: Ajv;
  private timeoutMs: number;

  /**
   * Initialize GROQ service with configuration
   */
  constructor(config: GroqServiceConfig) {
    // Validate required configuration
    if (!config.apiKey || config.apiKey.trim() === "") {
      throw new ConfigurationError("API key is required and cannot be empty");
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
    this.defaultParams = config.defaultParams || DEFAULT_PARAMS;
    this.timeoutMs = DEFAULT_TIMEOUT_MS;

    // Initialize AJV for JSON schema validation
    this.ajv = new Ajv({
      strict: false,
      validateFormats: false,
      allErrors: true,
    });
  }

  /**
   * Send a chat request and receive a structured response
   */
  async sendChat<T = unknown>(request: ChatRequest): Promise<ChatResponse<T>> {
    // Validate request
    if (!request.userMessage && (!request.messages || request.messages.length === 0)) {
      throw new ValidationError("Either userMessage or messages array must be provided");
    }

    if (!request.responseSchema) {
      throw new ValidationError("Response schema is required for structured output");
    }

    // Build payload
    const payload = this._buildPayload(request);

    // Send request with retry logic
    const rawResponse = await this._requestWithRetry(payload);

    // Validate and extract response
    const validatedResponse = this._validateResponse<T>(rawResponse, request.responseSchema);

    return validatedResponse;
  }

  /**
   * Update the API key at runtime
   */
  setApiKey(key: string): void {
    if (!key || key.trim() === "") {
      throw new ConfigurationError("API key cannot be empty");
    }
    this.apiKey = key;
  }

  /**
   * Override the default model
   */
  setDefaultModel(modelName: string): void {
    if (!modelName || modelName.trim() === "") {
      throw new ConfigurationError("Model name cannot be empty");
    }
    this.defaultModel = modelName;
  }

  /**
   * Override the default parameters
   */
  setDefaultParams(params: Record<string, unknown>): void {
    this.defaultParams = { ...params };
  }

  /**
   * Set request timeout in milliseconds
   */
  setTimeoutMs(timeoutMs: number): void {
    if (timeoutMs <= 0) {
      throw new ConfigurationError("Timeout must be greater than 0");
    }
    this.timeoutMs = timeoutMs;
  }

  /**
   * Build the request payload for GROQ API
   */
  private _buildPayload(request: ChatRequest): GroqPayload {
    // Determine which model to use
    const model = request.model || this.defaultModel;

    // Build messages array
    let messages: ChatMessage[];
    if (request.messages && request.messages.length > 0) {
      // Use provided messages array
      messages = [...request.messages];
    } else {
      // Build from systemMessage and userMessage
      messages = [];
      if (request.systemMessage) {
        messages.push({
          role: "system",
          content: request.systemMessage,
        });
      }
      messages.push({
        role: "user",
        content: request.userMessage,
      });
    }

    // Merge parameters
    const parameters = {
      ...this.defaultParams,
      ...(request.parameters || {}),
    };

    // Build response format
    const responseFormat: ResponseFormat = {
      type: "json_schema",
      json_schema: {
        name: request.schemaName || "Response",
        strict: true,
        schema: request.responseSchema,
      },
    };

    // Construct the payload
    const payload: GroqPayload = {
      model,
      messages,
      response_format: responseFormat,
      ...parameters,
    };

    return payload;
  }

  /**
   * Validate API response against the provided JSON schema
   */
  private _validateResponse<T>(raw: unknown, schema: JSONSchema): ChatResponse<T> {
    // First, validate that we received a valid API response structure
    if (!raw || typeof raw !== "object") {
      throw new ValidationError("Invalid API response: expected an object", [], raw);
    }

    const apiResponse = raw as GroqApiResponse;

    // Extract the content from the API response
    if (!apiResponse.choices || apiResponse.choices.length === 0) {
      throw new ValidationError("Invalid API response: no choices returned", [], apiResponse);
    }

    const choice = apiResponse.choices[0];
    if (!choice.message || !choice.message.content) {
      throw new ValidationError("Invalid API response: no message content", [], apiResponse);
    }

    // Parse the JSON content
    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(choice.message.content);
    } catch (error) {
      throw new ValidationError("Failed to parse response content as JSON", [], {
        content: choice.message.content,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Validate against schema
    const validate: ValidateFunction = this.ajv.compile(schema);
    const valid = validate(parsedContent);

    if (!valid) {
      throw new ValidationError("Response does not match expected schema", validate.errors || [], {
        data: parsedContent,
        errors: validate.errors,
      });
    }

    // Return validated response
    return {
      data: parsedContent as T,
      raw: apiResponse,
      usage: apiResponse.usage,
    };
  }

  /**
   * Send HTTP request to GROQ API with retry logic
   */
  private async _requestWithRetry(payload: GroqPayload, attempt = 1): Promise<unknown> {
    try {
      return await this._request(payload);
    } catch (error) {
      // Check if error is retryable and we haven't exceeded max retries
      if (attempt >= MAX_RETRIES || !isRetryableError(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const retryAfter = getRetryAfter(error);
      const delay = retryAfter ? retryAfter * 1000 : INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);

      // Wait before retrying
      await this._sleep(delay);

      // Retry the request
      return this._requestWithRetry(payload, attempt + 1);
    }
  }

  /**
   * Send HTTP POST request to GROQ API
   */
  private async _request(payload: GroqPayload): Promise<unknown> {
    const url = `${this.baseUrl}/chat/completions`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        await this._handleHttpError(response);
      }

      // Parse and return JSON response
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort (timeout) errors
      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(`Request timed out after ${this.timeoutMs}ms`, this.timeoutMs);
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new NetworkError("Network request failed", { originalError: error });
      }

      // Re-throw if it's already our custom error
      if (
        error instanceof NetworkError ||
        error instanceof AuthenticationError ||
        error instanceof RateLimitError ||
        error instanceof ValidationError ||
        error instanceof ApiError
      ) {
        throw error;
      }

      // Wrap unknown errors
      throw new NetworkError("An unexpected error occurred during the request", {
        originalError: error,
      });
    }
  }

  /**
   * Handle HTTP error responses
   */
  private async _handleHttpError(response: Response): Promise<never> {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }

    const errorMessage = this._extractErrorMessage(errorBody);

    // Handle specific status codes
    switch (response.status) {
      case 401:
      case 403:
        throw new AuthenticationError(
          errorMessage || "Authentication failed. Please check your API key.",
          response.status,
          errorBody
        );

      case 429: {
        const retryAfter = this._extractRetryAfter(response);
        throw new RateLimitError(errorMessage || "Rate limit exceeded. Please try again later.", retryAfter, errorBody);
      }

      case 400:
        throw new ValidationError(errorMessage || "Invalid request parameters", [], errorBody);

      case 404:
        throw new ApiError(errorMessage || "Resource not found", 404, errorBody);

      default:
        throw new ApiError(
          errorMessage || `API request failed with status ${response.status}`,
          response.status,
          errorBody
        );
    }
  }

  /**
   * Extract error message from error response body
   */
  private _extractErrorMessage(errorBody: unknown): string | undefined {
    if (!errorBody || typeof errorBody !== "object") {
      return undefined;
    }

    const body = errorBody as Record<string, unknown>;

    // Try common error message fields
    if (typeof body.error === "string") {
      return body.error;
    }

    if (
      body.error &&
      typeof body.error === "object" &&
      "message" in body.error &&
      typeof body.error.message === "string"
    ) {
      return body.error.message;
    }

    if (typeof body.message === "string") {
      return body.message;
    }

    return undefined;
  }

  /**
   * Extract retry-after value from response headers
   */
  private _extractRetryAfter(response: Response): number | undefined {
    const retryAfterHeader = response.headers.get("Retry-After");
    if (!retryAfterHeader) {
      return undefined;
    }

    const retryAfter = parseInt(retryAfterHeader, 10);
    return isNaN(retryAfter) ? undefined : retryAfter;
  }

  /**
   * Sleep utility for retry delays
   */
  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
