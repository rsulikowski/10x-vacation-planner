# GROQ Service Implementation Plan

This document outlines the design and implementation plan for the `GROQService`, which interfaces with the GROQ API to perform LLM-based chat operations with structured JSON response validation.

## 1. Service Description

The `GROQService` provides methods to construct and send chat requests to the GROQ API, handling message formatting, authentication, error handling, and response validation against a JSON schema.

Key responsibilities:

- Build request payloads with system and user messages
- Configure model name and parameters
- Manage API key and authentication headers
- Send HTTP requests and parse responses
- Validate structured JSON responses
- Log requests and errors

## 2. Constructor Description

```typescript
constructor(config: {
  apiKey: string;
  baseUrl?: string;        // default: "https://api.groq.com/v1/llm"
  defaultModel?: string;    // e.g., "groq-llm-s2"
  defaultParams?: Record<string, unknown>;  // e.g., { temperature: 0.8, max_tokens: 1500 }
})
```

- **apiKey**: Required. Used for Bearer authentication in `Authorization` header.
- **baseUrl**: Optional. Base URL for GROQ inference endpoint.
- **defaultModel**: Optional. Default model name for chat requests.
- **defaultParams**: Optional. Default parameters for model invocation.

## 3. Public Methods and Fields

### Methods

- `sendChat(request: ChatRequest): Promise<ChatResponse>`
  - Constructs payload, sends request, validates and returns structured response.
- `setApiKey(key: string): void`
  - Update the API key at runtime.
- `setDefaultModel(modelName: string): void`
  - Override the default model.
- `setDefaultParams(params: Record<string, unknown>): void`
  - Override the default parameters.

### Fields

- `apiKey: string`
- `baseUrl: string`
- `defaultModel: string`
- `defaultParams: Record<string, unknown>`

## 4. Private Methods and Fields

- `_buildPayload(request: ChatRequest): GroqPayload`
  - Assembles the request body with:
    - `model`: Model name
    - `messages`: Array of `{ role, content }` objects
    - `parameters`: Merged default and per-request parameters
    - `response_format`: JSON schema format object
- `_validateResponse(raw: unknown, schema: JSONSchema): ChatResponse`
  - Uses AJV or similar library to validate JSON against the provided schema.
- `_request(payload: GroqPayload): Promise<unknown>`
  - Sends HTTP POST with headers:
    - `Authorization: Bearer ${apiKey}`
    - `Content-Type: application/json`
- `_handleError(error: unknown): never`
  - Normalizes errors into custom types.

## 5. Error Handling

Potential error scenarios:

1. Network failures or timeouts
2. HTTP 401 Unauthorized (invalid API key)
3. HTTP 429 Rate limiting
4. HTTP 4xx client errors
5. HTTP 5xx server errors
6. Invalid JSON payload in response
7. Schema validation failures

Approach:

- Define custom error classes: `NetworkError`, `AuthenticationError`, `RateLimitError`, `ValidationError`, `ApiError`.
- Implement retry logic with exponential backoff for transient errors (5xx, network timeouts).
- Surface user-friendly messages and log detailed diagnostics.

## 6. Security Considerations

- Store `apiKey` securely, do not log sensitive values.
- Enforce HTTPS for all requests.
- Validate and sanitize all input parameters.
- Use environment variables for secret management.
- Throttle or guard against excessive request rates.

## 7. Step-by-Step Implementation Plan

1. **Define Types and Interfaces** (`src/services/groq.types.ts`):
   - `ChatRequest`, `ChatResponse`, `GroqPayload`, `ResponseFormat`, `JSONSchema`.
2. **Configure HTTP Client** (`src/lib/http-client.ts` or reuse existing utility):
   - Set base URL, default headers, timeouts, and an interceptor for the `Authorization` header.
3. **Implement `GROQService` Class** (`src/services/groq.service.ts`):
   - Add constructor and assign configuration.
   - Implement `_request`:
     ```typescript
     const response = await fetch(`${this.baseUrl}/chat/completions`, {
       method: "POST",
       headers: {
         Authorization: `Bearer ${this.apiKey}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify(payload),
     });
     return response.json();
     ```
   - Implement `_buildPayload` with example:
     ```json
     {
       "model": "groq-llm-s2",
       "messages": [
         { "role": "system", "content": "You are a travel planner assistant." },
         { "role": "user", "content": "Plan a 3-day trip to Paris." }
       ],
       "parameters": { "temperature": 0.8, "max_tokens": 1500 },
       "response_format": {
         "type": "json_schema",
         "json_schema": {
           "name": "ItineraryResponse",
           "strict": true,
           "schema": {
             "type": "object",
             "properties": {
               "itinerary": { "type": "array", "items": { "type": "string" } }
             },
             "required": ["itinerary"]
           }
         }
       }
     }
     ```
   - Implement `_validateResponse` using AJV.
   - Implement `sendChat` to orchestrate payload, request, and validation.
4. **Create Custom Error Classes** (`src/services/errors.ts`).
5. **Write Unit Tests** (`src/services/groq.service.spec.ts`):
   - Mock HTTP client, test successful payloads and error scenarios.
6. **Integration Testing**:
   - Test against a sandbox or mock GROQ endpoint with sample schema.
7. **Documentation**:
   - Update README with `GROQService` usage examples and configuration details.

---

This plan follows TypeScript 5 standards, integrates with the existing codebase, and ensures robust error handling, schema validation, and secure configuration.
