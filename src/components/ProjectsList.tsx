import type { ProjectDto } from "../types";
import { ProjectListItem } from "./ProjectListItem";
import { FolderOpenIcon } from "lucide-react";

interface ProjectsListProps {
  projects: ProjectDto[];
  isLoading: boolean;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}

/**
 * Skeleton loader for project list items
 */
function ProjectListItemSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 h-6 w-3/4 rounded bg-muted"></div>
      <div className="mb-4 flex gap-4">
        <div className="h-4 w-24 rounded bg-muted"></div>
        <div className="h-4 w-32 rounded bg-muted"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded bg-muted"></div>
        <div className="h-8 w-24 rounded bg-muted"></div>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyStateView() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
      <FolderOpenIcon className="text-muted-foreground mb-4 size-16" />
      <h3 className="mb-2 text-xl font-semibold">No projects yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Get started by creating your first travel project. Click the "New Project" button above.
      </p>
    </div>
  );
}

/**
 * Component to display the list of projects
 */
export function ProjectsList({ projects, isLoading, onEdit, onDelete }: ProjectsListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <ProjectListItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return <EmptyStateView />;
  }

  // Projects list
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="projects-list">
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
