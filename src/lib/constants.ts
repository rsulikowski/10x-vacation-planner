/**
 * Application-wide constants
 */

/**
 * Available tags for categorizing notes
 * These tags help organize travel notes beyond just places
 */
export const NOTE_TAGS = [
  "place", // Location, destination, attraction
  "activity", // Things to do, experiences
  "food", // Restaurants, cafes, cuisine
  "accommodation", // Hotels, hostels, lodging
  "transportation", // How to get around, travel logistics
  "budget", // Cost-related information
  "for_who", // Suitable for (kids, couples, solo, etc.)
  "timing", // Best time to visit, opening hours
  "booking", // Reservations, tickets to book
  "culture", // Museums, history, local customs
  "nature", // Parks, beaches, outdoor activities
  "nightlife", // Bars, clubs, evening entertainment
  "shopping", // Markets, stores, souvenirs
] as const;

/**
 * Type for note tags
 */
export type NoteTag = (typeof NOTE_TAGS)[number];

/**
 * Human-readable labels for tags
 */
export const NOTE_TAG_LABELS: Record<NoteTag, string> = {
  place: "Place",
  activity: "Activity",
  food: "Food & Dining",
  accommodation: "Accommodation",
  transportation: "Transportation",
  budget: "Budget",
  for_who: "Suitable For",
  timing: "Timing",
  booking: "Booking Required",
  culture: "Culture",
  nature: "Nature",
  nightlife: "Nightlife",
  shopping: "Shopping",
};
