import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import type { NotesFilterViewModel } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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

  const handlePlaceTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      place_tag: e.target.value,
    });
  };

  const priorityValue = localFilters.priority === null ? "all" : localFilters.priority.toString();

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

        {/* Place Tag Filter */}
        <div className="space-y-2">
          <Label htmlFor="place-tag-filter" className="text-sm font-medium">
            Place Tag
          </Label>
          <Input
            id="place-tag-filter"
            type="text"
            placeholder="Search by tag..."
            value={localFilters.place_tag}
            onChange={handlePlaceTagChange}
          />
        </div>
      </div>
    </div>
  );
}

