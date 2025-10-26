interface LoadingOverlayProps {
  isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      aria-busy="true"
      role="status"
    >
      <div className="bg-card p-8 rounded-lg shadow-lg border flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Loading message */}
        <div className="text-center">
          <p className="text-lg font-semibold mb-1">Generating your travel plan</p>
          <p className="text-sm text-muted-foreground">This may take a few moments...</p>
        </div>
      </div>
    </div>
  );
}
