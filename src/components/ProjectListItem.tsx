import type { ProjectDto } from "../types";
import { Button } from "./ui/button";
import { EditIcon, TrashIcon, CalendarIcon, ClockIcon, StickyNoteIcon } from "lucide-react";

interface ProjectListItemProps {
  project: ProjectDto;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}

/**
 * Component to display a single project item
 */
export function ProjectListItem({ project, onEdit, onDelete }: ProjectListItemProps) {
  const formattedDate = project.planned_date
    ? new Date(project.planned_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date set";

  return (
    <div 
      className="border-border hover:border-primary/50 group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
      data-testid="project-list-item"
      data-project-id={project.id}
      data-project-name={project.name}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{project.name}</h3>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4" />
          <span>
            {project.duration_days} {project.duration_days === 1 ? "day" : "days"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="default" size="sm" asChild>
          <a href={`/projects/${project.id}/notes`}>
            <StickyNoteIcon />
            View Notes
          </a>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
          <EditIcon />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(project)}>
          <TrashIcon />
          Delete
        </Button>
      </div>
    </div>
  );
}
