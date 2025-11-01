import { useState, useCallback } from "react";
import type { ScheduleItemDto, NoteDto } from "../../types";

interface PlanData {
  schedule: ScheduleItemDto[];
  version: number;
  createdOn: string;
}

interface UsePlanReturn {
  plan: PlanData | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  fetchPlan: () => Promise<void>;
  generatePlan: (notes: NoteDto[]) => Promise<void>;
}

export function usePlan(projectId: string): UsePlanReturn {
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch existing plan for the project
   */
  const fetchPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/plan`);

      if (response.status === 404) {
        // No plan exists yet - this is expected
        setPlan(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch plan");
      }

      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plan");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  /**
   * Generate a new plan using AI
   */
  const generatePlan = useCallback(
    async (notes: NoteDto[]) => {
      if (notes.length === 0) {
        setError("Please add notes to your project before generating a plan");
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        // Prepare notes data for AI
        const notesData = notes.map((note) => ({
          id: note.id,
          content: note.content,
          priority: note.priority,
          place_tags: note.place_tags,
        }));

        // Call AI service
        const response = await fetch(`/api/projects/${projectId}/plan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            notes: notesData,
            preferences: {
              categories: [],
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to generate plan");
        }

      const data = await response.json();

      // Update plan with new data
      // Note: Version from response is used, or calculated from existing plans
      setPlan({
        schedule: data.schedule,
        version: data.version || (plan?.version || 0) + 1,
        createdOn: new Date().toISOString(),
      });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate plan");
        throw err; // Re-throw so caller can handle it
      } finally {
        setIsGenerating(false);
      }
    },
    [projectId, plan?.version]
  );

  return {
    plan,
    isLoading,
    isGenerating,
    error,
    fetchPlan,
    generatePlan,
  };
}

