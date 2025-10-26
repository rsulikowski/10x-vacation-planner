import { z } from "zod";

/**
 * Schemat walidacji parametru projectId w URL
 */
export const projectIdParamSchema = z.string().uuid("Project ID must be a valid UUID");

/**
 * Schemat walidacji parametru noteId w URL
 */
export const noteIdParamSchema = z.string().uuid("Note ID must be a valid UUID");

/**
 * Schemat walidacji dla tworzenia notatki
 */
export const createNoteCommandSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  priority: z.number().int().min(1).max(3, "Priority must be between 1 and 3"),
  place_tags: z.array(z.string()).nullable().optional(),
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedCreateNoteCommand = z.infer<typeof createNoteCommandSchema>;

/**
 * Schemat walidacji dla aktualizacji notatki (wszystkie pola opcjonalne)
 */
export const updateNoteCommandSchema = z.object({
  content: z.string().min(1, "Content cannot be empty").optional(),
  priority: z.number().int().min(1).max(3, "Priority must be between 1 and 3").optional(),
  place_tags: z.array(z.string()).nullable().optional(),
});

/**
 * Typ wynikowy z walidacji schematu aktualizacji
 */
export type ValidatedUpdateNoteCommand = z.infer<typeof updateNoteCommandSchema>;

/**
 * Schemat walidacji dla parametrów zapytania listy notatek
 */
export const listNotesQuerySchema = z
  .object({
    page: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    priority: z.string().nullable().optional(),
    place_tag: z.string().nullable().optional(),
  })
  .transform((data) => {
    const priority = data.priority ? parseInt(data.priority, 10) : undefined;
    return {
      page: data.page ? parseInt(data.page, 10) : 1,
      size: data.size ? Math.min(parseInt(data.size, 10), 100) : 20,
      priority: priority !== undefined && priority >= 1 && priority <= 3 ? priority : undefined,
      place_tag: data.place_tag || undefined,
    };
  })
  .refine((data) => data.page >= 1, { message: "Page must be at least 1", path: ["page"] })
  .refine((data) => data.size >= 1, { message: "Size must be at least 1", path: ["size"] });

/**
 * Typ wynikowy z walidacji parametrów zapytania listy notatek
 */
export type ValidatedListNotesQuery = z.infer<typeof listNotesQuerySchema>;
