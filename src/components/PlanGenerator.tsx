import { usePlanGenerator } from "./hooks/usePlanGenerator";
import { Button } from "./ui/button";
import { ScheduleDisplay } from "./ScheduleDisplay";
import { LoadingOverlay } from "./LoadingOverlay";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface PlanGeneratorProps {
  projectId: string;
}

export default function PlanGenerator({ projectId }: PlanGeneratorProps) {
  const { status, schedule, error, hasNotes, generatePlan } = usePlanGenerator({ projectId });
  const previousStatusRef = useRef(status);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";
  const isIdle = status === "idle";

  // Show success toast when plan generation completes
  useEffect(() => {
    if (status === "success" && previousStatusRef.current === "loading") {
      toast.success("Travel plan generated successfully!", {
        description: "Your personalized itinerary is ready.",
        duration: 4000,
      });
    }
    previousStatusRef.current = status;
  }, [status]);

  return (
    <div className="relative">
      <LoadingOverlay isLoading={isLoading} />

      {/* Error state - using simple div for now, will be replaced with Toast */}
      {isError && error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-1">Error</h3>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
            <Button onClick={generatePlan} variant="outline" size="sm" className="shrink-0">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Initial data load error */}
      {isError && !hasNotes && error?.includes("load project data") && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      )}

      {/* No notes state */}
      {(isIdle || isError) && !hasNotes && !error?.includes("load project data") && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground mb-4">Please add notes to your project to generate a plan</p>
          <Button disabled variant="outline">
            Generate Plan
          </Button>
        </div>
      )}

      {/* Generate button - shown when we have notes and not in error state from loading */}
      {hasNotes && !error?.includes("load project data") && (
        <div className="mb-8">
          <Button onClick={generatePlan} disabled={isLoading || !hasNotes} size="lg" className="w-full sm:w-auto">
            {isSuccess ? "Re-generate Plan" : "Generate Plan"}
          </Button>
        </div>
      )}

      {/* Display generated schedule */}
      {isSuccess && schedule && <ScheduleDisplay schedule={schedule} />}
    </div>
  );
}
