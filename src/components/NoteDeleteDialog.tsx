import type { NoteDto } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Loader2Icon } from "lucide-react";

interface NoteDeleteDialogProps {
  isOpen: boolean;
  note: NoteDto | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation dialog for deleting a note
 */
export function NoteDeleteDialog({ isOpen, note, isLoading, onConfirm, onCancel }: NoteDeleteDialogProps) {
  // Truncate content for display (max 100 chars)
  const displayContent = note?.content
    ? note.content.length > 100
      ? note.content.substring(0, 100) + "..."
      : note.content
    : "";

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
            {note && (
              <span className="mt-2 block text-sm italic text-muted-foreground">&quot;{displayContent}&quot;</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading && <Loader2Icon className="animate-spin" />}
            Delete Note
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
