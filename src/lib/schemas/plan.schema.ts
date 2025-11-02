import { z } from "zod";

/**
 * Schemat walidacji dla notatki w komendzie generowania planu
 */
const noteSchema = z.object({
  id: z.string().uuid("Note ID must be a valid UUID"),
  content: z.string().min(1, "Note content cannot be empty"),
  priority: z.number().int().min(1).max(3, "Priority must be a number between 1 and 3"),
  place_tags: z.array(z.string()).nullable(),
});

/**
 * Schemat walidacji dla preferencji użytkownika (opcjonalny)
 */
const preferencesSchema = z
  .object({
    categories: z.array(z.string().min(1)),
  })
  .optional();

/**
 * Whitelist dozwolonych modeli AI
 */
const ALLOWED_AI_MODELS = ["gpt-4", "gpt-4o-mini", "gpt-5", "claude-3-opus", "claude-3.5-sonnet", "openai/gpt-oss-20b"] as const;

/**
 * Schemat walidacji dla komendy generowania planu
 */
export const generatePlanCommandSchema = z.object({
  model: z.enum(ALLOWED_AI_MODELS, {
    errorMap: () => ({ message: `Model must be one of: ${ALLOWED_AI_MODELS.join(", ")}` }),
  }),
  project_name: z.string().min(1, "Project name cannot be empty").max(200, "Project name too long"),
  duration_days: z.number().int().min(1, "Duration must be at least 1 day").max(365, "Duration cannot exceed 365 days"),
  notes: z.array(noteSchema).min(1, "At least one note must be provided").max(100, "Maximum 100 notes allowed"),
  preferences: preferencesSchema,
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedGeneratePlanCommand = z.infer<typeof generatePlanCommandSchema>;

/**
 * Schemat walidacji parametru projectId w URL
 */
export const projectIdParamSchema = z.string().uuid("Project ID must be a valid UUID");
