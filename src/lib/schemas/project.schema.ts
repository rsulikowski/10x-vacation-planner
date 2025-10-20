import { z } from 'zod';

/**
 * Schemat walidacji dla tworzenia projektu podróży
 */
export const createProjectCommandSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  duration_days: z.number().int().min(1, 'Duration must be at least 1'),
  planned_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .nullable()
    .optional(),
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedCreateProjectCommand = z.infer<typeof createProjectCommandSchema>;

