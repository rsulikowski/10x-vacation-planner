import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlusIcon, ArrowLeftIcon } from "lucide-react";
import type { NoteDto, NoteModalState, CreateNoteCommand, UpdateNoteCommand } from "../types";
import { useProjectNotes } from "./hooks/useProjectNotes";
import { FilterControl } from "./FilterControl";
import { InfiniteScrollGrid } from "./InfiniteScrollGrid";
import { NoteModal } from "./NoteModal";
import { NoteDeleteDialog } from "./NoteDeleteDialog";
import { Button } from "./ui/button";

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface NotesViewContentProps {
  projectId: string;
}

/**
 * Internal component that uses the useProjectNotes hook
 */
function NotesViewContent({ projectId }: NotesViewContentProps) {
  const {
    notes,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    isCreating,
    isUpdating,
    isDeleting,
    filters,
    setFilters,
    fetchNextPage,
    createNote,
    updateNote,
    deleteNote,
  } = useProjectNotes(projectId);

  const [modalState, setModalState] = useState<NoteModalState>({ type: "closed" });
  const [noteToDelete, setNoteToDelete] = useState<NoteDto | null>(null);

  // Modal handlers
  const handleCreateNote = useCallback(() => {
    setModalState({ type: "create_note" });
  }, []);

  const handleEditNote = useCallback((note: NoteDto) => {
    setModalState({ type: "edit_note", note });
  }, []);

  const handleDeleteNote = useCallback((note: NoteDto) => {
    setNoteToDelete(note);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ type: "closed" });
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setNoteToDelete(null);
  }, []);

  const handleSubmitNote = useCallback(
    (data: CreateNoteCommand | UpdateNoteCommand) => {
      if (modalState.type === "edit_note") {
        updateNote(
          { noteId: modalState.note.id, command: data as UpdateNoteCommand },
          {
            onSuccess: () => {
              setModalState({ type: "closed" });
            },
          }
        );
      } else {
        createNote(data as CreateNoteCommand, {
          onSuccess: () => {
            setModalState({ type: "closed" });
          },
        });
      }
    },
    [modalState, createNote, updateNote]
  );

  const handleConfirmDelete = useCallback(() => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id, {
        onSuccess: () => {
          setNoteToDelete(null);
        },
      });
    }
  }, [noteToDelete, deleteNote]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <a href="/projects">
            <ArrowLeftIcon />
            Back to Projects
          </a>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground mt-1">Manage your travel notes and ideas</p>
        </div>
        <Button onClick={handleCreateNote} size="default">
          <PlusIcon />
          Add Note
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterControl initialFilters={filters} onFilterChange={setFilters} />
      </div>

      {/* Notes Grid */}
      <InfiniteScrollGrid
        notes={notes}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        error={isError ? error : null}
        onLoadMore={fetchNextPage}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onRetry={() => window.location.reload()}
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={modalState.type === "create_note" || modalState.type === "edit_note"}
        mode={modalState.type === "edit_note" ? "edit" : "create"}
        note={modalState.type === "edit_note" ? modalState.note : undefined}
        isLoading={isCreating || isUpdating}
        onSubmit={handleSubmitNote}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Dialog */}
      <NoteDeleteDialog
        isOpen={noteToDelete !== null}
        note={noteToDelete}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
      />
    </div>
  );
}

interface NotesViewProps {
  projectId: string;
}

/**
 * NotesView component is the main container for the notes list feature.
 * Wrapped with QueryClientProvider for React Query functionality.
 */
export function NotesView({ projectId }: NotesViewProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NotesViewContent projectId={projectId} />
    </QueryClientProvider>
  );
}

