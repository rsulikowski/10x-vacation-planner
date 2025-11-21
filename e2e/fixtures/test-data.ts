/**
 * Test data fixtures for E2E tests
 */

export const testUsers = {
  validUser: {
    email: "test@example.com",
    password: "TestPassword123!",
  },
  invalidUser: {
    email: "invalid@example.com",
    password: "wrongpassword",
  },
};

export const testProjects = {
  sampleProject: {
    name: "Summer Vacation 2025",
    description: "Trip to Europe",
    startDate: "2025-07-01",
    endDate: "2025-07-15",
  },
};

export const testNotes = {
  sampleNote: {
    title: "Eiffel Tower Visit",
    content: "Visit the Eiffel Tower at sunset",
    priority: "high" as const,
  },
};
