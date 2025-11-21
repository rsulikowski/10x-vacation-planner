# GROQ Service Implementation - Quick Start

## ✅ Implementation Complete

The GROQ service has been successfully implemented with full TypeScript support, comprehensive error handling, and automatic retry logic with exponential backoff.

## 📁 Files Created

### Core Service Files

- `src/lib/groq.types.ts` - TypeScript type definitions
- `src/lib/errors.ts` - Custom error classes
- `src/lib/groq.service.ts` - Main GROQ service implementation

### Testing & Documentation

- `src/pages/api/test-groq.ts` - API endpoint for testing
- `src/pages/test/groq.astro` - Visual test interface
- `docs/GROQ_TESTING_GUIDE.md` - Complete testing guide
- `docs/GROQ_USAGE_EXAMPLES.md` - Practical usage examples

## 🚀 Quick Start Guide

### 1. Environment Setup

Your `.env` file should already have:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Start Dev Server

```bash
npm run dev
```

### 3. Test the Service

#### Option A: Visual Interface (Easiest)

Open your browser and navigate to:

```
http://localhost:4321/test/groq
```

Click "Test GROQ Service" or try the quick prompt buttons!

#### Option B: API Endpoint

```bash
# PowerShell (Windows)
Invoke-RestMethod -Uri "http://localhost:4321/api/test-groq" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"prompt": "Tell me a short joke"}'

# cURL (Linux/Mac)
curl -X POST http://localhost:4321/api/test-groq \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me a short joke"}'
```

## 📖 Usage in Your Code

### Basic Example

```typescript
import { GROQService } from "./lib/groq.service";

const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
});

const schema = {
  type: "object",
  properties: {
    answer: { type: "string" },
  },
  required: ["answer"],
};

const result = await groq.sendChat({
  userMessage: "What is the capital of France?",
  responseSchema: schema,
});

console.log(result.data.answer); // "Paris"
```

### Vacation Planner Example

```typescript
import { GROQService } from "./lib/groq.service";

const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  defaultModel: "llama-3.3-70b-versatile",
});

const schema = {
  type: "object",
  properties: {
    itinerary: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          activities: { type: "array", items: { type: "string" } },
        },
        required: ["day", "activities"],
      },
    },
  },
  required: ["itinerary"],
};

const result = await groq.sendChat({
  systemMessage: "You are a travel planning assistant.",
  userMessage: "Create a 3-day itinerary for Paris",
  responseSchema: schema,
  schemaName: "TripItinerary",
});
```

## 🎯 Key Features

✅ **Type-Safe**: Full TypeScript support with generics  
✅ **Error Handling**: Custom error classes for different scenarios  
✅ **Auto Retry**: Exponential backoff for transient errors  
✅ **Schema Validation**: AJV-powered JSON schema validation  
✅ **Timeout Control**: Configurable request timeouts  
✅ **Flexible API**: Support for simple and complex chat formats

## 🔧 Configuration

```typescript
const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  baseUrl: "https://api.groq.com/openai/v1", // Optional
  defaultModel: "llama-3.3-70b-versatile", // Optional
  defaultParams: {
    // Optional
    temperature: 0.7,
    max_tokens: 2000,
  },
});

// Update at runtime
groq.setTimeoutMs(60000); // 60 seconds
groq.setDefaultModel("gpt-4");
groq.setDefaultParams({ temperature: 0.5 });
```

## 📚 Documentation

For detailed information:

- **Testing Guide**: `docs/GROQ_TESTING_GUIDE.md`
- **Usage Examples**: `docs/GROQ_USAGE_EXAMPLES.md`
- **Test Interface**: http://localhost:4321/test/groq

## 🐛 Troubleshooting

### 401 Authentication Error

- Check that `GROQ_API_KEY` is set in `.env`
- Restart dev server after changing environment variables

### 429 Rate Limit

- Service automatically retries with backoff
- Check your GROQ account for rate limits

### Validation Error

- Ensure JSON schema matches expected response
- Check schema examples in `docs/GROQ_USAGE_EXAMPLES.md`

### Network/Timeout Error

- Increase timeout: `groq.setTimeoutMs(60000)`
- Check network connection

## 🎓 Next Steps

1. ✅ Test the service using the visual interface
2. Review the usage examples for your specific use case
3. Integrate into your vacation planner features
4. Monitor token usage via `result.usage` property

## 📦 Dependencies

The following package was installed:

- `ajv` - JSON schema validation

## 🔒 Security Notes

- API key is stored securely in `.env` (gitignored)
- All requests use HTTPS
- API key is never logged or exposed
- Input validation prevents injection attacks

---

**Ready to test?** Visit http://localhost:4321/test/groq after starting your dev server!
