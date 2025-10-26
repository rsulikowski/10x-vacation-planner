import { useReducer, useEffect, useCallback } from "react";
import type { GeneratePlanCommand, PlanResponseDto, NoteDto, PreferencesDto } from "../../types";

// View-specific types
export type PlanGenerationStatus = "idle" | "loading" | "success" | "error";

export interface PlanViewState {
  status: PlanGenerationStatus;
  schedule: PlanResponseDto["schedule"] | null;
  error: string | null;
  notes: NoteDto[];
  preferences: PreferencesDto | null;
  hasNotes: boolean;
}

// Actions for state management
type PlanAction =
  | { type: "FETCH_DATA_START" }
  | { type: "FETCH_DATA_SUCCESS"; payload: { notes: NoteDto[]; preferences: PreferencesDto | null } }
  | { type: "FETCH_DATA_ERROR"; payload: string }
  | { type: "GENERATE_START" }
  | { type: "GENERATE_SUCCESS"; payload: PlanResponseDto["schedule"] }
  | { type: "GENERATE_ERROR"; payload: string };

// Reducer for state management
const planReducer = (state: PlanViewState, action: PlanAction): PlanViewState => {
  switch (action.type) {
    case "FETCH_DATA_START":
      return {
        ...state,
        status: "loading",
      };

    case "FETCH_DATA_SUCCESS":
      return {
        ...state,
        status: "idle",
        notes: action.payload.notes,
        preferences: action.payload.preferences,
        hasNotes: action.payload.notes.length > 0,
        error: null,
      };

    case "FETCH_DATA_ERROR":
      return {
        ...state,
        status: "error",
        error: action.payload,
      };

    case "GENERATE_START":
      return {
        ...state,
        status: "loading",
        error: null,
      };

    case "GENERATE_SUCCESS":
      return {
        ...state,
        status: "success",
        schedule: action.payload,
        error: null,
      };

    case "GENERATE_ERROR":
      return {
        ...state,
        status: "error",
        error: action.payload,
        schedule: null,
      };

    default:
      return state;
  }
};

const initialState: PlanViewState = {
  status: "idle",
  schedule: null,
  error: null,
  notes: [],
  preferences: null,
  hasNotes: false,
};

interface UsePlanGeneratorProps {
  projectId: string;
}

export const usePlanGenerator = ({ projectId }: UsePlanGeneratorProps) => {
  const [state, dispatch] = useReducer(planReducer, initialState);

  // Fetch initial data (notes and preferences) on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch({ type: "FETCH_DATA_START" });

      try {
        // Fetch all notes for the project (no pagination)
        const notesResponse = await fetch(`/api/projects/${projectId}/notes?size=1000`);

        if (!notesResponse.ok) {
          throw new Error("Failed to load project notes");
        }

        const notesData = await notesResponse.json();
        const notes: NoteDto[] = notesData.data || [];

        // TODO: Fetch user preferences when the endpoint is available
        // For now, we'll set preferences to null
        const preferences: PreferencesDto | null = null;

        dispatch({
          type: "FETCH_DATA_SUCCESS",
          payload: { notes, preferences },
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not load project data. Please refresh the page.";
        dispatch({ type: "FETCH_DATA_ERROR", payload: message });
      }
    };

    fetchInitialData();
  }, [projectId]);

  // Generate plan function
  const generatePlan = useCallback(async () => {
    if (state.notes.length === 0) {
      dispatch({
        type: "GENERATE_ERROR",
        payload: "Please add notes to your project to generate a plan",
      });
      return;
    }

    dispatch({ type: "GENERATE_START" });

    try {
      // Build the command
      const command: GeneratePlanCommand = {
        model: "gpt-5", // Default model
        notes: state.notes.map((note) => ({
          id: note.id,
          content: note.content,
          priority: note.priority,
          place_tags: note.place_tags,
        })),
      };

      // Include preferences if available
      if (state.preferences) {
        command.preferences = state.preferences;
      }

      // Execute the POST request
      const response = await fetch(`/api/projects/${projectId}/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || "Failed to generate plan";

        // Map HTTP status codes to user-friendly messages
        if (response.status === 400) {
          throw new Error("Invalid data provided. Please ensure your project notes are correct.");
        } else if (response.status === 404) {
          throw new Error("Project not found. Please check the project ID.");
        } else if (response.status >= 500) {
          throw new Error("An unexpected error occurred while generating your plan. Please try again later.");
        } else {
          throw new Error(errorMessage);
        }
      }

      const result: PlanResponseDto = await response.json();

      dispatch({
        type: "GENERATE_SUCCESS",
        payload: result.schedule,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Network error. Please check your connection and try again.";
      dispatch({ type: "GENERATE_ERROR", payload: message });
    }
  }, [projectId, state.notes, state.preferences]);

  return {
    status: state.status,
    schedule: state.schedule,
    error: state.error,
    hasNotes: state.hasNotes,
    generatePlan,
  };
};
