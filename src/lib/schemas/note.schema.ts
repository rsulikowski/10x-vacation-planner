import { z } from 'zod';

/**
 * Schemat walidacji parametru projectId w URL
 */
export const projectIdParamSchema = z.string().uuid('Project ID must be a valid UUID');

/**
 * Schemat walidacji dla tworzenia notatki
 */
export const createNoteCommandSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  priority: z.number().int().min(1).max(3, 'Priority must be between 1 and 3'),
  place_tags: z.array(z.string()).nullable().optional(),
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedCreateNoteCommand = z.infer<typeof createNoteCommandSchema>;

