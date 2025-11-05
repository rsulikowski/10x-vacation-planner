# Product Requirements Document (PRD) - VacationPlanner

## 1. Product Overview

VacationPlanner is a web application that allows users to save and manage free-form notes about planned trips, group them into travel projects, and generate detailed trip plans using AI. Users define attraction priorities and planned dates, and the system automatically creates a daily schedule according to their preferences.

## 2. User Problem

Planning engaging and interesting trips is time-consuming and requires knowledge about destinations and time management. Users need a tool that transforms loose notes about locations and times into ready-made itineraries that consider priorities, group size, and travel preferences.

## 3. Functional Requirements

- Registration and login (email/password) with email verification, expiring links, and password reset capability
- Profile page with the ability to save user travel preferences
- CRUD operations for travel projects with metadata: name, approximate duration, planned date
- CRUD operations for notes within a project: free-form text with location tags, attraction priority
- Generate an AI plan in a single synchronous request, returning a daily schedule
- Display a spinner "Generating plan..." and handle errors with a clear message and a "Try Again" option
- Log AI interactions in a separate table (prompt, response, status, execution time)

## 4. Product Boundaries

- No sharing of plans between accounts
- No advanced multimedia support (e.g., images)
- No sophisticated logistics or time planning
- No admin panel in the MVP
- AI log retention is not required
- No service monitoring or alerting for AI failures
- No monthly summary reports of generated plans in a "My Reports" section

## 5. User Stories

- ID: US-001
  Title: Account Registration - not needed for MVP
  Description: As a new user, I want to register an account by providing email and password so that I can access the application
  Acceptance Criteria:
  - The form requires a valid email format and a minimum password length
  - The account is automatically activated

- ID: US-002
  Title: User Login
  Description: As a user, I want to log in with email and password so that I can use the application
  Acceptance Criteria:
  - Successful login redirects to the dashboard with projects
  - Failed login shows an invalid credentials message

- ID: US-003
  Title: User Logout
  Description: As a logged in user, I want to log out
  Acceptance Criteria:
  - Successful logout redirects to the landing page

- ID: US-004
  Title: Password Reset - not needed for MVP
  Description: As a user, I want to reset my password via email so that I can regain access
  Acceptance Criteria:
  - User provides the email associated with the account
  - A reset link with an expiration is sent via email
  - After changing the password, the user can log in with the new credentials

- ID: US-005
  Title: Save Travel Preferences - not needed for MVP
  Description: As a user, I want to define travel preferences in my profile so that AI can include them in plan generation
  Acceptance Criteria:
  - Ability to select preference categories (e.g., beach, mountains)
  - Preferences are saved and visible in the profile
  - Preferences are located in the profile view accessible in the top-right corner. In the same place user information can be updated

- ID: US-006
  Title: Create Travel Project
  Description: As a logged-in user, I want to create a new travel project by providing a name, approximate duration, and date so that I can group notes
  Acceptance Criteria:
  - The form requires name and duration
  - The new project appears in the main menu

- ID: US-007
  Title: Edit Travel Project
  Description: As a user, I want to edit project metadata to update information
  Acceptance Criteria:
  - Ability to update name, duration, and date
  - Changes are reflected in the project view

- ID: US-008
  Title: Delete Travel Project
  Description: As a user, I want to delete a project to remove outdated plans
  Acceptance Criteria:
  - A confirmation prompt is displayed
  - The project is removed from the list

- ID: US-009
  Title: Add Note
  Description: As a user, I want to add a note in a project with location tag and priority to gather inspirations
  Acceptance Criteria:
  - The new note appears in the project

- ID: US-010
  Title: Edit Note
  Description: As a user, I want to edit an existing note to correct content or tags
  Acceptance Criteria:
  - Ability to change content, tags, priority
  - Changes are saved

- ID: US-011
  Title: Delete Note
  Description: As a user, I want to delete a note to remove unnecessary information
  Acceptance Criteria:
  - A confirmation prompt is displayed
  - The note is removed from the list

- ID: US-012
  Title: Switch Between Projects
  Description: As a user, I want to switch between projects from the main menu to manage different trips
  Acceptance Criteria:
  - The project list is available in the menu
  - Selecting a project loads its notes

- ID: US-013
  Title: Generate Trip Plan
  Description: As a user, I want to generate a plan based on project notes to receive a detailed itinerary
  Acceptance Criteria:
  - The AI API returns the schedule within ≤60 seconds
  - UI shows a spinner "Generating plan..."
  - In case of an error, a message is displayed with a "Try Again" option

## 6. Success Metrics

- 75% of users generate at least 3 plans per year
- 90% of users fill in travel preferences in their profile
- AI response time ≤60 seconds
- Recording the status of plan generation attempts
