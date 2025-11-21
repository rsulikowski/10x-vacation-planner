import { z } from "zod";

/**
 * Schemat walidacji dla tworzenia projektu podróży
 */
export const createProjectCommandSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  duration_days: z.number().int().min(1, "Duration must be at least 1"),
  planned_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .nullable()
    .optional(),
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedCreateProjectCommand = z.infer<typeof createProjectCommandSchema>;

/**
 * Schemat walidacji dla parametrów zapytania paginacji
 */
export const listProjectsQuerySchema = z
  .object({
    page: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    sort: z.string().nullable().optional(),
    order: z.string().nullable().optional(),
  })
  .transform((data) => {
    const validSorts = ["created_on", "name", "duration_days", "planned_date"] as const;
    type ValidSort = (typeof validSorts)[number];
    const isValidSort = (sort: string | null | undefined): sort is ValidSort => validSorts.includes(sort as ValidSort);

    return {
      page: data.page ? parseInt(data.page, 10) : 1,
      size: data.size ? Math.min(parseInt(data.size, 10), 100) : 20,
      sort: isValidSort(data.sort) ? data.sort : "created_on",
      order: data.order === "asc" || data.order === "desc" ? data.order : "desc",
    };
  })
  .refine((data) => data.page >= 1, { message: "Page must be at least 1", path: ["page"] })
  .refine((data) => data.size >= 1, { message: "Size must be at least 1", path: ["size"] });

/**
 * Typ wynikowy z walidacji parametrów zapytania
 */
export type ValidatedListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

/**
 * Schemat walidacji parametru projectId w URL
 */
export const projectIdParamSchema = z.string().uuid("Project ID must be a valid UUID");

/**
 * Schemat walidacji dla aktualizacji projektu (wszystkie pola opcjonalne)
 */
export const updateProjectCommandSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  duration_days: z.number().int().min(1, "Duration must be at least 1").optional(),
  planned_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .nullable()
    .optional(),
});

/**
 * Typ wynikowy z walidacji schematu aktualizacji
 */
export type ValidatedUpdateProjectCommand = z.infer<typeof updateProjectCommandSchema>;
