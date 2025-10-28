import { useState, useEffect, useCallback } from "react";
import { useQueryClient, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  NoteDto,
  CreateNoteCommand,
  UpdateNoteCommand,
  NotesFilterViewModel,
} from "../../types";
import { fetchNotes, createNote, updateNote, deleteNote } from "../../lib/api/notes.api";

/**
 * Custom hook to manage Notes List state and API interactions
 */
export function useProjectNotes(projectId: string) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<NotesFilterViewModel>({
    priority: null,
    place_tag: "",
  });

  // Infinite query for fetching notes with pagination
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notes", projectId, filters],
    queryFn: ({ pageParam = 1 }) => 
      fetchNotes(projectId, pageParam, 20, filters.priority, filters.place_tag),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.page + 1;
      const totalPages = Math.ceil(lastPage.meta.total / lastPage.meta.size);
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages of notes into a single array
  const notes = data?.pages.flatMap((page) => page.data) || [];

  // Mutation for creating a note
  const createNoteMutation = useMutation({
    mutationFn: (command: CreateNoteCommand) => createNote(projectId, command),
    onSuccess: () => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
      toast.success("Note created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create note");
    },
  });

  // Mutation for updating a note
  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, command }: { noteId: string; command: UpdateNoteCommand }) =>
      updateNote(projectId, noteId, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
      toast.success("Note updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update note");
    },
  });

  // Mutation for deleting a note
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(projectId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
      toast.success("Note deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete note");
    },
  });

  // Handler for filter changes - resets the query
  const handleSetFilters = useCallback((newFilters: NotesFilterViewModel) => {
    setFilters(newFilters);
  }, []);

  // Handler for fetching next page with error toast for infinite scroll failures
  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch((err) => {
        toast.error(err?.message || "Failed to load more notes");
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    // Data
    notes,
    hasNextPage: hasNextPage ?? false,
    
    // Loading states
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    
    // Filter state
    filters,
    
    // Functions
    setFilters: handleSetFilters,
    fetchNextPage: handleFetchNextPage,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
  };
}

