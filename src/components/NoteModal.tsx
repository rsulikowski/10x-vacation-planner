import { useState, useEffect } from "react";
import type { NoteDto, NoteFormViewModel, CreateNoteCommand, UpdateNoteCommand } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface NoteModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  note?: NoteDto;
  onSubmit: (data: CreateNoteCommand | UpdateNoteCommand) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const MAX_CONTENT_LENGTH = 300;

/**
 * NoteModal component provides a dialog for creating or editing notes.
 * Includes form validation and character limit enforcement (300 chars max).
 */
export function NoteModal({ isOpen, mode, note, onSubmit, onClose, isLoading = false }: NoteModalProps) {
  const [formData, setFormData] = useState<NoteFormViewModel>({
    content: "",
    priority: "",
    place_tags: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NoteFormViewModel, string>>>({});

  // Initialize form when modal opens or note changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && note) {
        setFormData({
          content: note.content,
          priority: note.priority.toString(),
          place_tags: note.place_tags?.join(", ") || "",
        });
      } else {
        setFormData({
          content: "",
          priority: "",
          place_tags: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, note]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NoteFormViewModel, string>> = {};

    // Validate content
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must not exceed ${MAX_CONTENT_LENGTH} characters`;
    }

    // Validate priority
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Transform form data to command
    const priority = parseInt(formData.priority, 10);
    const place_tags = formData.place_tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (mode === "edit") {
      const command: UpdateNoteCommand = {
        content: formData.content.trim(),
        priority,
        place_tags: place_tags.length > 0 ? place_tags : null,
      };
      onSubmit(command);
    } else {
      const command: CreateNoteCommand = {
        project_id: note?.project_id || "", // This will be overridden by the API
        content: formData.content.trim(),
        priority,
        place_tags: place_tags.length > 0 ? place_tags : null,
      };
      onSubmit(command);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Enforce max length
    if (value.length <= MAX_CONTENT_LENGTH) {
      setFormData({ ...formData, content: value });
      // Clear error if content becomes valid
      if (errors.content && value.trim()) {
        setErrors({ ...errors, content: undefined });
      }
    }
  };

  const handlePriorityChange = (value: string) => {
    setFormData({ ...formData, priority: value });
    // Clear error when priority is selected
    if (errors.priority) {
      setErrors({ ...errors, priority: undefined });
    }
  };

  const handlePlaceTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, place_tags: e.target.value });
  };

  const remainingChars = MAX_CONTENT_LENGTH - formData.content.length;
  const isFormValid = formData.content.trim() && formData.priority;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Note" : "Edit Note"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add details about a place or activity you want to include in your trip."
              : "Update the details of your note."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Content Field */}
            <div className="space-y-2">
              <Label htmlFor="note-content" className="text-sm font-medium">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="note-content"
                placeholder="Describe the place or activity..."
                value={formData.content}
                onChange={handleContentChange}
                aria-invalid={!!errors.content}
                aria-describedby={errors.content ? "content-error" : "content-hint"}
                rows={5}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between">
                <p id="content-hint" className="text-xs text-muted-foreground">
                  {errors.content ? (
                    <span id="content-error" className="text-destructive">
                      {errors.content}
                    </span>
                  ) : (
                    "Describe what you want to do or visit"
                  )}
                </p>
                <p
                  className={`text-xs ${
                    remainingChars < 50 ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"
                  }`}
                >
                  {remainingChars} / {MAX_CONTENT_LENGTH}
                </p>
              </div>
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <Label htmlFor="note-priority" className="text-sm font-medium">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.priority} onValueChange={handlePriorityChange} disabled={isLoading}>
                <SelectTrigger id="note-priority" aria-invalid={!!errors.priority}>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">High - Must see/do</SelectItem>
                  <SelectItem value="2">Medium - Would like to</SelectItem>
                  <SelectItem value="3">Low - If time permits</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-xs text-destructive">{errors.priority}</p>}
            </div>

            {/* Place Tags Field */}
            <div className="space-y-2">
              <Label htmlFor="note-tags" className="text-sm font-medium">
                Place Tags
              </Label>
              <Input
                id="note-tags"
                type="text"
                placeholder="Paris, Museums, Food (comma-separated)"
                value={formData.place_tags}
                onChange={handlePlaceTagsChange}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Add tags to categorize and filter your notes</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Saving..." : mode === "create" ? "Create Note" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
