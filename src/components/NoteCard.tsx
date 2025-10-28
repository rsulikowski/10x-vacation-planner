import { MoreVertical, Edit, Trash2 } from "lucide-react";
import type { NoteDto } from "../types";
import { Card, CardContent, CardFooter } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface NoteCardProps {
  note: NoteDto;
  onEdit: (note: NoteDto) => void;
  onDelete: (note: NoteDto) => void;
}

/**
 * Priority badge styling based on priority level
 */
const getPriorityBadge = (priority: number) => {
  const badges = {
    1: { label: "High", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    2: { label: "Medium", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    3: { label: "Low", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  };
  
  const badge = badges[priority as keyof typeof badges] || badges[3];
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
      {badge.label}
    </span>
  );
};

/**
 * NoteCard component displays a single note with its content, priority, and tags.
 * Provides edit and delete actions via a dropdown menu.
 */
export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-1 pt-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>{getPriorityBadge(note.priority)}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 -mt-1 -mr-1"
                aria-label="Note actions"
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(note)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
          {note.content}
        </p>
      </CardContent>
      
      {note.place_tags && note.place_tags.length > 0 && (
        <CardFooter className="flex-wrap gap-1.5">
          {note.place_tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}

