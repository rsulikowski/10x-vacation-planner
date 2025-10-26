import type {
  CreateProjectCommand,
  ProjectDto,
  ProjectsListResponseDto,
  UpdateProjectCommand,
} from "../../types";

/**
 * API utility functions for projects endpoints
 */

/**
 * Fetch paginated list of projects
 */
export async function fetchProjects(page: number = 1, size: number = 20): Promise<ProjectsListResponseDto> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`/api/projects?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch projects" }));
    throw new Error(errorData.message || "Failed to fetch projects");
  }

  return response.json();
}

/**
 * Create a new project
 */
export async function createProject(command: CreateProjectCommand): Promise<ProjectDto> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to create project" }));
    throw new Error(errorData.message || "Failed to create project");
  }

  return response.json();
}

/**
 * Update an existing project
 */
export async function updateProject(projectId: string, command: UpdateProjectCommand): Promise<ProjectDto> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update project" }));
    throw new Error(errorData.message || "Failed to update project");
  }

  return response.json();
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to delete project" }));
    throw new Error(errorData.message || "Failed to delete project");
  }
}

