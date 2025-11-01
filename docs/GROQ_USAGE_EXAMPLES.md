# GROQ Service Usage Examples

This document provides practical examples of using the GROQ service in different scenarios.

## Basic Usage

### Simple Question-Answer

```typescript
import { GROQService } from '../lib/groq.service';
import type { JSONSchema } from '../lib/groq.types';

const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
});

const schema: JSONSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' }
  },
  required: ['answer']
};

const result = await groq.sendChat({
  userMessage: 'What is the capital of France?',
  responseSchema: schema
});

console.log(result.data.answer); // "Paris"
```

### With System Message

```typescript
const result = await groq.sendChat({
  systemMessage: 'You are a travel expert specializing in European destinations.',
  userMessage: 'Recommend 3 must-visit places in Paris',
  responseSchema: {
    type: 'object',
    properties: {
      recommendations: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['recommendations']
  }
});
```

## Vacation Planner Use Cases

### 1. Generate Trip Itinerary

```typescript
import { GROQService } from '../lib/groq.service';

export async function generateItinerary(
  destination: string,
  days: number,
  notes: string[]
) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      days: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            day: { type: 'number' },
            date: { type: 'string' },
            activities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string' },
                  activity: { type: 'string' },
                  location: { type: 'string' },
                  duration: { type: 'string' },
                  notes: { type: 'string' }
                },
                required: ['time', 'activity', 'location']
              }
            }
          },
          required: ['day', 'activities']
        }
      }
    },
    required: ['title', 'days']
  };

  const result = await groq.sendChat({
    systemMessage: `You are an expert travel planner. Create detailed, realistic itineraries 
                   based on user preferences. Consider travel time between locations, 
                   opening hours, and logical daily flow.`,
    userMessage: `Create a ${days}-day itinerary for ${destination}. 
                 User notes: ${notes.join('; ')}`,
    responseSchema: schema,
    schemaName: 'TripItinerary'
  });

  return result.data;
}
```

### 2. Categorize Travel Notes

```typescript
export async function categorizeNote(noteText: string) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  const schema = {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['attraction', 'restaurant', 'hotel', 'activity', 'transport', 'general']
      },
      subcategory: { type: 'string' },
      priority: {
        type: 'string',
        enum: ['high', 'medium', 'low']
      },
      tags: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['category', 'priority', 'tags']
  };

  const result = await groq.sendChat({
    systemMessage: 'Analyze travel notes and categorize them accurately.',
    userMessage: `Categorize this travel note: "${noteText}"`,
    responseSchema: schema,
    schemaName: 'NoteCategory'
  });

  return result.data;
}
```

### 3. Suggest Attractions Based on Preferences

```typescript
export async function suggestAttractions(
  destination: string,
  preferences: string[]
) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
    defaultParams: {
      temperature: 0.7, // More creative suggestions
    }
  });

  const schema = {
    type: 'object',
    properties: {
      suggestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            matchReason: { type: 'string' },
            estimatedTime: { type: 'string' },
            bestTimeToVisit: { type: 'string' },
            costLevel: {
              type: 'string',
              enum: ['free', 'low', 'medium', 'high']
            }
          },
          required: ['name', 'description', 'matchReason']
        }
      }
    },
    required: ['suggestions']
  };

  const result = await groq.sendChat({
    systemMessage: 'You are a local travel expert who knows hidden gems.',
    userMessage: `Suggest 5 attractions in ${destination} for someone interested in: ${preferences.join(', ')}`,
    responseSchema: schema,
    schemaName: 'AttractionSuggestions',
    parameters: {
      max_tokens: 2000 // Override for longer responses
    }
  });

  return result.data.suggestions;
}
```

### 4. Optimize Daily Schedule

```typescript
export async function optimizeSchedule(activities: Activity[], travelDate: string) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  const schema = {
    type: 'object',
    properties: {
      optimizedSchedule: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            startTime: { type: 'string' },
            endTime: { type: 'string' },
            activity: { type: 'string' },
            location: { type: 'string' },
            travelTimeFromPrevious: { type: 'string' },
            reasoning: { type: 'string' }
          },
          required: ['startTime', 'endTime', 'activity', 'location']
        }
      },
      tips: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['optimizedSchedule']
  };

  const activitiesText = activities.map(a => 
    `${a.name} (priority: ${a.priority}, duration: ${a.estimatedDuration})`
  ).join('; ');

  const result = await groq.sendChat({
    systemMessage: `You are a travel optimizer. Arrange activities logically considering:
                   - Geographic proximity to minimize travel time
                   - Priority levels (high priority activities first)
                   - Realistic timing (avoid overloading a single day)
                   - Meal times and rest periods`,
    userMessage: `Optimize this schedule for ${travelDate}: ${activitiesText}`,
    responseSchema: schema,
    schemaName: 'OptimizedSchedule'
  });

  return result.data;
}
```

## Advanced Patterns

### Multi-Turn Conversation

```typescript
import type { ChatMessage } from '../lib/groq.types';

export class TravelPlannerConversation {
  private messages: ChatMessage[] = [];
  private groq: GROQService;

  constructor() {
    this.groq = new GROQService({
      apiKey: import.meta.env.GROQ_API_KEY,
    });

    // Add initial system message
    this.messages.push({
      role: 'system',
      content: 'You are a helpful travel planning assistant.'
    });
  }

  async ask(question: string) {
    // Add user message
    this.messages.push({
      role: 'user',
      content: question
    });

    const schema = {
      type: 'object',
      properties: {
        response: { type: 'string' }
      },
      required: ['response']
    };

    // Send entire conversation history
    const result = await this.groq.sendChat({
      messages: this.messages,
      responseSchema: schema
    });

    // Add assistant response to history
    this.messages.push({
      role: 'assistant',
      content: result.data.response
    });

    return result.data.response;
  }
}

// Usage:
const conversation = new TravelPlannerConversation();
await conversation.ask('I want to visit Japan');
await conversation.ask('What should I see in Tokyo?');
await conversation.ask('How many days should I spend there?');
```

### Error Handling

```typescript
import {
  ValidationError,
  RateLimitError,
  AuthenticationError,
  NetworkError,
  TimeoutError
} from '../lib/errors';

export async function robustGeneration(prompt: string, maxRetries = 3) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await groq.sendChat({
        userMessage: prompt,
        responseSchema: { /* your schema */ }
      });

      return { success: true, data: result.data };

    } catch (error) {
      if (error instanceof AuthenticationError) {
        // Don't retry auth errors
        return { 
          success: false, 
          error: 'Invalid API key. Please check your configuration.' 
        };
      }

      if (error instanceof ValidationError) {
        // Schema mismatch - adjust prompt or schema
        console.error('Validation failed:', error.validationErrors);
        return { 
          success: false, 
          error: 'AI response did not match expected format.' 
        };
      }

      if (error instanceof RateLimitError) {
        // Wait for rate limit to clear
        const waitTime = error.retryAfter || 60;
        console.log(`Rate limited. Waiting ${waitTime} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        attempt++;
        continue;
      }

      if (error instanceof NetworkError || error instanceof TimeoutError) {
        // Network issues - retry
        attempt++;
        if (attempt >= maxRetries) {
          return { 
            success: false, 
            error: 'Network error after multiple attempts.' 
          };
        }
        continue;
      }

      // Unknown error
      return { 
        success: false, 
        error: 'An unexpected error occurred.' 
      };
    }
  }

  return { success: false, error: 'Max retries exceeded.' };
}
```

### Custom Model Configuration

```typescript
// For faster responses with simpler tasks
const fastGroq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  defaultModel: 'gpt-3.5-turbo',
  defaultParams: {
    temperature: 0.3,
    max_tokens: 500
  }
});

// For complex travel planning
const detailedGroq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  defaultModel: 'llama-3.3-70b-versatile',
  defaultParams: {
    temperature: 0.7,
    max_tokens: 3000
  }
});
```

### Streaming (Future Enhancement)

Note: Current implementation doesn't support streaming, but you can process long content in chunks:

```typescript
export async function processLongItinerary(notes: string[]) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  // Process in batches
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize);
    
    const result = await groq.sendChat({
      userMessage: `Process these travel notes: ${batch.join('; ')}`,
      responseSchema: { /* schema */ }
    });

    results.push(result.data);
  }

  return results;
}
```

## Best Practices

1. **Always define strict schemas** - More specific schemas yield better results
2. **Use appropriate temperature** - Lower (0.3-0.5) for factual, higher (0.7-0.9) for creative
3. **Set reasonable token limits** - Balance between completeness and cost
4. **Handle errors gracefully** - Always catch and handle service errors
5. **Cache results** - Store generated itineraries to avoid redundant API calls
6. **Monitor usage** - Track token usage via `result.usage` property
7. **Test schemas** - Verify your JSON schemas work with sample data first

## TypeScript Types

```typescript
// Define your response types for type safety
interface ItineraryResponse {
  title: string;
  days: Array<{
    day: number;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
    }>;
  }>;
}

// Use with generics
const result = await groq.sendChat<ItineraryResponse>({
  userMessage: prompt,
  responseSchema: schema
});

// Now result.data is fully typed!
console.log(result.data.title); // TypeScript knows this exists
```

