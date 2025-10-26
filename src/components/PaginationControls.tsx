import type { PaginationMetaDto } from "../types";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationControlsProps {
  meta: PaginationMetaDto;
  onPageChange: (newPage: number) => void;
}

/**
 * Component to render pagination controls
 */
export function PaginationControls({ meta, onPageChange }: PaginationControlsProps) {
  const { page, size, total } = meta;
  const totalPages = Math.ceil(total / size);

  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="default"
        onClick={() => onPageChange(page - 1)}
        disabled={isFirstPage}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
        Previous
      </Button>

      <div className="text-muted-foreground text-sm">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
        <span className="ml-2">({total} total)</span>
      </div>

      <Button
        variant="outline"
        size="default"
        onClick={() => onPageChange(page + 1)}
        disabled={isLastPage}
        aria-label="Next page"
      >
        Next
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

