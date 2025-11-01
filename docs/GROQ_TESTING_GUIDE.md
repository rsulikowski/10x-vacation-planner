# GROQ Service Testing Guide

This guide provides instructions for testing the GROQ service implementation with your API key.

## Prerequisites

1. **GROQ API Key**: Already configured in your `.env` file as `GROQ_API_KEY`
2. **Dev Server**: Running on `http://localhost:4321`

## Environment Setup

Your `.env` file should contain:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key_here
```

## Testing Methods

### Method 1: Using the Test API Endpoint

We've created a test endpoint at `/api/test-groq` for easy testing.

#### 1. Start the dev server
```bash
npm run dev
```

#### 2. Test with cURL
```bash
# Simple test
curl -X POST http://localhost:4321/api/test-groq \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me a short joke"}'

# Custom prompt
curl -X POST http://localhost:4321/api/test-groq \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Plan a 3-day trip to Paris with top attractions"}'
```

#### 3. Test with PowerShell (Windows)
```powershell
# Simple test
Invoke-RestMethod -Uri "http://localhost:4321/api/test-groq" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"prompt": "Tell me a short joke"}'

# Custom prompt
Invoke-RestMethod -Uri "http://localhost:4321/api/test-groq" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"prompt": "Plan a 3-day trip to Paris"}'
```

#### 4. Test with a REST client (Postman, Insomnia, etc.)
- **Method**: POST
- **URL**: `http://localhost:4321/api/test-groq`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "prompt": "Tell me a short joke"
}
```

### Method 2: Create Your Own Test Endpoint

You can create custom endpoints using the GROQ service. Here's an example:

```typescript
// src/pages/api/your-endpoint.ts
import type { APIRoute } from 'astro';
import { GROQService } from '../../lib/groq.service';
import type { JSONSchema } from '../../lib/groq.types';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Initialize service
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  // Define your schema
  const schema: JSONSchema = {
    type: 'object',
    properties: {
      answer: { type: 'string' }
    },
    required: ['answer']
  };

  // Make request
  const result = await groq.sendChat({
    systemMessage: 'You are a helpful assistant.',
    userMessage: 'Your question here',
    responseSchema: schema
  });

  return new Response(JSON.stringify(result.data), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### Method 3: Create a Standalone Test Script

Create a file `test-groq.mjs` in your project root:

```javascript
// test-groq.mjs
import { GROQService } from './dist/server/chunks/groq.service.mjs';

async function testGroq() {
  const groq = new GROQService({
    apiKey: process.env.GROQ_API_KEY,
  });

  const schema = {
    type: 'object',
    properties: {
      answer: { type: 'string' }
    },
    required: ['answer']
  };

  try {
    const result = await groq.sendChat({
      systemMessage: 'You are a helpful assistant.',
      userMessage: 'Tell me a short joke',
      responseSchema: schema
    });
    
    console.log('Success:', result.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGroq();
```

Then run:
```bash
# First build the project
npm run build

# Then run the test
node test-groq.mjs
```

## Expected Response Format

Successful response:
```json
{
  "success": true,
  "data": {
    "response": "The AI's response to your prompt",
    "confidence": 0.95,
    "metadata": {
      "timestamp": "2025-11-01T12:00:00Z",
      "model": "gpt-4"
    }
  },
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 120,
    "total_tokens": 165
  },
  "message": "GROQ service test successful"
}
```

Error response:
```json
{
  "success": false,
  "error": "Error description",
  "details": {
    "name": "ValidationError",
    "message": "Response does not match expected schema"
  }
}
```

## Troubleshooting

### 401 Authentication Error
- Verify your `GROQ_API_KEY` is correctly set in `.env`
- Ensure the API key is valid and active
- Restart the dev server after changing environment variables

### 429 Rate Limit Error
- Wait a few moments before retrying
- The service will automatically retry with exponential backoff
- Check your GROQ account for rate limits

### Timeout Error
- Increase timeout: `groq.setTimeoutMs(60000)` for 60 seconds
- Check your network connection
- Try a simpler prompt

### Validation Error
- Ensure your JSON schema matches the expected response structure
- Check that all required fields are properly defined
- Verify the AI can generate responses in the requested format

## Integration Example: Using in Your App

Here's how to integrate GROQ service into your vacation planner:

```typescript
// src/services/ai.service.ts
import { GROQService } from '../lib/groq.service';
import type { JSONSchema } from '../lib/groq.types';

const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  defaultModel: 'llama-3.3-70b-versatile',
  defaultParams: {
    temperature: 0.7,
    max_tokens: 2000
  }
});

export async function generateItinerary(notes: string[], dates: string[]) {
  const schema: JSONSchema = {
    type: 'object',
    properties: {
      itinerary: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            activities: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['date', 'activities']
        }
      }
    },
    required: ['itinerary']
  };

  const result = await groq.sendChat({
    systemMessage: 'You are a travel planning assistant.',
    userMessage: `Create a detailed itinerary based on these notes: ${notes.join(', ')}`,
    responseSchema: schema,
    schemaName: 'TripItinerary'
  });

  return result.data;
}
```

## Available Models

Common GROQ-compatible models:
- `llama-3.3-70b-versatile` - Good balance of speed and quality
- `gpt-4` - High quality responses (if available)
- `gpt-3.5-turbo` - Faster, good for simpler tasks

Change the model:
```typescript
groq.setDefaultModel('llama-3.3-70b-versatile');
```

## Advanced Configuration

```typescript
const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  baseUrl: 'https://api.groq.com/openai/v1', // Custom base URL
  defaultModel: 'llama-3.3-70b-versatile',
  defaultParams: {
    temperature: 0.8,      // Creativity (0-1)
    max_tokens: 1500,      // Response length
    top_p: 0.9,            // Nucleus sampling
  }
});

// Update settings at runtime
groq.setTimeoutMs(60000);  // 60 second timeout
groq.setDefaultParams({ temperature: 0.5 });
```

## Next Steps

1. Test the basic endpoint to verify your API key works
2. Experiment with different prompts and schemas
3. Integrate the service into your vacation planner features
4. Monitor usage and adjust parameters for optimal results

