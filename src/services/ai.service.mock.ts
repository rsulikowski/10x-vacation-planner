import type { GeneratePlanCommand, PlanResponseDto, ScheduleItemDto } from "../types";

/**
 * Mock AI Service dla celów developmentu
 * Symuluje wywołanie API AI i zwraca przykładowy plan podróży
 */
export class MockAIService {
  /**
   * Symuluje opóźnienie API (200-1000ms)
   */
  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 800 + 200;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Generuje przykładowe aktywności na podstawie notatek i preferencji
   */
  private generateActivities(command: GeneratePlanCommand, day: number): string[] {
    const activities: string[] = [];
    const notes = command.notes.filter((n) => n.priority >= 2); // Priorytetowe notatki

    // Dodaj aktywności z notatek
    notes.slice(0, 3).forEach((note) => {
      const places = note.place_tags?.join(", ") || "atrakcja";
      activities.push(`${note.content} (${places})`);
    });

    // Dodaj aktywności z kategorii preferencji (jeśli podane)
    if (command.preferences?.categories) {
      command.preferences.categories.forEach((category, idx) => {
        if (idx < 2) {
          activities.push(`Wizyta w ${category} - dzień ${day}`);
        }
      });
    }

    // Dodaj podstawowe aktywności
    if (day === 1) {
      activities.push("Zameldowanie w hotelu i odpoczynek");
    }
    activities.push("Obiad w lokalnej restauracji");

    return activities.slice(0, 5); // Max 5 aktywności dziennie
  }

  /**
   * Generuje plan podróży na podstawie komendy
   * @param command - Komenda z parametrami generowania planu
   * @returns Plan podróży z harmonogramem
   */
  async generatePlan(command: GeneratePlanCommand): Promise<PlanResponseDto> {
    // Symuluj opóźnienie API
    await this.simulateDelay();

    // Symulacja błędu w 5% przypadków (do testowania obsługi błędów)
    if (Math.random() < 0.05) {
      throw new Error("AI Service Error: Timeout or rate limit exceeded");
    }

    // Określ liczbę dni na podstawie ilości notatek (domyślnie 3-7 dni)
    const durationDays = Math.min(Math.max(3, Math.floor(command.notes.length / 3)), 7);

    // Generuj harmonogram dla każdego dnia
    const schedule: ScheduleItemDto[] = [];
    for (let day = 1; day <= durationDays; day++) {
      schedule.push({
        day,
        activities: this.generateActivities(command, day),
      });
    }

    return {
      schedule,
    };
  }

  /**
   * Generuje opis promptu dla logowania
   */
  generatePrompt(command: GeneratePlanCommand): string {
    return JSON.stringify(
      {
        model: command.model,
        notes_count: command.notes.length,
        preferences: command.preferences || null,
        high_priority_notes: command.notes.filter((n) => n.priority === 3).length,
      },
      null,
      2
    );
  }
}

/**
 * Singleton instance AI service
 */
export const aiService = new MockAIService();
