import { z } from 'zod';

/**
 * Schemat walidacji dla notatki w komendzie generowania planu
 */
const noteSchema = z.object({
  id: z.string().uuid('ID notatki musi być prawidłowym UUID'),
  content: z.string().min(1, 'Treść notatki nie może być pusta'),
  priority: z.number().int().min(1).max(3, 'Priorytet musi być liczbą od 1 do 3'),
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
const ALLOWED_AI_MODELS = ['gpt-4', 'gpt-5', 'claude-3-opus', 'claude-3.5-sonnet'] as const;

/**
 * Schemat walidacji dla komendy generowania planu
 */
export const generatePlanCommandSchema = z.object({
  model: z.enum(ALLOWED_AI_MODELS, {
    errorMap: () => ({ message: `Model musi być jednym z: ${ALLOWED_AI_MODELS.join(', ')}` }),
  }),
  notes: z.array(noteSchema).min(1, 'Musi być podana co najmniej jedna notatka').max(100, 'Maksymalnie 100 notatek'),
  preferences: preferencesSchema,
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedGeneratePlanCommand = z.infer<typeof generatePlanCommandSchema>;

/**
 * Schemat walidacji parametru projectId w URL
 */
export const projectIdParamSchema = z.string().uuid('Project ID musi być prawidłowym UUID');

