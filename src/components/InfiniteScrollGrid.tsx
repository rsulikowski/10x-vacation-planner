import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import type { NoteDto } from "../types";
import { NoteCard } from "./NoteCard";
import { Button } from "./ui/button";

interface InfiniteScrollGridProps {
  notes: NoteDto[];
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
  onLoadMore: () => void;
  onEdit: (note: NoteDto) => void;
  onDelete: (note: NoteDto) => void;
  onRetry?: () => void;
}

/**
 * InfiniteScrollGrid displays a grid of notes with infinite scroll functionality.
 * Uses IntersectionObserver to detect when the sentinel element is visible
 * and triggers loading the next page.
 */
export function InfiniteScrollGrid({
  notes,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  error,
  onLoadMore,
  onEdit,
  onDelete,
  onRetry,
}: InfiniteScrollGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px", // Start loading 200px before reaching the sentinel
        threshold: 0,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  // Initial loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoaderCircle className="size-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Error Loading Notes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error.message || "An unexpected error occurred"}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">No Notes Yet</h3>
          <p className="text-sm text-muted-foreground">
            Start adding notes to your project to plan your trip!
          </p>
        </div>
      </div>
    );
  }

  // Grid with notes
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <div className="text-center">
              <LoaderCircle className="size-6 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading more notes...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

