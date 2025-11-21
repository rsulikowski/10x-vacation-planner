# VacationPlanner

> A web application to save and manage free-form trip notes, organize them into travel projects, and generate AI-powered daily itineraries based on user preferences.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started Locally](#getting-started-locally)
3. [Available Scripts](#available-scripts)
4. [Project Scope](#project-scope)
5. [Project Status](#project-status)
6. [License](#license)

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, Shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth)
- **AI Integration:** GROQ (fast LLM inference with Llama models)
- **Testing:** Vitest + React Testing Library (unit/integration), Playwright (E2E)
- **CI/CD:** GitHub Actions
- **Hosting:** Docker on DigitalOcean

## Getting Started Locally

### Prerequisites

- Node.js v22.14.0 (see `.nvmrc`)
- npm (bundled with Node.js)
- Supabase project (URL & anon/public API key)
- GROQ API key (get it from https://console.groq.com)

### Setup

1. Clone this repository
   ```bash
   git clone https://github.com/your-org/vacation-planner.git
   cd vacation-planner
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Copy and configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env:
   # SUPABASE_URL=your_supabase_project_url
   # SUPABASE_KEY=your_supabase_anon_key
   # GROQ_API_KEY=your_groq_api_key
   ```
4. Start the development server
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000`

## CI/CD Pipeline

![CI/CD](https://github.com/YOUR_USERNAME/10x-vacation-planner/workflows/CI%2FCD%20Pipeline/badge.svg)

This project uses GitHub Actions for continuous integration and deployment:

- **Full CI/CD Pipeline** - Runs on push to `main` branch or manually
  - Linting (ESLint)
  - Unit tests (Vitest)
  - Production build (Astro)

- **Quick Check** - Runs on Pull Requests for fast feedback
  - Linting + Unit tests + Build (without E2E)

For detailed information about the CI/CD setup, see [docs/CI_CD_SETUP.md](docs/CI_CD_SETUP.md).

## Available Scripts

In the project root, you can run:

### Development

- `npm run dev`  
  Start Astro in development mode (hot reload).

- `npm run build`  
  Build the production-ready site.

- `npm run preview`  
  Preview the production build locally.

### Code Quality

- `npm run lint`  
  Run ESLint to check code quality.

- `npm run lint:fix`  
  Run ESLint and automatically fix issues.

- `npm run format`  
  Run Prettier to format code.

### Testing

- `npm run test`  
  Run unit tests in watch mode.

- `npm run test:run`  
  Run unit tests once.

- `npm run test:coverage`  
  Run unit tests with coverage report.

- `npm run test:e2e`  
  Run end-to-end tests with Playwright.

- `npm run test:e2e:ui`  
  Run E2E tests in interactive UI mode.

## API Endpoints

### POST /api/projects/{projectId}/plan

Synchroniczne generowanie planu podróży dla projektu.

**Request:**

```json
{
  "model": "claude-3.5-sonnet",
  "notes": [
    {
      "id": "uuid",
      "content": "string",
      "priority": 1-3,
      "place_tags": ["string"] | null
    }
  ],
  "preferences": {
    "categories": ["string"]
  }
}
```

**Response (200 OK):**

```json
{
  "schedule": [
    {
      "day": 1,
      "activities": ["activity 1", "activity 2", ...]
    }
  ]
}
```

**Dozwolone modele AI:**

- `gpt-4`, `gpt-5`
- `claude-3-opus`, `claude-3.5-sonnet`

**Testowanie:**  
Zobacz [.ai/postman-testing-guide.md](.ai/postman-testing-guide.md) dla szczegółowych instrukcji testowania w Postmanie.

## Project Scope

### Core Features

- **User Authentication**
  - Email/password registration with verification and expiring links
  - Password reset via email

- **User Profile & Preferences**
  - Save tourism preferences (e.g., beach, mountains)
  - Persist preferences for AI itinerary generation

- **Travel Project Management**
  - Create, read, update, delete travel projects (name, duration, date)
  - Switch between multiple projects

- **Notes & Inspiration**
  - CRUD notes with place/tag autocomplete, time tags, and priority

- **AI-Powered Itinerary Generation**
  - Single-request daily schedule generation (≤60s)
  - Loading spinner and retry on error
  - Logs AI interactions (prompt, response, status, timestamp)

- **Monthly Reports**
  - Summarize generated plans and usage statistics

### Boundaries & MVP Limitations

- No plan sharing between accounts
- No advanced media (images) or detailed logistics
- No admin panel or AI log retention
- No real-time monitoring/alerting for AI services

## Project Status

🚧 **MVP / Alpha** – Core features implemented; under active development.  
See [Issues](https://github.com/your-org/vacation-planner/issues) for roadmap and feature requests.

## License

> _No license specified._  
> Please add a `LICENSE` file to define the terms under which the project is released.
