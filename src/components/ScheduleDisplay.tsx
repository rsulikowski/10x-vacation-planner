import type { ScheduleItemDto } from "../types";

interface ScheduleDisplayProps {
  schedule: ScheduleItemDto[];
}

export function ScheduleDisplay({ schedule }: ScheduleDisplayProps) {
  // Handle empty or malformed schedule
  if (!schedule || schedule.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No schedule generated. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Travel Itinerary</h2>

      <div className="space-y-6">
        {schedule.map((scheduleItem) => (
          <div
            key={scheduleItem.day}
            className="border rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-4 text-primary">Day {scheduleItem.day}</h3>

            {scheduleItem.activities && scheduleItem.activities.length > 0 ? (
              <ul className="space-y-3">
                {scheduleItem.activities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-3 text-foreground">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1">{activity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No activities planned for this day</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
