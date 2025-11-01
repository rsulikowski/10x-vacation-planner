/**
 * AI Service - Real Implementation using GROQ
 *
 * Service for generating travel plans using LLM through GROQ API
 */

import type { GeneratePlanCommand, PlanResponseDto, ScheduleItemDto } from "../types";
import { GROQService } from "../lib/groq.service";
import type { JSONSchema } from "../lib/groq.types";
import { ValidationError, ApiError as GroqApiError } from "../lib/errors";
import { ApiError } from "../lib/api-utils";

/**
 * JSON Schema for the plan response
 * This ensures the LLM returns structured data matching PlanResponseDto
 */
const PLAN_RESPONSE_SCHEMA: JSONSchema = {
  type: "object",
  properties: {
    schedule: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: {
            type: "number",
            description: "Day number (1, 2, 3, etc.)",
          },
          activities: {
            type: "array",
            items: {
              type: "string",
              description: "Activity description",
            },
            description: "List of activities for the day",
          },
        },
        required: ["day", "activities"],
        additionalProperties: false,
      },
      description: "Daily schedule of activities",
    },
  },
  required: ["schedule"],
  additionalProperties: false,
};

/**
 * Real AI Service for generating travel plans
 */
export class AIService {
  private groqService: GROQService;

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("GROQ API key is required");
    }

    this.groqService = new GROQService({
      apiKey,
      defaultModel: "llama-3.3-70b-versatile",
      defaultParams: {
        temperature: 0.7,
        max_tokens: 4096,
      },
    });
  }

  /**
   * Generate a travel plan using GROQ LLM
   */
  async generatePlan(command: GeneratePlanCommand): Promise<PlanResponseDto> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(command);

      const response = await this.groqService.sendChat<PlanResponseDto>({
        systemMessage: systemPrompt,
        userMessage: userPrompt,
        responseSchema: PLAN_RESPONSE_SCHEMA,
        schemaName: "TravelPlanResponse",
        model: this.mapModelName(command.model),
        parameters: {
          temperature: 0.7,
          max_tokens: 4096,
        },
      });

      // Validate that we have at least some schedule items
      if (!response.data.schedule || response.data.schedule.length === 0) {
        throw new ApiError(500, "Generated plan has no schedule items");
      }

      return response.data;
    } catch (error) {
      // Handle GROQ-specific errors
      if (error instanceof ValidationError) {
        throw new ApiError(500, `AI response validation failed: ${error.message}`);
      }

      if (error instanceof GroqApiError) {
        throw new ApiError(502, `AI service error: ${error.message}`);
      }

      // Re-throw ApiErrors as-is
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle unknown errors
      console.error("Unexpected error in AI service:", error);
      throw new ApiError(500, "Failed to generate travel plan");
    }
  }

  /**
   * Generate a prompt description for logging
   */
  generatePrompt(command: GeneratePlanCommand): string {
    const userPrompt = this.buildUserPrompt(command);
    return JSON.stringify(
      {
        model: command.model,
        notes_count: command.notes.length,
        high_priority_notes: command.notes.filter((n) => n.priority === 3).length,
        medium_priority_notes: command.notes.filter((n) => n.priority === 2).length,
        low_priority_notes: command.notes.filter((n) => n.priority === 1).length,
        preferences: command.preferences || null,
        prompt_preview: userPrompt.substring(0, 200) + "...",
      },
      null,
      2
    );
  }

  /**
   * Build the system prompt that defines the AI's role and behavior
   */
  private buildSystemPrompt(): string {
    return `You are an expert travel planner AI assistant. Your task is to create detailed, personalized travel itineraries based on user notes and preferences.

RESPONSIBILITIES:
- Analyze user notes about places, activities, and attractions
- Prioritize activities based on user-assigned priority levels (1=low, 2=medium, 3=high)
- Create a day-by-day schedule that is logical and feasible
- Consider travel time and geographical proximity when scheduling activities
- Balance the itinerary to avoid overloading any single day
- Include high-priority items early in the trip when possible

OUTPUT REQUIREMENTS:
- Generate a schedule with specific days (day 1, day 2, etc.)
- Each day should have 3-5 activities
- Activities should be specific and actionable
- Include breaks, meals, and travel time considerations
- Activities should be diverse and well-balanced throughout the trip

FORMATTING:
- Be concise but informative in activity descriptions
- Use natural language that is easy to understand
- Ensure the schedule is realistic and achievable`;
  }

  /**
   * Build the user prompt with specific trip details
   */
  private buildUserPrompt(command: GeneratePlanCommand): string {
    // Sort notes by priority (high to low)
    const sortedNotes = [...command.notes].sort((a, b) => b.priority - a.priority);

    // Group notes by priority
    const highPriorityNotes = sortedNotes.filter((n) => n.priority === 3);
    const mediumPriorityNotes = sortedNotes.filter((n) => n.priority === 2);
    const lowPriorityNotes = sortedNotes.filter((n) => n.priority === 1);

    let prompt = `Please create a detailed travel itinerary based on the following information:\n\n`;

    // Add high priority notes
    if (highPriorityNotes.length > 0) {
      prompt += `HIGH PRIORITY (Must Include):\n`;
      highPriorityNotes.forEach((note, idx) => {
        const tags = note.place_tags && note.place_tags.length > 0 ? ` [${note.place_tags.join(", ")}]` : "";
        prompt += `${idx + 1}. ${note.content}${tags}\n`;
      });
      prompt += `\n`;
    }

    // Add medium priority notes
    if (mediumPriorityNotes.length > 0) {
      prompt += `MEDIUM PRIORITY (Should Include):\n`;
      mediumPriorityNotes.forEach((note, idx) => {
        const tags = note.place_tags && note.place_tags.length > 0 ? ` [${note.place_tags.join(", ")}]` : "";
        prompt += `${idx + 1}. ${note.content}${tags}\n`;
      });
      prompt += `\n`;
    }

    // Add low priority notes
    if (lowPriorityNotes.length > 0) {
      prompt += `LOW PRIORITY (Include if time permits):\n`;
      lowPriorityNotes.forEach((note, idx) => {
        const tags = note.place_tags && note.place_tags.length > 0 ? ` [${note.place_tags.join(", ")}]` : "";
        prompt += `${idx + 1}. ${note.content}${tags}\n`;
      });
      prompt += `\n`;
    }

    // Add preferences if provided
    if (command.preferences && command.preferences.categories.length > 0) {
      prompt += `USER PREFERENCES:\n`;
      prompt += `Interested in: ${command.preferences.categories.join(", ")}\n\n`;
    }

    // Add final instructions
    prompt += `INSTRUCTIONS:\n`;
    prompt += `- Create a day-by-day itinerary with ${Math.max(3, Math.ceil(sortedNotes.length / 4))} to ${Math.min(7, Math.ceil(sortedNotes.length / 2))} days\n`;
    prompt += `- Prioritize high-priority items and include them early in the schedule\n`;
    prompt += `- Create 3-5 activities per day\n`;
    prompt += `- Ensure activities are geographically logical (use place tags as hints)\n`;
    prompt += `- Include practical activities like meals, breaks, and travel time\n`;
    prompt += `- Make the schedule realistic and enjoyable\n`;

    return prompt;
  }

  /**
   * Map user-facing model names to GROQ model names
   * Note: Only models that support json_schema response format are used
   * See: https://console.groq.com/docs/structured-outputs#supported-models
   */
  private mapModelName(requestedModel: string): string {
    const modelMap: Record<string, string> = {
      "gpt-4": "llama-3.3-70b-versatile",
      "gpt-4o-mini": "openai/gpt-oss-20b", // Changed from 8b-instant (doesn't support json_schema)
      "gpt-5": "llama-3.3-70b-versatile",
      "claude-3-opus": "llama-3.3-70b-versatile",
      "claude-3.5-sonnet": "llama-3.3-70b-versatile",
    };

    return modelMap[requestedModel] || "llama-3.3-70b-versatile";
  }
}

/**
 * Create singleton instance of AI service
 * The API key will be read from environment variables at runtime
 */
let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    // Try GROQ_API_KEY first, fallback to OPENROUTER_API_KEY for backwards compatibility
    let apiKey = import.meta.env.GROQ_API_KEY || import.meta.env.OPENROUTER_API_KEY;
    
    // Fallback for development/debugging
    if (!apiKey) {
      console.error("⚠️ GROQ_API_KEY not found in environment variables");
      console.error("Available env vars:", Object.keys(import.meta.env));
      throw new Error(
        "GROQ_API_KEY environment variable is not set. " +
        "Please add GROQ_API_KEY=your_key_here to your .env file and restart the dev server."
      );
    }
    
    // Log which key is being used (for debugging)
    if (import.meta.env.DEV) {
      console.log(
        "Using API key from:",
        import.meta.env.GROQ_API_KEY ? "GROQ_API_KEY" : "OPENROUTER_API_KEY (fallback)"
      );
    }
    
    aiServiceInstance = new AIService(apiKey);
  }
  return aiServiceInstance;
}

/**
 * DEPRECATED: Use getAIService() instead
 * This export is kept for backwards compatibility but may cause issues
 * if imported at module level before environment variables are loaded
 */
export const aiService = {
  generatePlan: (command: GeneratePlanCommand) => getAIService().generatePlan(command),
  generatePrompt: (command: GeneratePlanCommand) => getAIService().generatePrompt(command),
};
