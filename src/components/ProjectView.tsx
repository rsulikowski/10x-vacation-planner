import { useState, useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlusIcon, ArrowLeftIcon, SparklesIcon } from "lucide-react";
import type { NoteDto, NoteModalState, CreateNoteCommand, UpdateNoteCommand } from "../types";
import { useProjectNotes } from "./hooks/useProjectNotes";
import { usePlan } from "./hooks/usePlan";
import { FilterControl } from "./FilterControl";
import { InfiniteScrollGrid } from "./InfiniteScrollGrid";
import { NoteModal } from "./NoteModal";
import { NoteDeleteDialog } from "./NoteDeleteDialog";
import { ScheduleDisplay } from "./ScheduleDisplay";
import { LoadingOverlay } from "./LoadingOverlay";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ProjectViewContentProps {
  projectId: string;
  projectName: string;
  durationDays: number;
}

/**
 * Internal component that uses the hooks
 */
function ProjectViewContent({ projectId, projectName, durationDays }: ProjectViewContentProps) {
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

  const {
    plan,
    isLoading: isPlanLoading,
    isGenerating,
    error: planError,
    fetchPlan,
    generatePlan,
  } = usePlan(projectId);

  const [modalState, setModalState] = useState<NoteModalState>({ type: "closed" });
  const [noteToDelete, setNoteToDelete] = useState<NoteDto | null>(null);
  const [activeTab, setActiveTab] = useState<string>("notes");

  // Fetch plan on mount
  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

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

  // Handle plan generation
  const handleGeneratePlan = useCallback(async () => {
    try {
      await generatePlan(notes, projectName, durationDays);
      toast.success("Travel plan generated successfully!", {
        description: "Your personalized itinerary is ready.",
        duration: 4000,
      });
      // Refresh the plan data
      await fetchPlan();
      // Switch to plan tab
      setActiveTab("plan");
    } catch (err) {
      toast.error("Failed to generate plan", {
        description: err instanceof Error ? err.message : "Please try again later",
        duration: 4000,
      });
    }
  }, [notes, projectName, durationDays, generatePlan, fetchPlan]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Loading overlay for plan generation */}
      <LoadingOverlay isLoading={isGenerating} />

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{projectName}</h1>
        <p className="text-muted-foreground mt-1">
          {durationDays} day{durationDays !== 1 ? "s" : ""} • Manage notes and generate travel plans
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="plan">Generated Plan</TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-0">
          {/* Header with action buttons */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Notes</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGeneratePlan} disabled={notes.length === 0 || isGenerating} variant="default">
                <SparklesIcon />
                {plan ? "Regenerate Plan" : "Generate Plan"}
              </Button>
              <Button onClick={handleCreateNote} size="default">
                <PlusIcon />
                Add Note
              </Button>
            </div>
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
        </TabsContent>

        {/* Plan Tab */}
        <TabsContent value="plan" className="mt-0">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Generated Plan</h2>
              {plan && (
                <p className="text-sm text-muted-foreground mt-1">
                  Generated {new Date(plan.createdOn).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button onClick={handleGeneratePlan} disabled={notes.length === 0 || isGenerating} variant="default">
              <SparklesIcon />
              Regenerate Plan
            </Button>
          </div>

          {/* Plan Error */}
          {planError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">Error</h3>
                  <p className="text-sm text-destructive/90">{planError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isPlanLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading plan...</p>
            </div>
          )}

          {/* No plan yet */}
          {!isPlanLoading && !plan && !planError && (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">No plan generated yet</p>
              <Button onClick={handleGeneratePlan} disabled={notes.length === 0} variant="outline">
                <SparklesIcon />
                Generate Your First Plan
              </Button>
            </div>
          )}

          {/* Display plan */}
          {!isPlanLoading && plan && <ScheduleDisplay schedule={plan.schedule} />}
        </TabsContent>
      </Tabs>

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

interface ProjectViewProps {
  projectId: string;
  projectName: string;
  durationDays: number;
}

/**
 * ProjectView component is the main container for project details with notes and plan tabs.
 * Wrapped with QueryClientProvider for React Query functionality.
 */
export function ProjectView({ projectId, projectName, durationDays }: ProjectViewProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectViewContent projectId={projectId} projectName={projectName} durationDays={durationDays} />
    </QueryClientProvider>
  );
}
