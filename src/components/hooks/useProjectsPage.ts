import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ModalState, ProjectDto, CreateProjectCommand, UpdateProjectCommand } from "../../types";
import { fetchProjects, createProject, updateProject, deleteProject } from "../../lib/api/projects.api";

/**
 * Custom hook to manage Projects Page state and API interactions
 */
export function useProjectsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState<ModalState>({ type: "closed" });

  // Query for fetching projects
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects", { page: currentPage, size: 20 }],
    queryFn: () => fetchProjects(currentPage, 20),
  });

  // Mutation for creating a project
  const createProjectMutation = useMutation({
    mutationFn: (command: CreateProjectCommand) => createProject(command),
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
      setModalState({ type: "closed" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  // Mutation for updating a project
  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, command }: { projectId: string; command: UpdateProjectCommand }) =>
      updateProject(projectId, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
      setModalState({ type: "closed" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update project");
    },
  });

  // Mutation for deleting a project
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
      setModalState({ type: "closed" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  // Event handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCreateProject = () => {
    setModalState({ type: "create_project" });
  };

  const handleEditProject = (project: ProjectDto) => {
    setModalState({ type: "edit_project", project });
  };

  const handleDeleteProject = (project: ProjectDto) => {
    setModalState({ type: "delete_project", project });
  };

  const handleCloseModal = () => {
    setModalState({ type: "closed" });
  };

  const handleConfirmDelete = () => {
    if (modalState.type === "delete_project") {
      deleteProjectMutation.mutate(modalState.project.id);
    }
  };

  return {
    // Data
    projects: projectsData?.data || [],
    meta: projectsData?.meta || { page: 1, size: 20, total: 0 },

    // Loading states
    isLoading,
    isError,
    error,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,

    // Modal state
    modalState,

    // Event handlers
    handlePageChange,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    handleCloseModal,
    handleConfirmDelete,

    // Mutation functions
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
  };
}
