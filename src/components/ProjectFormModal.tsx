import { useState, useEffect } from "react";
import type { ProjectDto, CreateProjectCommand, ProjectFormViewModel } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2Icon } from "lucide-react";

interface ProjectFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData?: ProjectDto;
  isLoading: boolean;
  onSubmit: (formData: CreateProjectCommand) => void;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  duration_days?: string;
  planned_date?: string;
}

/**
 * Modal dialog for creating or editing a project
 */
export function ProjectFormModal({ isOpen, mode, initialData, isLoading, onSubmit, onClose }: ProjectFormModalProps) {
  // Form state
  const [formData, setFormData] = useState<ProjectFormViewModel>({
    name: "",
    duration_days: "",
    planned_date: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData({
          name: initialData.name,
          duration_days: initialData.duration_days.toString(),
          planned_date: initialData.planned_date ? new Date(initialData.planned_date) : null,
        });
      } else {
        setFormData({
          name: "",
          duration_days: "",
          planned_date: null,
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate duration_days
    const duration = parseInt(formData.duration_days, 10);
    if (!formData.duration_days.trim()) {
      newErrors.duration_days = "Duration is required";
    } else if (isNaN(duration) || duration < 1) {
      newErrors.duration_days = "Duration must be at least 1 day";
    } else if (!Number.isInteger(duration)) {
      newErrors.duration_days = "Duration must be a whole number";
    }

    // Validate planned_date (optional, but if provided must be valid)
    // Date validation is handled by the input type="date"

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Transform ViewModel to Command
    const command: CreateProjectCommand = {
      name: formData.name.trim(),
      duration_days: parseInt(formData.duration_days, 10),
      planned_date: formData.planned_date
        ? formData.planned_date.toISOString().split("T")[0] // Format as YYYY-MM-DD
        : null,
    };

    onSubmit(command);
  };

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, duration_days: e.target.value });
    if (errors.duration_days) {
      setErrors({ ...errors, duration_days: undefined });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setFormData({
      ...formData,
      planned_date: dateValue ? new Date(dateValue) : null,
    });
    if (errors.planned_date) {
      setErrors({ ...errors, planned_date: undefined });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={!isLoading}>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Project" : "Edit Project"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new travel project to start planning your trip."
              : "Update the details of your travel project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name field */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g., Trip to Paris"
                aria-invalid={!!errors.name}
                disabled={isLoading}
                autoFocus
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            {/* Duration field */}
            <div className="grid gap-2">
              <Label htmlFor="duration_days">
                Duration (days) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="duration_days"
                type="number"
                min="1"
                step="1"
                value={formData.duration_days}
                onChange={handleDurationChange}
                placeholder="e.g., 7"
                aria-invalid={!!errors.duration_days}
                disabled={isLoading}
              />
              {errors.duration_days && <p className="text-destructive text-sm">{errors.duration_days}</p>}
            </div>

            {/* Planned date field */}
            <div className="grid gap-2">
              <Label htmlFor="planned_date">Planned Date (optional)</Label>
              <Input
                id="planned_date"
                type="date"
                value={formData.planned_date ? formData.planned_date.toISOString().split("T")[0] : ""}
                onChange={handleDateChange}
                aria-invalid={!!errors.planned_date}
                disabled={isLoading}
              />
              {errors.planned_date && <p className="text-destructive text-sm">{errors.planned_date}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2Icon className="animate-spin" />}
              {mode === "create" ? "Create Project" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
