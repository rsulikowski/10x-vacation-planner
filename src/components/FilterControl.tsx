import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import type { NotesFilterViewModel } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { NOTE_TAGS, NOTE_TAG_LABELS } from "../lib/constants";

interface FilterControlProps {
  initialFilters: NotesFilterViewModel;
  onFilterChange: (filters: NotesFilterViewModel) => void;
}

/**
 * FilterControl component provides UI for filtering notes by priority and place tag.
 * Implements debouncing to prevent excessive API calls while typing.
 */
export function FilterControl({ initialFilters, onFilterChange }: FilterControlProps) {
  const [localFilters, setLocalFilters] = useState<NotesFilterViewModel>(initialFilters);

  // Debounce filter changes - wait 500ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(localFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters, onFilterChange]);

  const handlePriorityChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      priority: value === "all" ? null : parseInt(value, 10),
    });
  };

  const handlePlaceTagChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      place_tag: value === "all" ? "" : value,
    });
  };

  const priorityValue = localFilters.priority === null ? "all" : localFilters.priority.toString();
  const tagValue = localFilters.place_tag === "" ? "all" : localFilters.place_tag;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Filter Notes</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority Filter */}
        <div className="space-y-2">
          <Label htmlFor="priority-filter" className="text-sm font-medium">
            Priority
          </Label>
          <Select value={priorityValue} onValueChange={handlePriorityChange}>
            <SelectTrigger id="priority-filter">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="1">High priority</SelectItem>
              <SelectItem value="2">Medium priority</SelectItem>
              <SelectItem value="3">Low priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tag Filter */}
        <div className="space-y-2">
          <Label htmlFor="tag-filter" className="text-sm font-medium">
            Tag
          </Label>
          <Select value={tagValue} onValueChange={handlePlaceTagChange}>
            <SelectTrigger id="tag-filter">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {NOTE_TAGS.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {NOTE_TAG_LABELS[tag as keyof typeof NOTE_TAG_LABELS]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
