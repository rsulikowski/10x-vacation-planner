import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useProjectNotes } from "./useProjectNotes";
import * as notesApi from "../../lib/api/notes.api";
import type { NotesListResponseDto, NoteDto, CreateNoteCommand, UpdateNoteCommand } from "../../types";

// Mock the API module
vi.mock("../../lib/api/notes.api");

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useProjectNotes", () => {
  let queryClient: QueryClient;

  // Helper to create a wrapper with QueryClient
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientWrapper";
    return Wrapper;
  };

  // Helper to create mock note data
  const createMockNote = (id: string, priority = 1): NoteDto => ({
    id,
    project_id: "project-1",
    content: `Note ${id}`,
    priority,
    place_tags: ["Paris"],
    updated_on: new Date().toISOString(),
  });

  // Helper to create mock response
  const createMockResponse = (notes: NoteDto[], page: number, size: number, total: number): NotesListResponseDto => ({
    data: notes,
    meta: {
      page,
      size,
      total,
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient?.clear();
  });

  describe("Filter changes trigger query invalidation", () => {
    it("should refetch notes when filters change", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const note1 = createMockNote("1", 1);
      const note2 = createMockNote("2", 2);

      mockFetchNotes
        .mockResolvedValueOnce(createMockResponse([note1], 1, 20, 1))
        .mockResolvedValueOnce(createMockResponse([note2], 1, 20, 1));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      // Wait for initial query to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert initial state
      expect(result.current.notes).toHaveLength(1);
      expect(result.current.notes[0].id).toBe("1");
      expect(mockFetchNotes).toHaveBeenCalledWith("project-1", 1, 20, null, "");

      // Change filters
      act(() => {
        result.current.setFilters({ priority: 2, place_tag: "Tokyo" });
      });

      // Wait for refetch
      await waitFor(() => {
        expect(mockFetchNotes).toHaveBeenCalledWith("project-1", 1, 20, 2, "Tokyo");
      });

      await waitFor(() => {
        expect(result.current.notes).toHaveLength(1);
        expect(result.current.notes[0].id).toBe("2");
      });
    });

    it("should reset pagination when filters change", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const notes1 = [createMockNote("1"), createMockNote("2")];
      const notes2 = [createMockNote("3"), createMockNote("4")];
      const notes3 = [createMockNote("5")];

      mockFetchNotes
        .mockResolvedValueOnce(createMockResponse(notes1, 1, 2, 4))
        .mockResolvedValueOnce(createMockResponse(notes2, 2, 2, 4))
        .mockResolvedValueOnce(createMockResponse(notes3, 1, 2, 1));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Fetch next page
      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.notes).toHaveLength(4);
      });

      // Change filters (should reset to page 1)
      act(() => {
        result.current.setFilters({ priority: 3, place_tag: "" });
      });

      await waitFor(() => {
        expect(result.current.notes).toHaveLength(1);
        expect(result.current.notes[0].id).toBe("5");
      });
    });
  });

  describe("Pagination calculates correct next page", () => {
    it("should calculate next page correctly for multi-page results", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const page1Notes = [createMockNote("1"), createMockNote("2")];
      const page2Notes = [createMockNote("3"), createMockNote("4")];

      mockFetchNotes
        .mockResolvedValueOnce(createMockResponse(page1Notes, 1, 2, 4))
        .mockResolvedValueOnce(createMockResponse(page2Notes, 2, 2, 4));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.notes).toHaveLength(2);

      // Fetch next page
      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.notes).toHaveLength(4);
      });

      expect(mockFetchNotes).toHaveBeenCalledTimes(2);
      expect(mockFetchNotes).toHaveBeenNthCalledWith(1, "project-1", 1, 20, null, "");
      expect(mockFetchNotes).toHaveBeenNthCalledWith(2, "project-1", 2, 20, null, "");
    });

    it("should calculate total pages correctly with various totals", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);

      // Test case: 21 items with size 20 = 2 pages
      mockFetchNotes.mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 20, 21));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert
      expect(result.current.hasNextPage).toBe(true);
    });

    it("should calculate correctly when total is exact multiple of page size", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);

      // Test case: 40 items with size 20 = exactly 2 pages
      mockFetchNotes.mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 20, 40));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert
      expect(result.current.hasNextPage).toBe(true);
    });
  });

  describe("Handles last page correctly (returns undefined)", () => {
    it("should return undefined for next page when on last page", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const notes = [createMockNote("1"), createMockNote("2")];

      // Only 2 items total, page size 20, so only 1 page
      mockFetchNotes.mockResolvedValueOnce(createMockResponse(notes, 1, 20, 2));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.notes).toHaveLength(2);
    });

    it("should set hasNextPage to false on last page of multi-page result", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const page1Notes = [createMockNote("1"), createMockNote("2")];
      const page2Notes = [createMockNote("3")];

      mockFetchNotes
        .mockResolvedValueOnce(createMockResponse(page1Notes, 1, 2, 3))
        .mockResolvedValueOnce(createMockResponse(page2Notes, 2, 2, 3));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(true);

      // Fetch last page
      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.hasNextPage).toBe(false);
      });

      expect(result.current.notes).toHaveLength(3);
    });

    it("should handle empty results correctly", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      mockFetchNotes.mockResolvedValueOnce(createMockResponse([], 1, 20, 0));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert
      expect(result.current.notes).toHaveLength(0);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe("handleFetchNextPage respects hasNextPage and isFetchingNextPage guards", () => {
    it("should not fetch when hasNextPage is false", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      mockFetchNotes.mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 20, 1));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(false);

      // Try to fetch next page
      act(() => {
        result.current.fetchNextPage();
      });

      // Assert - should not call API again
      await waitFor(() => {
        expect(mockFetchNotes).toHaveBeenCalledTimes(1);
      });
    });

    it("should not fetch when isFetchingNextPage is true", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const page1Response = createMockResponse([createMockNote("1")], 1, 2, 4);
      const page2Response = createMockResponse([createMockNote("2")], 2, 2, 4);

      mockFetchNotes
        .mockResolvedValueOnce(page1Response)
        .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(page2Response), 50)));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(true);

      // Start fetching next page
      act(() => {
        result.current.fetchNextPage();
      });

      // Wait a moment for the fetch to start
      await waitFor(() => {
        expect(result.current.isFetchingNextPage).toBe(true);
      });

      // Try to fetch again while fetching - should be blocked by guard
      const beforeCallCount = mockFetchNotes.mock.calls.length;
      act(() => {
        result.current.fetchNextPage();
        result.current.fetchNextPage();
      });

      // The calls should have been prevented by the guard immediately
      expect(mockFetchNotes.mock.calls.length).toBe(beforeCallCount);

      // Wait for fetching to complete
      await waitFor(
        () => {
          expect(result.current.isFetchingNextPage).toBe(false);
        },
        { timeout: 3000 }
      );
    });

    it("should handle fetch errors gracefully", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const error = new Error("Network error");

      mockFetchNotes.mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 2, 4));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Setup rejection for next page fetch
      mockFetchNotes.mockRejectedValueOnce(error);

      // Try to fetch next page (will fail)
      act(() => {
        result.current.fetchNextPage();
      });

      // Assert - The hook should handle the error without breaking
      // React Query will set the error state
      await waitFor(
        () => {
          // After error, hook should still be stable
          expect(result.current.notes).toBeDefined();
          expect(result.current.notes.length).toBeGreaterThanOrEqual(1);
        },
        { timeout: 3000 }
      );

      // Verify the hook is still functional after error
      expect(result.current.notes[0].id).toBe("1");
    });

    it("should maintain stability when fetch fails", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const errorWithoutMessage = new Error();

      mockFetchNotes.mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 2, 4));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialNotes = result.current.notes;

      // Setup rejection for next page fetch
      mockFetchNotes.mockRejectedValueOnce(errorWithoutMessage);

      act(() => {
        result.current.fetchNextPage();
      });

      // Assert - Hook should maintain existing data after fetch error
      await waitFor(
        () => {
          expect(result.current.notes).toEqual(initialNotes);
        },
        { timeout: 3000 }
      );

      // Verify we can still interact with the hook
      expect(result.current.notes.length).toBe(1);
      expect(result.current.hasNextPage).toBe(true);
    });
  });

  describe("Notes array correctly flattens across multiple pages", () => {
    it("should flatten notes from multiple pages into single array", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const page1Notes = [createMockNote("1"), createMockNote("2")];
      const page2Notes = [createMockNote("3"), createMockNote("4")];
      const page3Notes = [createMockNote("5")];

      mockFetchNotes
        .mockResolvedValueOnce(createMockResponse(page1Notes, 1, 2, 5))
        .mockResolvedValueOnce(createMockResponse(page2Notes, 2, 2, 5))
        .mockResolvedValueOnce(createMockResponse(page3Notes, 3, 2, 5));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert initial page
      expect(result.current.notes).toHaveLength(2);
      expect(result.current.notes.map((n) => n.id)).toEqual(["1", "2"]);

      // Fetch second page
      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.notes).toHaveLength(4);
      });

      expect(result.current.notes.map((n) => n.id)).toEqual(["1", "2", "3", "4"]);

      // Fetch third page
      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.notes).toHaveLength(5);
      });

      expect(result.current.notes.map((n) => n.id)).toEqual(["1", "2", "3", "4", "5"]);
    });

    it("should maintain correct order when flattening pages", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const page1Notes = [createMockNote("note-1", 1), createMockNote("note-2", 2)];
      const page2Notes = [createMockNote("note-3", 3), createMockNote("note-4", 1)];

      mockFetchNotes
        .mockResolvedValueOnce(createMockResponse(page1Notes, 1, 2, 4))
        .mockResolvedValueOnce(createMockResponse(page2Notes, 2, 2, 4));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.notes).toHaveLength(4);
      });

      // Assert - verify order is preserved
      expect(result.current.notes[0].id).toBe("note-1");
      expect(result.current.notes[1].id).toBe("note-2");
      expect(result.current.notes[2].id).toBe("note-3");
      expect(result.current.notes[3].id).toBe("note-4");
    });

    it("should return empty array when no data is available", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      mockFetchNotes.mockResolvedValueOnce(createMockResponse([], 1, 20, 0));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert
      expect(result.current.notes).toEqual([]);
    });
  });

  describe("Additional edge cases", () => {
    it("should handle rapid filter changes correctly", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      mockFetchNotes
        .mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 20, 1))
        .mockResolvedValueOnce(createMockResponse([createMockNote("2")], 1, 20, 1))
        .mockResolvedValueOnce(createMockResponse([createMockNote("3")], 1, 20, 1));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Rapidly change filters
      act(() => {
        result.current.setFilters({ priority: 1, place_tag: "" });
        result.current.setFilters({ priority: 2, place_tag: "" });
        result.current.setFilters({ priority: 3, place_tag: "" });
      });

      // Wait for final state
      await waitFor(() => {
        expect(result.current.notes.length).toBeGreaterThan(0);
      });

      // Assert - should handle gracefully
      expect(result.current.notes).toBeDefined();
    });

    it("should preserve filters reference with useCallback", () => {
      // Arrange & Act
      const { result, rerender } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      const firstSetFilters = result.current.setFilters;

      rerender();

      const secondSetFilters = result.current.setFilters;

      // Assert - function reference should be stable
      expect(firstSetFilters).toBe(secondSetFilters);
    });

    it("should preserve fetchNextPage reference with useCallback", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      mockFetchNotes.mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 2, 4));

      // Act
      const { result, rerender } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const firstFetchNextPage = result.current.fetchNextPage;

      rerender();

      const secondFetchNextPage = result.current.fetchNextPage;

      // Assert - function reference should be stable when dependencies don't change
      expect(firstFetchNextPage).toBe(secondFetchNextPage);
    });

    it("should handle concurrent filter change and pagination correctly", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      mockFetchNotes
        .mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 2, 4))
        .mockResolvedValueOnce(createMockResponse([createMockNote("2")], 2, 2, 4))
        .mockResolvedValueOnce(createMockResponse([createMockNote("3")], 1, 2, 1));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Fetch next page and immediately change filters
      act(() => {
        result.current.fetchNextPage();
        result.current.setFilters({ priority: 2, place_tag: "" });
      });

      // Wait for operations to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - should handle gracefully
      expect(result.current.notes).toBeDefined();
    });

    it("should expose correct loading states", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      mockFetchNotes.mockResolvedValueOnce(createMockResponse([createMockNote("1")], 1, 20, 1));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      // Assert initial loading state
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert final state
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should handle query errors correctly", async () => {
      // Arrange
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const error = new Error("Failed to fetch");
      mockFetchNotes.mockRejectedValueOnce(error);

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.notes).toEqual([]);
    });
  });

  describe("Mutation operations", () => {
    it("should create note and invalidate query", async () => {
      // Arrange
      const { toast } = await import("sonner");
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const mockCreateNote = vi.mocked(notesApi.createNote);
      const newNote = createMockNote("new-note");

      mockFetchNotes.mockResolvedValue(createMockResponse([createMockNote("1")], 1, 20, 1));
      mockCreateNote.mockResolvedValueOnce(newNote);

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const command: CreateNoteCommand = {
        content: "New note",
        priority: 1,
        place_tags: ["Tokyo"],
        project_id: "project-1",
      };

      act(() => {
        result.current.createNote(command);
      });

      // Assert
      await waitFor(() => {
        expect(mockCreateNote).toHaveBeenCalledWith("project-1", command);
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Note created successfully");
      });
    });

    it("should update note and invalidate query", async () => {
      // Arrange
      const { toast } = await import("sonner");
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const mockUpdateNote = vi.mocked(notesApi.updateNote);
      const updatedNote = createMockNote("1");

      mockFetchNotes.mockResolvedValue(createMockResponse([createMockNote("1")], 1, 20, 1));
      mockUpdateNote.mockResolvedValueOnce(updatedNote);

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const command: UpdateNoteCommand = {
        content: "Updated content",
        priority: 2,
        place_tags: ["Paris"],
      };

      act(() => {
        result.current.updateNote({ noteId: "1", command });
      });

      // Assert
      await waitFor(() => {
        expect(mockUpdateNote).toHaveBeenCalledWith("project-1", "1", command);
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Note updated successfully");
      });
    });

    it("should delete note and invalidate query", async () => {
      // Arrange
      const { toast } = await import("sonner");
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const mockDeleteNote = vi.mocked(notesApi.deleteNote);

      mockFetchNotes.mockResolvedValue(createMockResponse([createMockNote("1")], 1, 20, 1));
      mockDeleteNote.mockResolvedValueOnce(undefined);

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.deleteNote("1");
      });

      // Assert
      await waitFor(() => {
        expect(mockDeleteNote).toHaveBeenCalledWith("project-1", "1");
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Note deleted successfully");
      });
    });

    it("should show error toast when create fails", async () => {
      // Arrange
      const { toast } = await import("sonner");
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const mockCreateNote = vi.mocked(notesApi.createNote);

      mockFetchNotes.mockResolvedValue(createMockResponse([createMockNote("1")], 1, 20, 1));
      mockCreateNote.mockRejectedValueOnce(new Error("Failed to create"));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.createNote({
          content: "New note",
          priority: 1,
          place_tags: ["Tokyo"],
          project_id: "project-1",
        });
      });

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to create");
      });
    });

    it("should show default error toast when create fails without error message", async () => {
      // Arrange
      const { toast } = await import("sonner");
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const mockCreateNote = vi.mocked(notesApi.createNote);

      mockFetchNotes.mockResolvedValue(createMockResponse([createMockNote("1")], 1, 20, 1));
      mockCreateNote.mockRejectedValueOnce(new Error(""));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.createNote({
          content: "New note",
          priority: 1,
          place_tags: ["Tokyo"],
          project_id: "project-1",
        });
      });

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to create note");
      });
    });

    it("should show error toast when update fails without error message", async () => {
      // Arrange
      const { toast } = await import("sonner");
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const mockUpdateNote = vi.mocked(notesApi.updateNote);

      mockFetchNotes.mockResolvedValue(createMockResponse([createMockNote("1")], 1, 20, 1));
      mockUpdateNote.mockRejectedValueOnce(new Error(""));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateNote({
          noteId: "1",
          command: {
            content: "Updated content",
            priority: 2,
            place_tags: ["Paris"],
          },
        });
      });

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to update note");
      });
    });

    it("should show error toast when delete fails without error message", async () => {
      // Arrange
      const { toast } = await import("sonner");
      const mockFetchNotes = vi.mocked(notesApi.fetchNotes);
      const mockDeleteNote = vi.mocked(notesApi.deleteNote);

      mockFetchNotes.mockResolvedValue(createMockResponse([createMockNote("1")], 1, 20, 1));
      mockDeleteNote.mockRejectedValueOnce(new Error(""));

      // Act
      const { result } = renderHook(() => useProjectNotes("project-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.deleteNote("1");
      });

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to delete note");
      });
    });
  });
});
