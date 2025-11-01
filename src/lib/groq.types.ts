/**
 * GROQ Service Type Definitions
 *
 * This file contains all type definitions for the GROQ service,
 * including request/response types, payloads, and JSON schema definitions.
 */

/**
 * JSON Schema definition for structured response validation
 */
export interface JSONSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: unknown;
  [key: string]: unknown;
}

/**
 * Response format configuration for GROQ API
 */
export interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: JSONSchema;
  };
}

/**
 * Message role types for chat conversations
 */
export type MessageRole = "system" | "user" | "assistant";

/**
 * Individual chat message
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/**
 * Request object for chat completion
 */
export interface ChatRequest {
  systemMessage?: string;
  userMessage: string;
  messages?: ChatMessage[];
  model?: string;
  parameters?: Record<string, unknown>;
  responseSchema: JSONSchema;
  schemaName?: string;
}

/**
 * Response object from chat completion
 */
export interface ChatResponse<T = unknown> {
  data: T;
  raw: unknown;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * Internal payload structure for GROQ API requests
 */
export interface GroqPayload {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string | string[];
  response_format: ResponseFormat;
  [key: string]: unknown;
}

/**
 * Configuration options for GROQService
 */
export interface GroqServiceConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  defaultParams?: Record<string, unknown>;
}

/**
 * Raw API response structure from GROQ
 */
export interface GroqApiResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: {
    index?: number;
    message?: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}
