import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProjectsPage } from "./hooks/useProjectsPage";
import { ProjectsList } from "./ProjectsList";
import { PaginationControls } from "./PaginationControls";
import { ProjectFormModal } from "./ProjectFormModal";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Internal component that uses the hook
 */
function ProjectsPageContent() {
  const {
    projects,
    meta,
    isLoading,
    isError,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    modalState,
    handlePageChange,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    handleCloseModal,
    handleConfirmDelete,
    createProject,
    updateProject,
  } = useProjectsPage();

  // Full-page error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-destructive mb-4 text-2xl font-bold">Error Loading Projects</h2>
          <p className="text-muted-foreground mb-6">{error?.message || "An unexpected error occurred"}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your travel projects</p>
        </div>
        <Button onClick={handleCreateProject} size="default">
          <PlusIcon />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <ProjectsList
        projects={projects}
        isLoading={isLoading}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      {/* Pagination */}
      {!isLoading && projects.length > 0 && (
        <div className="mt-8">
          <PaginationControls meta={meta} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={modalState.type === "create_project" || modalState.type === "edit_project"}
        mode={modalState.type === "edit_project" ? "edit" : "create"}
        initialData={modalState.type === "edit_project" ? modalState.project : undefined}
        isLoading={isCreating || isUpdating}
        onSubmit={(formData) => {
          if (modalState.type === "edit_project") {
            updateProject({ projectId: modalState.project.id, command: formData });
          } else {
            createProject(formData);
          }
        }}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={modalState.type === "delete_project"}
        project={modalState.type === "delete_project" ? modalState.project : null}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseModal}
      />
    </div>
  );
}

/**
 * Main ProjectsPage component wrapped with QueryClientProvider
 */
export function ProjectsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectsPageContent />
    </QueryClientProvider>
  );
}
