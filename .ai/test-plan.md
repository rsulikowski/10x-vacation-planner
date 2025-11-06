Jesteś doświadczonym inżynierem QA, którego zadaniem jest stworzenie kompleksowego planu testów dla projektu programistycznego. Przeanalizuj poniższe informacje o projekcie:

<kod_projektu>
================================================
FILE: README.md
================================================
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

## Available Scripts

In the project root, you can run:

- `npm run dev`  
  Start Astro in development mode (hot reload).

- `npm run build`  
  Build the production-ready site.

- `npm run preview`  
  Preview the production build locally.

- `npm run astro`  
  Run any Astro CLI command (e.g., `npm run astro -- help`).

- `npm run lint`  
  Run ESLint to check code quality.

- `npm run lint:fix`  
  Run ESLint and automatically fix issues.

- `npm run format`  
  Run Prettier to format code.

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
Please add a `LICENSE` file to define the terms under which the project is released.



================================================
FILE: astro.config.mjs
================================================
// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), sitemap()],
  server: { port: 3000 },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({
    mode: "standalone",
  }),
});



================================================
FILE: components.json
================================================
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/global.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}



================================================
FILE: eslint.config.js
================================================
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

const baseConfig = tseslint.config({
  extends: [eslint.configs.recommended, tseslint.configs.strict, tseslint.configs.stylistic],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "off",
  },
});

const jsxA11yConfig = tseslint.config({
  files: ["**/*.{js,jsx,ts,tsx}"],
  extends: [jsxA11y.flatConfigs.recommended],
  languageOptions: {
    ...jsxA11y.flatConfigs.recommended.languageOptions,
  },
  rules: {
    ...jsxA11y.flatConfigs.recommended.rules,
  },
});

const reactConfig = tseslint.config({
  files: ["**/*.{js,jsx,ts,tsx}"],
  extends: [pluginReact.configs.flat.recommended],
  languageOptions: {
    ...pluginReact.configs.flat.recommended.languageOptions,
    globals: {
      window: true,
      document: true,
    },
  },
  plugins: {
    "react-hooks": eslintPluginReactHooks,
    "react-compiler": reactCompiler,
  },
  settings: { react: { version: "detect" } },
  rules: {
    ...eslintPluginReactHooks.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    "react-compiler/react-compiler": "error",
  },
});

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  baseConfig,
  jsxA11yConfig,
  reactConfig,
  eslintPluginAstro.configs["flat/recommended"],
  eslintPluginPrettier
);



================================================
FILE: package.json
================================================
{
  "name": "10x-vacation-planner",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@astrojs/node": "^9.4.3",
    "@astrojs/react": "^4.3.1",
    "@astrojs/sitemap": "^3.5.1",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-tabs": "^1.1.13",
    "@supabase/ssr": "^0.7.0",
    "@supabase/supabase-js": "^2.75.0",
    "@tailwindcss/vite": "^4.1.13",
    "@tanstack/react-query": "^5.90.5",
    "@types/react": "^19.1.12",
    "@types/react-dom": "^19.1.9",
    "ajv": "^8.17.1",
    "astro": "^5.13.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.487.0",
    "next-themes": "^0.4.6",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.1.13",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/compat": "1.2.7",
    "@eslint/js": "9.23.0",
    "@typescript-eslint/eslint-plugin": "8.28.0",
    "@typescript-eslint/parser": "8.28.0",
    "eslint": "9.23.0",
    "eslint-config-prettier": "10.1.1",
    "eslint-import-resolver-typescript": "4.2.5",
    "eslint-plugin-astro": "1.3.1",
    "eslint-plugin-import": "2.31.0",
    "eslint-plugin-jsx-a11y": "6.10.2",
    "eslint-plugin-prettier": "5.2.5",
    "eslint-plugin-react": "7.37.4",
    "eslint-plugin-react-compiler": "19.0.0-beta-aeaed83-20250323",
    "eslint-plugin-react-hooks": "5.2.0",
    "husky": "9.1.7",
    "lint-staged": "15.5.0",
    "prettier-plugin-astro": "0.14.1",
    "supabase": "^2.51.0",
    "tw-animate-css": "^1.4.0",
    "typescript-eslint": "8.28.0"
  },
  "lint-staged": {
    "*.{ts,tsx,astro}": [
      "eslint --fix"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}



================================================
FILE: tsconfig.json
================================================
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}



================================================
FILE: .env.example
================================================
SUPABASE_URL=###
SUPABASE_KEY=###
OPENROUTER_API_KEY=###


================================================
FILE: .nvmrc
================================================
22.14.0


================================================
FILE: .prettierrc.json
================================================
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "printWidth": 120,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}



================================================
FILE: .windsurfrules
================================================
# AI Rules for {{project-name}}

{{project-description}}

## Tech Stack

- Astro 5
- TypeScript 5
- React 19
- Tailwind 4
- Shadcn/ui

## Project Structure

When introducing changes to the project, always follow the directory structure below:

- `./src` - source code
- `./src/layouts` - Astro layouts
- `./src/pages` - Astro pages
- `./src/pages/api` - API endpoints
- `./src/middleware/index.ts` - Astro middleware
- `./src/db` - Supabase clients and types
- `./src/types.ts` - Shared types for backend and frontend (Entities, DTOs)
- `./src/components` - Client-side components written in Astro (static) and React (dynamic)
- `./src/components/ui` - Client-side components from Shadcn/ui
- `./src/lib` - Services and helpers
- `./src/assets` - static internal assets
- `./public` - public assets

When modifying the directory structure, always update this section.

## Coding practices

### Guidelines for clean code

- Use feedback from linters to improve the code when making changes.
- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Consider using custom error types or error factories for consistent error handling.

## Frontend

### General Guidelines

- Use Astro components (.astro) for static content and layout
- Implement framework components in React only when interactivity is needed

### Guidelines for Styling

#### Tailwind

- Use the @layer directive to organize styles into components, utilities, and base layers
- Use arbitrary values with square brackets (e.g., w-[123px]) for precise one-off designs
- Implement the Tailwind configuration file for customizing theme, plugins, and variants
- Leverage the theme() function in CSS for accessing Tailwind theme values
- Implement dark mode with the dark: variant
- Use responsive variants (sm:, md:, lg:, etc.) for adaptive designs
- Leverage state variants (hover:, focus-visible:, active:, etc.) for interactive elements

### Guidelines for Accessibility

#### ARIA Best Practices

- Use ARIA landmarks to identify regions of the page (main, navigation, search, etc.)
- Apply appropriate ARIA roles to custom interface elements that lack semantic HTML equivalents
- Set aria-expanded and aria-controls for expandable content like accordions and dropdowns
- Use aria-live regions with appropriate politeness settings for dynamic content updates
- Implement aria-hidden to hide decorative or duplicative content from screen readers
- Apply aria-label or aria-labelledby for elements without visible text labels
- Use aria-describedby to associate descriptive text with form inputs or complex elements
- Implement aria-current for indicating the current item in a set, navigation, or process
- Avoid redundant ARIA that duplicates the semantics of native HTML elements

### Guidelines for Astro

- Leverage View Transitions API for smooth page transitions (use ClientRouter)
- Use content collections with type safety for blog posts, documentation, etc.
- Leverage Server Endpoints for API routes
- Use POST, GET  - uppercase format for endpoint handlers
- Use `export const prerender = false` for API routes
- Use zod for input validation in API routes
- Extract logic into services in `src/lib/services`
- Implement middleware for request/response modification
- Use image optimization with the Astro Image integration
- Implement hybrid rendering with server-side rendering where needed
- Use Astro.cookies for server-side cookie management
- Leverage import.meta.env for environment variables

### Guidelines for React

- Use functional components with hooks instead of class components
- Never use "use client" and other Next.js directives as we use React with Astro
- Extract logic into custom hooks in `src/components/hooks`
- Implement React.memo() for expensive components that render often with the same props
- Utilize React.lazy() and Suspense for code-splitting and performance optimization
- Use the useCallback hook for event handlers passed to child components to prevent unnecessary re-renders
- Prefer useMemo for expensive calculations to avoid recomputation on every render
- Implement useId() for generating unique IDs for accessibility attributes
- Consider using the new useOptimistic hook for optimistic UI updates in forms
- Use useTransition for non-urgent state updates to keep the UI responsive

### Backend and Database

- Use Supabase for backend services, including authentication and database interactions.
- Follow Supabase guidelines for security and performance.
- Use Zod schemas to validate data exchanged with the backend.
- Use supabase from context.locals in Astro routes instead of importing supabaseClient directly
- Use SupabaseClient type from `src/db/supabase.client.ts`, not from `@supabase/supabase-js`


================================================
FILE: docs/GROQ_IMPLEMENTATION_SUMMARY.md
================================================
# GROQ Service Integration Summary

## ✅ Implementation Complete

The GROQ service has been successfully implemented according to the implementation plan. All core functionality is working with comprehensive error handling, retry logic, and type safety.

## 📦 Deliverables

### Core Implementation (3 files)
1. **`src/lib/groq.types.ts`** - Type definitions and interfaces
   - ChatRequest, ChatResponse types
   - JSON schema types
   - GROQ API payload structures
   - Service configuration types

2. **`src/lib/errors.ts`** - Custom error classes
   - ServiceError (base class)
   - NetworkError, AuthenticationError, RateLimitError
   - ValidationError, ApiError, ConfigurationError, TimeoutError
   - Utility functions for error handling

3. **`src/lib/groq.service.ts`** - Main service implementation
   - GROQService class with full functionality
   - Constructor with configuration validation
   - Public methods: sendChat, setApiKey, setDefaultModel, setDefaultParams, setTimeoutMs
   - Private methods: _buildPayload, _validateResponse, _request, _requestWithRetry
   - Error handling with retry logic (exponential backoff)
   - Request timeout support
   - JSON schema validation using AJV

### Testing & Documentation (5 files)
4. **`src/pages/api/test-groq.ts`** - REST API test endpoint
   - POST endpoint for testing GROQ service
   - Example schema and request handling
   - Comprehensive error handling

5. **`src/pages/test/groq.astro`** - Visual test interface
   - Interactive web UI for testing
   - Quick prompt buttons
   - Real-time results display
   - Error visualization

6. **`docs/GROQ_TESTING_GUIDE.md`** - Complete testing documentation
   - Environment setup instructions
   - Multiple testing methods (visual, cURL, PowerShell)
   - Troubleshooting guide
   - Integration examples

7. **`docs/GROQ_USAGE_EXAMPLES.md`** - Practical code examples
   - Basic usage patterns
   - Vacation planner use cases
   - Advanced patterns (multi-turn conversations, error handling)
   - TypeScript type examples

8. **`docs/GROQ_SERVICE_README.md`** - Quick start guide
   - Quick reference for getting started
   - Configuration examples
   - Feature overview
   - Next steps

### Integration Example (1 file)
9. **`src/services/ai.service.groq.ts`** - Real AI service implementation
   - Replaces mock AI service with GROQ integration
   - Generates travel itineraries based on user notes
   - Handles preferences and priorities
   - Fallback plan on error
   - Ready to use in production

## 🎯 Key Features Implemented

### ✅ From Implementation Plan - Steps 1-3 Completed

**Step 1: Types and Interfaces** ✅
- All type definitions created in `groq.types.ts`
- Full TypeScript coverage
- Generic type support for responses

**Step 2: Custom Error Classes** ✅
- 7 error types covering all scenarios
- Error utility functions (isRetryable, getRetryAfter)
- Proper error inheritance and structure

**Step 3: GROQService Implementation** ✅
- Constructor with validation
- All public methods implemented
- All private methods implemented
- Retry logic with exponential backoff
- Schema validation using AJV
- Request timeout support
- Comprehensive error handling

### Additional Deliverables (Beyond Plan)

**Testing Infrastructure** 🎁
- Visual test interface (better than unit tests for now)
- API test endpoint
- Multiple testing methods documented

**Documentation** 📚
- 3 comprehensive documentation files
- Quick start guide
- Usage examples with real-world scenarios
- Troubleshooting guide

**Production Integration** 🚀
- Real AI service implementation using GROQ
- Drop-in replacement for mock service
- Production-ready error handling

## 🧪 How to Test

### Method 1: Visual Interface (Recommended)
```bash
npm run dev
# Open browser to: http://localhost:4321/test/groq
```

### Method 2: API Endpoint
```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:4321/api/test-groq" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"prompt": "Tell me a short joke"}'
```

### Method 3: Code Integration
Replace mock service with GROQ service in your endpoints:
```typescript
// Old (mock)
import { aiService } from './services/ai.service.mock';

// New (GROQ)
import { aiService } from './services/ai.service.groq';
```

## 📊 Implementation Statistics

- **Total Files Created**: 9
- **Lines of Code**: ~1,500+
- **Type Coverage**: 100%
- **Error Scenarios Handled**: 7 types
- **Documentation Pages**: 3
- **Test Methods**: 3
- **Dependencies Added**: 1 (AJV)

## 🔧 Configuration

Environment variable already set up:
```env
GROQ_API_KEY=your_api_key_here
```

Default configuration:
- Base URL: `https://api.groq.com/openai/v1`
- Default Model: `gpt-4`
- Temperature: `0.8`
- Max Tokens: `1500`
- Timeout: `30000ms` (30 seconds)
- Max Retries: `3`

## 🚀 Next Steps (Your Choice)

### Option A: Test with Mock Data
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:4321/test/groq`
3. Try the test prompts
4. Verify API key works

### Option B: Integrate into Production
1. Replace mock AI service imports with GROQ service
2. Test plan generation with real data
3. Monitor token usage and costs
4. Adjust parameters as needed

### Option C: Extend Functionality
1. Add streaming support
2. Implement caching layer
3. Add more specialized prompts
4. Create additional AI features

## ✨ Code Quality

- ✅ No linter errors
- ✅ Full TypeScript typing
- ✅ Comprehensive error handling
- ✅ Early returns for guard clauses
- ✅ Clear separation of concerns
- ✅ Proper encapsulation
- ✅ Follows project coding standards
- ✅ Well-documented with JSDoc comments

## 📝 Notes

- Unit tests were **not** created per your request
- Visual testing interface provided instead
- All functionality is production-ready
- Error handling includes retry logic
- Schema validation ensures type safety
- Documentation covers all use cases

## 🎉 Status: READY FOR TESTING

The GROQ service is fully implemented and ready to test. Simply start your dev server and visit the test page!

---

**Need Help?** Check the documentation:
- Quick Start: `docs/GROQ_SERVICE_README.md`
- Testing Guide: `docs/GROQ_TESTING_GUIDE.md`
- Usage Examples: `docs/GROQ_USAGE_EXAMPLES.md`




================================================
FILE: docs/GROQ_SERVICE_README.md
================================================
# GROQ Service Implementation - Quick Start

## ✅ Implementation Complete

The GROQ service has been successfully implemented with full TypeScript support, comprehensive error handling, and automatic retry logic with exponential backoff.

## 📁 Files Created

### Core Service Files
- `src/lib/groq.types.ts` - TypeScript type definitions
- `src/lib/errors.ts` - Custom error classes
- `src/lib/groq.service.ts` - Main GROQ service implementation

### Testing & Documentation
- `src/pages/api/test-groq.ts` - API endpoint for testing
- `src/pages/test/groq.astro` - Visual test interface
- `docs/GROQ_TESTING_GUIDE.md` - Complete testing guide
- `docs/GROQ_USAGE_EXAMPLES.md` - Practical usage examples

## 🚀 Quick Start Guide

### 1. Environment Setup
Your `.env` file should already have:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Test the Service

#### Option A: Visual Interface (Easiest)
Open your browser and navigate to:
```
http://localhost:4321/test/groq
```

Click "Test GROQ Service" or try the quick prompt buttons!

#### Option B: API Endpoint
```bash
# PowerShell (Windows)
Invoke-RestMethod -Uri "http://localhost:4321/api/test-groq" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"prompt": "Tell me a short joke"}'

# cURL (Linux/Mac)
curl -X POST http://localhost:4321/api/test-groq \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me a short joke"}'
```

## 📖 Usage in Your Code

### Basic Example
```typescript
import { GROQService } from './lib/groq.service';

const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
});

const schema = {
  type: 'object',
  properties: {
    answer: { type: 'string' }
  },
  required: ['answer']
};

const result = await groq.sendChat({
  userMessage: 'What is the capital of France?',
  responseSchema: schema
});

console.log(result.data.answer); // "Paris"
```

### Vacation Planner Example
```typescript
import { GROQService } from './lib/groq.service';

const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  defaultModel: 'llama-3.3-70b-versatile',
});

const schema = {
  type: 'object',
  properties: {
    itinerary: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'number' },
          activities: { type: 'array', items: { type: 'string' } }
        },
        required: ['day', 'activities']
      }
    }
  },
  required: ['itinerary']
};

const result = await groq.sendChat({
  systemMessage: 'You are a travel planning assistant.',
  userMessage: 'Create a 3-day itinerary for Paris',
  responseSchema: schema,
  schemaName: 'TripItinerary'
});
```

## 🎯 Key Features

✅ **Type-Safe**: Full TypeScript support with generics  
✅ **Error Handling**: Custom error classes for different scenarios  
✅ **Auto Retry**: Exponential backoff for transient errors  
✅ **Schema Validation**: AJV-powered JSON schema validation  
✅ **Timeout Control**: Configurable request timeouts  
✅ **Flexible API**: Support for simple and complex chat formats  

## 🔧 Configuration

```typescript
const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  baseUrl: 'https://api.groq.com/openai/v1', // Optional
  defaultModel: 'llama-3.3-70b-versatile',    // Optional
  defaultParams: {                             // Optional
    temperature: 0.7,
    max_tokens: 2000
  }
});

// Update at runtime
groq.setTimeoutMs(60000);  // 60 seconds
groq.setDefaultModel('gpt-4');
groq.setDefaultParams({ temperature: 0.5 });
```

## 📚 Documentation

For detailed information:
- **Testing Guide**: `docs/GROQ_TESTING_GUIDE.md`
- **Usage Examples**: `docs/GROQ_USAGE_EXAMPLES.md`
- **Test Interface**: http://localhost:4321/test/groq

## 🐛 Troubleshooting

### 401 Authentication Error
- Check that `GROQ_API_KEY` is set in `.env`
- Restart dev server after changing environment variables

### 429 Rate Limit
- Service automatically retries with backoff
- Check your GROQ account for rate limits

### Validation Error
- Ensure JSON schema matches expected response
- Check schema examples in `docs/GROQ_USAGE_EXAMPLES.md`

### Network/Timeout Error
- Increase timeout: `groq.setTimeoutMs(60000)`
- Check network connection

## 🎓 Next Steps

1. ✅ Test the service using the visual interface
2. Review the usage examples for your specific use case
3. Integrate into your vacation planner features
4. Monitor token usage via `result.usage` property

## 📦 Dependencies

The following package was installed:
- `ajv` - JSON schema validation

## 🔒 Security Notes

- API key is stored securely in `.env` (gitignored)
- All requests use HTTPS
- API key is never logged or exposed
- Input validation prevents injection attacks

---

**Ready to test?** Visit http://localhost:4321/test/groq after starting your dev server!




================================================
FILE: docs/GROQ_TESTING_GUIDE.md
================================================
# GROQ Service Testing Guide

This guide provides instructions for testing the GROQ service implementation with your API key.

## Prerequisites

1. **GROQ API Key**: Already configured in your `.env` file as `GROQ_API_KEY`
2. **Dev Server**: Running on `http://localhost:4321`

## Environment Setup

Your `.env` file should contain:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key_here
```

## Testing Methods

### Method 1: Using the Test API Endpoint

We've created a test endpoint at `/api/test-groq` for easy testing.

#### 1. Start the dev server
```bash
npm run dev
```

#### 2. Test with cURL
```bash
# Simple test
curl -X POST http://localhost:4321/api/test-groq \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me a short joke"}'

# Custom prompt
curl -X POST http://localhost:4321/api/test-groq \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Plan a 3-day trip to Paris with top attractions"}'
```

#### 3. Test with PowerShell (Windows)
```powershell
# Simple test
Invoke-RestMethod -Uri "http://localhost:4321/api/test-groq" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"prompt": "Tell me a short joke"}'

# Custom prompt
Invoke-RestMethod -Uri "http://localhost:4321/api/test-groq" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"prompt": "Plan a 3-day trip to Paris"}'
```

#### 4. Test with a REST client (Postman, Insomnia, etc.)
- **Method**: POST
- **URL**: `http://localhost:4321/api/test-groq`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "prompt": "Tell me a short joke"
}
```

### Method 2: Create Your Own Test Endpoint

You can create custom endpoints using the GROQ service. Here's an example:

```typescript
// src/pages/api/your-endpoint.ts
import type { APIRoute } from 'astro';
import { GROQService } from '../../lib/groq.service';
import type { JSONSchema } from '../../lib/groq.types';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Initialize service
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  // Define your schema
  const schema: JSONSchema = {
    type: 'object',
    properties: {
      answer: { type: 'string' }
    },
    required: ['answer']
  };

  // Make request
  const result = await groq.sendChat({
    systemMessage: 'You are a helpful assistant.',
    userMessage: 'Your question here',
    responseSchema: schema
  });

  return new Response(JSON.stringify(result.data), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### Method 3: Create a Standalone Test Script

Create a file `test-groq.mjs` in your project root:

```javascript
// test-groq.mjs
import { GROQService } from './dist/server/chunks/groq.service.mjs';

async function testGroq() {
  const groq = new GROQService({
    apiKey: process.env.GROQ_API_KEY,
  });

  const schema = {
    type: 'object',
    properties: {
      answer: { type: 'string' }
    },
    required: ['answer']
  };

  try {
    const result = await groq.sendChat({
      systemMessage: 'You are a helpful assistant.',
      userMessage: 'Tell me a short joke',
      responseSchema: schema
    });
    
    console.log('Success:', result.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGroq();
```

Then run:
```bash
# First build the project
npm run build

# Then run the test
node test-groq.mjs
```

## Expected Response Format

Successful response:
```json
{
  "success": true,
  "data": {
    "response": "The AI's response to your prompt",
    "confidence": 0.95,
    "metadata": {
      "timestamp": "2025-11-01T12:00:00Z",
      "model": "gpt-4"
    }
  },
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 120,
    "total_tokens": 165
  },
  "message": "GROQ service test successful"
}
```

Error response:
```json
{
  "success": false,
  "error": "Error description",
  "details": {
    "name": "ValidationError",
    "message": "Response does not match expected schema"
  }
}
```

## Troubleshooting

### 401 Authentication Error
- Verify your `GROQ_API_KEY` is correctly set in `.env`
- Ensure the API key is valid and active
- Restart the dev server after changing environment variables

### 429 Rate Limit Error
- Wait a few moments before retrying
- The service will automatically retry with exponential backoff
- Check your GROQ account for rate limits

### Timeout Error
- Increase timeout: `groq.setTimeoutMs(60000)` for 60 seconds
- Check your network connection
- Try a simpler prompt

### Validation Error
- Ensure your JSON schema matches the expected response structure
- Check that all required fields are properly defined
- Verify the AI can generate responses in the requested format

## Integration Example: Using in Your App

Here's how to integrate GROQ service into your vacation planner:

```typescript
// src/services/ai.service.ts
import { GROQService } from '../lib/groq.service';
import type { JSONSchema } from '../lib/groq.types';

const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  defaultModel: 'llama-3.3-70b-versatile',
  defaultParams: {
    temperature: 0.7,
    max_tokens: 2000
  }
});

export async function generateItinerary(notes: string[], dates: string[]) {
  const schema: JSONSchema = {
    type: 'object',
    properties: {
      itinerary: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            activities: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['date', 'activities']
        }
      }
    },
    required: ['itinerary']
  };

  const result = await groq.sendChat({
    systemMessage: 'You are a travel planning assistant.',
    userMessage: `Create a detailed itinerary based on these notes: ${notes.join(', ')}`,
    responseSchema: schema,
    schemaName: 'TripItinerary'
  });

  return result.data;
}
```

## Available Models

Common GROQ-compatible models:
- `llama-3.3-70b-versatile` - Good balance of speed and quality
- `gpt-4` - High quality responses (if available)
- `gpt-3.5-turbo` - Faster, good for simpler tasks

Change the model:
```typescript
groq.setDefaultModel('llama-3.3-70b-versatile');
```

## Advanced Configuration

```typescript
const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  baseUrl: 'https://api.groq.com/openai/v1', // Custom base URL
  defaultModel: 'llama-3.3-70b-versatile',
  defaultParams: {
    temperature: 0.8,      // Creativity (0-1)
    max_tokens: 1500,      // Response length
    top_p: 0.9,            // Nucleus sampling
  }
});

// Update settings at runtime
groq.setTimeoutMs(60000);  // 60 second timeout
groq.setDefaultParams({ temperature: 0.5 });
```

## Next Steps

1. Test the basic endpoint to verify your API key works
2. Experiment with different prompts and schemas
3. Integrate the service into your vacation planner features
4. Monitor usage and adjust parameters for optimal results




================================================
FILE: docs/GROQ_USAGE_EXAMPLES.md
================================================
# GROQ Service Usage Examples

This document provides practical examples of using the GROQ service in different scenarios.

## Basic Usage

### Simple Question-Answer

```typescript
import { GROQService } from '../lib/groq.service';
import type { JSONSchema } from '../lib/groq.types';

const groq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
});

const schema: JSONSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' }
  },
  required: ['answer']
};

const result = await groq.sendChat({
  userMessage: 'What is the capital of France?',
  responseSchema: schema
});

console.log(result.data.answer); // "Paris"
```

### With System Message

```typescript
const result = await groq.sendChat({
  systemMessage: 'You are a travel expert specializing in European destinations.',
  userMessage: 'Recommend 3 must-visit places in Paris',
  responseSchema: {
    type: 'object',
    properties: {
      recommendations: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['recommendations']
  }
});
```

## Vacation Planner Use Cases

### 1. Generate Trip Itinerary

```typescript
import { GROQService } from '../lib/groq.service';

export async function generateItinerary(
  destination: string,
  days: number,
  notes: string[]
) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      days: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            day: { type: 'number' },
            date: { type: 'string' },
            activities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string' },
                  activity: { type: 'string' },
                  location: { type: 'string' },
                  duration: { type: 'string' },
                  notes: { type: 'string' }
                },
                required: ['time', 'activity', 'location']
              }
            }
          },
          required: ['day', 'activities']
        }
      }
    },
    required: ['title', 'days']
  };

  const result = await groq.sendChat({
    systemMessage: `You are an expert travel planner. Create detailed, realistic itineraries 
                   based on user preferences. Consider travel time between locations, 
                   opening hours, and logical daily flow.`,
    userMessage: `Create a ${days}-day itinerary for ${destination}. 
                 User notes: ${notes.join('; ')}`,
    responseSchema: schema,
    schemaName: 'TripItinerary'
  });

  return result.data;
}
```

### 2. Categorize Travel Notes

```typescript
export async function categorizeNote(noteText: string) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  const schema = {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['attraction', 'restaurant', 'hotel', 'activity', 'transport', 'general']
      },
      subcategory: { type: 'string' },
      priority: {
        type: 'string',
        enum: ['high', 'medium', 'low']
      },
      tags: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['category', 'priority', 'tags']
  };

  const result = await groq.sendChat({
    systemMessage: 'Analyze travel notes and categorize them accurately.',
    userMessage: `Categorize this travel note: "${noteText}"`,
    responseSchema: schema,
    schemaName: 'NoteCategory'
  });

  return result.data;
}
```

### 3. Suggest Attractions Based on Preferences

```typescript
export async function suggestAttractions(
  destination: string,
  preferences: string[]
) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
    defaultParams: {
      temperature: 0.7, // More creative suggestions
    }
  });

  const schema = {
    type: 'object',
    properties: {
      suggestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            matchReason: { type: 'string' },
            estimatedTime: { type: 'string' },
            bestTimeToVisit: { type: 'string' },
            costLevel: {
              type: 'string',
              enum: ['free', 'low', 'medium', 'high']
            }
          },
          required: ['name', 'description', 'matchReason']
        }
      }
    },
    required: ['suggestions']
  };

  const result = await groq.sendChat({
    systemMessage: 'You are a local travel expert who knows hidden gems.',
    userMessage: `Suggest 5 attractions in ${destination} for someone interested in: ${preferences.join(', ')}`,
    responseSchema: schema,
    schemaName: 'AttractionSuggestions',
    parameters: {
      max_tokens: 2000 // Override for longer responses
    }
  });

  return result.data.suggestions;
}
```

### 4. Optimize Daily Schedule

```typescript
export async function optimizeSchedule(activities: Activity[], travelDate: string) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  const schema = {
    type: 'object',
    properties: {
      optimizedSchedule: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            startTime: { type: 'string' },
            endTime: { type: 'string' },
            activity: { type: 'string' },
            location: { type: 'string' },
            travelTimeFromPrevious: { type: 'string' },
            reasoning: { type: 'string' }
          },
          required: ['startTime', 'endTime', 'activity', 'location']
        }
      },
      tips: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['optimizedSchedule']
  };

  const activitiesText = activities.map(a => 
    `${a.name} (priority: ${a.priority}, duration: ${a.estimatedDuration})`
  ).join('; ');

  const result = await groq.sendChat({
    systemMessage: `You are a travel optimizer. Arrange activities logically considering:
                   - Geographic proximity to minimize travel time
                   - Priority levels (high priority activities first)
                   - Realistic timing (avoid overloading a single day)
                   - Meal times and rest periods`,
    userMessage: `Optimize this schedule for ${travelDate}: ${activitiesText}`,
    responseSchema: schema,
    schemaName: 'OptimizedSchedule'
  });

  return result.data;
}
```

## Advanced Patterns

### Multi-Turn Conversation

```typescript
import type { ChatMessage } from '../lib/groq.types';

export class TravelPlannerConversation {
  private messages: ChatMessage[] = [];
  private groq: GROQService;

  constructor() {
    this.groq = new GROQService({
      apiKey: import.meta.env.GROQ_API_KEY,
    });

    // Add initial system message
    this.messages.push({
      role: 'system',
      content: 'You are a helpful travel planning assistant.'
    });
  }

  async ask(question: string) {
    // Add user message
    this.messages.push({
      role: 'user',
      content: question
    });

    const schema = {
      type: 'object',
      properties: {
        response: { type: 'string' }
      },
      required: ['response']
    };

    // Send entire conversation history
    const result = await this.groq.sendChat({
      messages: this.messages,
      responseSchema: schema
    });

    // Add assistant response to history
    this.messages.push({
      role: 'assistant',
      content: result.data.response
    });

    return result.data.response;
  }
}

// Usage:
const conversation = new TravelPlannerConversation();
await conversation.ask('I want to visit Japan');
await conversation.ask('What should I see in Tokyo?');
await conversation.ask('How many days should I spend there?');
```

### Error Handling

```typescript
import {
  ValidationError,
  RateLimitError,
  AuthenticationError,
  NetworkError,
  TimeoutError
} from '../lib/errors';

export async function robustGeneration(prompt: string, maxRetries = 3) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await groq.sendChat({
        userMessage: prompt,
        responseSchema: { /* your schema */ }
      });

      return { success: true, data: result.data };

    } catch (error) {
      if (error instanceof AuthenticationError) {
        // Don't retry auth errors
        return { 
          success: false, 
          error: 'Invalid API key. Please check your configuration.' 
        };
      }

      if (error instanceof ValidationError) {
        // Schema mismatch - adjust prompt or schema
        console.error('Validation failed:', error.validationErrors);
        return { 
          success: false, 
          error: 'AI response did not match expected format.' 
        };
      }

      if (error instanceof RateLimitError) {
        // Wait for rate limit to clear
        const waitTime = error.retryAfter || 60;
        console.log(`Rate limited. Waiting ${waitTime} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        attempt++;
        continue;
      }

      if (error instanceof NetworkError || error instanceof TimeoutError) {
        // Network issues - retry
        attempt++;
        if (attempt >= maxRetries) {
          return { 
            success: false, 
            error: 'Network error after multiple attempts.' 
          };
        }
        continue;
      }

      // Unknown error
      return { 
        success: false, 
        error: 'An unexpected error occurred.' 
      };
    }
  }

  return { success: false, error: 'Max retries exceeded.' };
}
```

### Custom Model Configuration

```typescript
// For faster responses with simpler tasks
const fastGroq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  defaultModel: 'gpt-3.5-turbo',
  defaultParams: {
    temperature: 0.3,
    max_tokens: 500
  }
});

// For complex travel planning
const detailedGroq = new GROQService({
  apiKey: import.meta.env.GROQ_API_KEY,
  defaultModel: 'llama-3.3-70b-versatile',
  defaultParams: {
    temperature: 0.7,
    max_tokens: 3000
  }
});
```

### Streaming (Future Enhancement)

Note: Current implementation doesn't support streaming, but you can process long content in chunks:

```typescript
export async function processLongItinerary(notes: string[]) {
  const groq = new GROQService({
    apiKey: import.meta.env.GROQ_API_KEY,
  });

  // Process in batches
  const batchSize = 10;
  const results = [];

  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize);
    
    const result = await groq.sendChat({
      userMessage: `Process these travel notes: ${batch.join('; ')}`,
      responseSchema: { /* schema */ }
    });

    results.push(result.data);
  }

  return results;
}
```

## Best Practices

1. **Always define strict schemas** - More specific schemas yield better results
2. **Use appropriate temperature** - Lower (0.3-0.5) for factual, higher (0.7-0.9) for creative
3. **Set reasonable token limits** - Balance between completeness and cost
4. **Handle errors gracefully** - Always catch and handle service errors
5. **Cache results** - Store generated itineraries to avoid redundant API calls
6. **Monitor usage** - Track token usage via `result.usage` property
7. **Test schemas** - Verify your JSON schemas work with sample data first

## TypeScript Types

```typescript
// Define your response types for type safety
interface ItineraryResponse {
  title: string;
  days: Array<{
    day: number;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
    }>;
  }>;
}

// Use with generics
const result = await groq.sendChat<ItineraryResponse>({
  userMessage: prompt,
  responseSchema: schema
});

// Now result.data is fully typed!
console.log(result.data.title); // TypeScript knows this exists
```




================================================
FILE: src/env.d.ts
================================================
/// <reference types="astro/client" />

import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "./db/supabase.client.ts";
import type { Database } from "./db/database.types.ts";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      user?: User;
    }
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly OPENROUTER_API_KEY: string;
  readonly GROQ_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}



================================================
FILE: src/types.ts
================================================
// Data Transfer Objects (DTOs) and Command Models for API
import type { Database } from "./db/database.types";

// --- User & Preferences ---
// Standalone preferences shape (not directly mapped to a table)
export interface PreferencesDto {
  categories: string[];
}

// Response DTO for user profile
export interface UserProfileDto {
  id: string;
  email: string;
  preferences: PreferencesDto;
}

// Command Model for updating user preferences
export interface UpdatePreferencesCommand {
  preferences: PreferencesDto;
}

// --- Pagination ---
export interface PaginationMetaDto {
  page: number;
  size: number;
  total: number;
}

export interface PaginatedDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}

// --- Projects ---
// Underlying Supabase-generated types
type ProjectRow = Database["public"]["Tables"]["travel_projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["travel_projects"]["Insert"];

// DTO for returning project info in lists
export type ProjectDto = Pick<ProjectRow, "id" | "name" | "duration_days" | "planned_date">;

// Command Model for creating a project (user_id is inferred from JWT, id/created_on are autogenerated)
export type CreateProjectCommand = Omit<ProjectInsert, "id" | "created_on" | "user_id">;

// Command Model for updating a project (all fields optional)
export type UpdateProjectCommand = Partial<CreateProjectCommand>;

// Paginated list response for projects
export type ProjectsListResponseDto = PaginatedDto<ProjectDto>;

// --- Notes ---
// Underlying Supabase-generated types
type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];

// DTO for a single note
export type NoteDto = NoteRow;

// Command Model for creating a note (id/updated_on autogenerated; project_id from path)
// Ensure priority is required
export type CreateNoteCommand = Omit<NoteInsert, "id" | "updated_on"> & Required<Pick<NoteInsert, "priority">>;

// Command Model for updating a note (all updatable fields optional)
export type UpdateNoteCommand = Partial<Omit<NoteInsert, "id" | "updated_on" | "project_id">>;

// Paginated list response for notes
export type NotesListResponseDto = PaginatedDto<NoteDto>;

// --- AI Plan Generation ---
// Schedule item returned by plan generation
export interface ScheduleItemDto {
  day: number;
  activities: string[];
}

// Command Model for generating a plan synchronously
export interface GeneratePlanCommand {
  model: string; // e.g. 'gpt-5'
  project_name: string; // Name of the travel project (destination/trip name)
  duration_days: number; // Number of days for the itinerary
  notes: {
    id: string;
    content: string;
    priority: number;
    place_tags: string[] | null;
  }[];
  preferences?: PreferencesDto;
}

// Response DTO for plan generation
export interface PlanResponseDto {
  schedule: ScheduleItemDto[];
}

// --- AI Logs ---
// Underlying Supabase-generated types
type AiLogRow = Database["public"]["Tables"]["ai_logs"]["Row"];
type AiLogInsert = Database["public"]["Tables"]["ai_logs"]["Insert"];

// DTO for a single AI log entry
export type AILogDto = Pick<
  AiLogRow,
  "id" | "project_id" | "prompt" | "response" | "status" | "duration_ms" | "version" | "created_on"
>;

// Paginated list response for AI logs
export type AILogsListResponseDto = PaginatedDto<AILogDto>;

// --- ViewModels ---
// ViewModel for project creation/edit form state
export interface ProjectFormViewModel {
  name: string;
  duration_days: string; // Use string for input flexibility, parse on submit
  planned_date: Date | null; // Use Date object for date picker components
}

// Discriminated union to manage modal state in Projects view
export type ModalState =
  | { type: "closed" }
  | { type: "create_project" }
  | { type: "edit_project"; project: ProjectDto }
  | { type: "delete_project"; project: ProjectDto };

// ViewModel for note creation/edit form state
export interface NoteFormViewModel {
  content: string;
  priority: string; // Stored as string from <select> value, e.g., "1"
  place_tags: string; // Comma-separated string for the input field
}

// ViewModel for notes filter state
export interface NotesFilterViewModel {
  priority: number | null;
  place_tag: string;
}

// Discriminated union to manage modal state in Notes view
export type NoteModalState = { type: "closed" } | { type: "create_note" } | { type: "edit_note"; note: NoteDto };

// --- End of DTOs and Command Models ---



================================================
FILE: src/components/DeleteConfirmationDialog.tsx
================================================
import type { ProjectDto } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Loader2Icon } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  project: ProjectDto | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation dialog for deleting a project
 */
export function DeleteConfirmationDialog({
  isOpen,
  project,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the project{" "}
            <span className="font-semibold text-foreground">"{project?.name}"</span>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading && <Loader2Icon className="animate-spin" />}
            Delete Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}



================================================
FILE: src/components/FilterControl.tsx
================================================
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import type { NotesFilterViewModel } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { NOTE_TAGS, NOTE_TAG_LABELS } from "../lib/constants";

interface FilterControlProps {
  initialFilters: NotesFilterViewModel;
  onFilterChange: (filters: NotesFilterViewModel) => void;
}

/**
 * FilterControl component provides UI for filtering notes by priority and place tag.
 * Implements debouncing to prevent excessive API calls while typing.
 */
export function FilterControl({ initialFilters, onFilterChange }: FilterControlProps) {
  const [localFilters, setLocalFilters] = useState<NotesFilterViewModel>(initialFilters);

  // Debounce filter changes - wait 500ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(localFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters, onFilterChange]);

  const handlePriorityChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      priority: value === "all" ? null : parseInt(value, 10),
    });
  };

  const handlePlaceTagChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      place_tag: value === "all" ? "" : value,
    });
  };

  const priorityValue = localFilters.priority === null ? "all" : localFilters.priority.toString();
  const tagValue = localFilters.place_tag === "" ? "all" : localFilters.place_tag;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Filter Notes</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority Filter */}
        <div className="space-y-2">
          <Label htmlFor="priority-filter" className="text-sm font-medium">
            Priority
          </Label>
          <Select value={priorityValue} onValueChange={handlePriorityChange}>
            <SelectTrigger id="priority-filter">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="1">High priority</SelectItem>
              <SelectItem value="2">Medium priority</SelectItem>
              <SelectItem value="3">Low priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tag Filter */}
        <div className="space-y-2">
          <Label htmlFor="tag-filter" className="text-sm font-medium">
            Tag
          </Label>
          <Select value={tagValue} onValueChange={handlePlaceTagChange}>
            <SelectTrigger id="tag-filter">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {NOTE_TAGS.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {NOTE_TAG_LABELS[tag as keyof typeof NOTE_TAG_LABELS]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}



================================================
FILE: src/components/InfiniteScrollGrid.tsx
================================================
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
          <p className="text-sm text-muted-foreground mb-4">{error.message || "An unexpected error occurred"}</p>
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
          <p className="text-sm text-muted-foreground">Start adding notes to your project to plan your trip!</p>
        </div>
      </div>
    );
  }

  // Grid with notes
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
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



================================================
FILE: src/components/LandingPage.astro
================================================
---
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MapPinIcon, NotebookIcon, SparklesIcon } from "lucide-react";
---

<div class="container mx-auto px-4 py-16">
  <!-- Hero Section -->
  <div class="text-center mb-16 space-y-6">
    <h1 class="text-5xl md:text-6xl font-bold tracking-tight">
      Plan Your Dream Vacation
    </h1>
    <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
      Save travel notes, organize your ideas, and generate personalized itineraries with AI-powered planning.
    </p>
    <div class="flex gap-4 justify-center mt-8">
      <Button size="lg" asChild>
        <a href="/auth/login">
          Get Started
        </a>
      </Button>
    </div>
  </div>

  <!-- Features Section -->
  <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
    <Card>
      <CardHeader>
        <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <NotebookIcon class="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Organize Your Notes</CardTitle>
        <CardDescription>
          Capture all your travel ideas, attractions, and must-see places in one organized space.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <MapPinIcon class="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Create Travel Projects</CardTitle>
        <CardDescription>
          Group your notes into projects for different destinations. Perfect for planning multiple trips.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <SparklesIcon class="h-6 w-6 text-primary" />
        </div>
        <CardTitle>AI-Powered Itineraries</CardTitle>
        <CardDescription>
          Generate detailed day-by-day schedules based on your preferences and priorities.
        </CardDescription>
      </CardHeader>
    </Card>
  </div>

  <!-- Call to Action -->
  <div class="text-center mt-16">
    <p class="text-muted-foreground mb-4">
      Ready to start planning your next adventure?
    </p>
    <Button variant="outline" size="lg" asChild>
      <a href="/auth/login">
        Sign In to Your Account
      </a>
    </Button>
  </div>
</div>




================================================
FILE: src/components/LoadingOverlay.tsx
================================================
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



================================================
FILE: src/components/NoteCard.tsx
================================================
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import type { NoteDto } from "../types";
import { Card, CardContent, CardFooter } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface NoteCardProps {
  note: NoteDto;
  onEdit: (note: NoteDto) => void;
  onDelete: (note: NoteDto) => void;
}

/**
 * Priority badge styling based on priority level
 */
const getPriorityBadge = (priority: number) => {
  const badges = {
    1: { label: "High", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    2: { label: "Medium", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    3: { label: "Low", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  };

  const badge = badges[priority as keyof typeof badges] || badges[3];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
      {badge.label}
    </span>
  );
};

/**
 * NoteCard component displays a single note with its content, priority, and tags.
 * Provides edit and delete actions via a dropdown menu.
 */
export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-1 pt-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>{getPriorityBadge(note.priority)}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 -mt-1 -mr-1" aria-label="Note actions">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(note)} className="text-destructive focus:text-destructive">
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-foreground whitespace-pre-wrap break-words">{note.content}</p>
      </CardContent>

      {note.place_tags && note.place_tags.length > 0 && (
        <CardFooter className="flex-wrap gap-1.5">
          {note.place_tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}



================================================
FILE: src/components/NoteDeleteDialog.tsx
================================================
import type { NoteDto } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Loader2Icon } from "lucide-react";

interface NoteDeleteDialogProps {
  isOpen: boolean;
  note: NoteDto | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation dialog for deleting a note
 */
export function NoteDeleteDialog({ isOpen, note, isLoading, onConfirm, onCancel }: NoteDeleteDialogProps) {
  // Truncate content for display (max 100 chars)
  const displayContent = note?.content
    ? note.content.length > 100
      ? note.content.substring(0, 100) + "..."
      : note.content
    : "";

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
            {note && <span className="mt-2 block text-sm italic text-muted-foreground">"{displayContent}"</span>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading && <Loader2Icon className="animate-spin" />}
            Delete Note
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}



================================================
FILE: src/components/NoteModal.tsx
================================================
import { useState, useEffect } from "react";
import type { NoteDto, NoteFormViewModel, CreateNoteCommand, UpdateNoteCommand } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { NOTE_TAGS, NOTE_TAG_LABELS } from "../lib/constants";
import { XIcon } from "lucide-react";

interface NoteModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  note?: NoteDto;
  onSubmit: (data: CreateNoteCommand | UpdateNoteCommand) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const MAX_CONTENT_LENGTH = 300;

/**
 * NoteModal component provides a dialog for creating or editing notes.
 * Includes form validation and character limit enforcement (300 chars max).
 */
export function NoteModal({ isOpen, mode, note, onSubmit, onClose, isLoading = false }: NoteModalProps) {
  const [formData, setFormData] = useState<NoteFormViewModel>({
    content: "",
    priority: "",
    place_tags: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof NoteFormViewModel, string>>>({});

  // Initialize form when modal opens or note changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && note) {
        setFormData({
          content: note.content,
          priority: note.priority.toString(),
          place_tags: note.place_tags?.join(", ") || "",
        });
        setSelectedTags(note.place_tags || []);
      } else {
        setFormData({
          content: "",
          priority: "",
          place_tags: "",
        });
        setSelectedTags([]);
      }
      setErrors({});
    }
  }, [isOpen, mode, note]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NoteFormViewModel, string>> = {};

    // Validate content
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must not exceed ${MAX_CONTENT_LENGTH} characters`;
    }

    // Validate priority
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Transform form data to command
    const priority = parseInt(formData.priority, 10);

    if (mode === "edit") {
      const command: UpdateNoteCommand = {
        content: formData.content.trim(),
        priority,
        place_tags: selectedTags.length > 0 ? selectedTags : null,
      };
      onSubmit(command);
    } else {
      const command: CreateNoteCommand = {
        project_id: note?.project_id || "", // This will be overridden by the API
        content: formData.content.trim(),
        priority,
        place_tags: selectedTags.length > 0 ? selectedTags : null,
      };
      onSubmit(command);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Enforce max length
    if (value.length <= MAX_CONTENT_LENGTH) {
      setFormData({ ...formData, content: value });
      // Clear error if content becomes valid
      if (errors.content && value.trim()) {
        setErrors({ ...errors, content: undefined });
      }
    }
  };

  const handlePriorityChange = (value: string) => {
    setFormData({ ...formData, priority: value });
    // Clear error when priority is selected
    if (errors.priority) {
      setErrors({ ...errors, priority: undefined });
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const remainingChars = MAX_CONTENT_LENGTH - formData.content.length;
  const isFormValid = formData.content.trim() && formData.priority;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Note" : "Edit Note"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add details about a place or activity you want to include in your trip."
              : "Update the details of your note."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Content Field */}
            <div className="space-y-2">
              <Label htmlFor="note-content" className="text-sm font-medium">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="note-content"
                placeholder="Describe the place or activity..."
                value={formData.content}
                onChange={handleContentChange}
                aria-invalid={!!errors.content}
                aria-describedby={errors.content ? "content-error" : "content-hint"}
                rows={5}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between">
                <p id="content-hint" className="text-xs text-muted-foreground">
                  {errors.content ? (
                    <span id="content-error" className="text-destructive">
                      {errors.content}
                    </span>
                  ) : (
                    "Describe what you want to do or visit"
                  )}
                </p>
                <p
                  className={`text-xs ${
                    remainingChars < 50 ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"
                  }`}
                >
                  {remainingChars} / {MAX_CONTENT_LENGTH}
                </p>
              </div>
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <Label htmlFor="note-priority" className="text-sm font-medium">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.priority} onValueChange={handlePriorityChange} disabled={isLoading}>
                <SelectTrigger id="note-priority" aria-invalid={!!errors.priority}>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">High - Must see/do</SelectItem>
                  <SelectItem value="2">Medium - Would like to</SelectItem>
                  <SelectItem value="3">Low - If time permits</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-xs text-destructive">{errors.priority}</p>}
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label htmlFor="note-tags" className="text-sm font-medium">
                Tags
              </Label>
              <div className="space-y-2">
                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                      >
                        {NOTE_TAG_LABELS[tag as keyof typeof NOTE_TAG_LABELS] || tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-primary/80"
                          aria-label={`Remove ${tag} tag`}
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Tag Selection Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 border rounded-md max-h-48 overflow-y-auto">
                  {NOTE_TAGS.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        disabled={isLoading}
                        className="rounded border-gray-300"
                      />
                      <span>{NOTE_TAG_LABELS[tag as keyof typeof NOTE_TAG_LABELS]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Select tags to categorize and organize your notes</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              {isLoading ? "Saving..." : mode === "create" ? "Create Note" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}



================================================
FILE: src/components/PaginationControls.tsx
================================================
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



================================================
FILE: src/components/ProjectFormModal.tsx
================================================
import { useState, useEffect } from "react";
import type { ProjectDto, CreateProjectCommand, ProjectFormViewModel } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2Icon } from "lucide-react";

interface ProjectFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData?: ProjectDto;
  isLoading: boolean;
  onSubmit: (formData: CreateProjectCommand) => void;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  duration_days?: string;
  planned_date?: string;
}

/**
 * Modal dialog for creating or editing a project
 */
export function ProjectFormModal({ isOpen, mode, initialData, isLoading, onSubmit, onClose }: ProjectFormModalProps) {
  // Form state
  const [formData, setFormData] = useState<ProjectFormViewModel>({
    name: "",
    duration_days: "",
    planned_date: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData({
          name: initialData.name,
          duration_days: initialData.duration_days.toString(),
          planned_date: initialData.planned_date ? new Date(initialData.planned_date) : null,
        });
      } else {
        setFormData({
          name: "",
          duration_days: "",
          planned_date: null,
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate duration_days
    const duration = parseInt(formData.duration_days, 10);
    if (!formData.duration_days.trim()) {
      newErrors.duration_days = "Duration is required";
    } else if (isNaN(duration) || duration < 1) {
      newErrors.duration_days = "Duration must be at least 1 day";
    } else if (!Number.isInteger(duration)) {
      newErrors.duration_days = "Duration must be a whole number";
    }

    // Validate planned_date (optional, but if provided must be valid)
    // Date validation is handled by the input type="date"

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Transform ViewModel to Command
    const command: CreateProjectCommand = {
      name: formData.name.trim(),
      duration_days: parseInt(formData.duration_days, 10),
      planned_date: formData.planned_date
        ? formData.planned_date.toISOString().split("T")[0] // Format as YYYY-MM-DD
        : null,
    };

    onSubmit(command);
  };

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, duration_days: e.target.value });
    if (errors.duration_days) {
      setErrors({ ...errors, duration_days: undefined });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setFormData({
      ...formData,
      planned_date: dateValue ? new Date(dateValue) : null,
    });
    if (errors.planned_date) {
      setErrors({ ...errors, planned_date: undefined });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={!isLoading}>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Project" : "Edit Project"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new travel project to start planning your trip."
              : "Update the details of your travel project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name field */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g., Trip to Paris"
                aria-invalid={!!errors.name}
                disabled={isLoading}
                autoFocus
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            {/* Duration field */}
            <div className="grid gap-2">
              <Label htmlFor="duration_days">
                Duration (days) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="duration_days"
                type="number"
                min="1"
                step="1"
                value={formData.duration_days}
                onChange={handleDurationChange}
                placeholder="e.g., 7"
                aria-invalid={!!errors.duration_days}
                disabled={isLoading}
              />
              {errors.duration_days && <p className="text-destructive text-sm">{errors.duration_days}</p>}
            </div>

            {/* Planned date field */}
            <div className="grid gap-2">
              <Label htmlFor="planned_date">Planned Date (optional)</Label>
              <Input
                id="planned_date"
                type="date"
                value={formData.planned_date ? formData.planned_date.toISOString().split("T")[0] : ""}
                onChange={handleDateChange}
                aria-invalid={!!errors.planned_date}
                disabled={isLoading}
              />
              {errors.planned_date && <p className="text-destructive text-sm">{errors.planned_date}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2Icon className="animate-spin" />}
              {mode === "create" ? "Create Project" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}



================================================
FILE: src/components/ProjectListItem.tsx
================================================
import type { ProjectDto } from "../types";
import { Button } from "./ui/button";
import { EditIcon, TrashIcon, CalendarIcon, ClockIcon, StickyNoteIcon } from "lucide-react";

interface ProjectListItemProps {
  project: ProjectDto;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}

/**
 * Component to display a single project item
 */
export function ProjectListItem({ project, onEdit, onDelete }: ProjectListItemProps) {
  const formattedDate = project.planned_date
    ? new Date(project.planned_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date set";

  return (
    <div className="border-border hover:border-primary/50 group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{project.name}</h3>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4" />
          <span>
            {project.duration_days} {project.duration_days === 1 ? "day" : "days"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="default" size="sm" asChild>
          <a href={`/projects/${project.id}/notes`}>
            <StickyNoteIcon />
            View Notes
          </a>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
          <EditIcon />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(project)}>
          <TrashIcon />
          Delete
        </Button>
      </div>
    </div>
  );
}



================================================
FILE: src/components/ProjectsList.tsx
================================================
import type { ProjectDto } from "../types";
import { ProjectListItem } from "./ProjectListItem";
import { FolderOpenIcon } from "lucide-react";

interface ProjectsListProps {
  projects: ProjectDto[];
  isLoading: boolean;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}

/**
 * Skeleton loader for project list items
 */
function ProjectListItemSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 h-6 w-3/4 rounded bg-muted"></div>
      <div className="mb-4 flex gap-4">
        <div className="h-4 w-24 rounded bg-muted"></div>
        <div className="h-4 w-32 rounded bg-muted"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded bg-muted"></div>
        <div className="h-8 w-24 rounded bg-muted"></div>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyStateView() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
      <FolderOpenIcon className="text-muted-foreground mb-4 size-16" />
      <h3 className="mb-2 text-xl font-semibold">No projects yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Get started by creating your first travel project. Click the "New Project" button above.
      </p>
    </div>
  );
}

/**
 * Component to display the list of projects
 */
export function ProjectsList({ projects, isLoading, onEdit, onDelete }: ProjectsListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <ProjectListItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return <EmptyStateView />;
  }

  // Projects list
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}



================================================
FILE: src/components/ProjectsPage.tsx
================================================
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProjectsPage } from "./hooks/useProjectsPage";
import { ProjectsList } from "./ProjectsList";
import { PaginationControls } from "./PaginationControls";
import { ProjectFormModal } from "./ProjectFormModal";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Internal component that uses the hook
 */
function ProjectsPageContent() {
  const {
    projects,
    meta,
    isLoading,
    isError,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    modalState,
    handlePageChange,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    handleCloseModal,
    handleConfirmDelete,
    createProject,
    updateProject,
  } = useProjectsPage();

  // Full-page error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-destructive mb-4 text-2xl font-bold">Error Loading Projects</h2>
          <p className="text-muted-foreground mb-6">{error?.message || "An unexpected error occurred"}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your travel projects</p>
        </div>
        <Button onClick={handleCreateProject} size="default">
          <PlusIcon />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <ProjectsList
        projects={projects}
        isLoading={isLoading}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      {/* Pagination */}
      {!isLoading && projects.length > 0 && (
        <div className="mt-8">
          <PaginationControls meta={meta} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={modalState.type === "create_project" || modalState.type === "edit_project"}
        mode={modalState.type === "edit_project" ? "edit" : "create"}
        initialData={modalState.type === "edit_project" ? modalState.project : undefined}
        isLoading={isCreating || isUpdating}
        onSubmit={(formData) => {
          if (modalState.type === "edit_project") {
            updateProject({ projectId: modalState.project.id, command: formData });
          } else {
            createProject(formData);
          }
        }}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={modalState.type === "delete_project"}
        project={modalState.type === "delete_project" ? modalState.project : null}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseModal}
      />
    </div>
  );
}

/**
 * Main ProjectsPage component wrapped with QueryClientProvider
 */
export function ProjectsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectsPageContent />
    </QueryClientProvider>
  );
}



================================================
FILE: src/components/ProjectView.tsx
================================================
import { useState, useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlusIcon, ArrowLeftIcon, SparklesIcon } from "lucide-react";
import type { NoteDto, NoteModalState, CreateNoteCommand, UpdateNoteCommand } from "../types";
import { useProjectNotes } from "./hooks/useProjectNotes";
import { usePlan } from "./hooks/usePlan";
import { FilterControl } from "./FilterControl";
import { InfiniteScrollGrid } from "./InfiniteScrollGrid";
import { NoteModal } from "./NoteModal";
import { NoteDeleteDialog } from "./NoteDeleteDialog";
import { ScheduleDisplay } from "./ScheduleDisplay";
import { LoadingOverlay } from "./LoadingOverlay";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ProjectViewContentProps {
  projectId: string;
  projectName: string;
  durationDays: number;
}

/**
 * Internal component that uses the hooks
 */
function ProjectViewContent({ projectId, projectName, durationDays }: ProjectViewContentProps) {
  const {
    notes,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    isCreating,
    isUpdating,
    isDeleting,
    filters,
    setFilters,
    fetchNextPage,
    createNote,
    updateNote,
    deleteNote,
  } = useProjectNotes(projectId);

  const { plan, isLoading: isPlanLoading, isGenerating, error: planError, fetchPlan, generatePlan } = usePlan(projectId);

  const [modalState, setModalState] = useState<NoteModalState>({ type: "closed" });
  const [noteToDelete, setNoteToDelete] = useState<NoteDto | null>(null);
  const [activeTab, setActiveTab] = useState<string>("notes");

  // Fetch plan on mount
  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  // Modal handlers
  const handleCreateNote = useCallback(() => {
    setModalState({ type: "create_note" });
  }, []);

  const handleEditNote = useCallback((note: NoteDto) => {
    setModalState({ type: "edit_note", note });
  }, []);

  const handleDeleteNote = useCallback((note: NoteDto) => {
    setNoteToDelete(note);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ type: "closed" });
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setNoteToDelete(null);
  }, []);

  const handleSubmitNote = useCallback(
    (data: CreateNoteCommand | UpdateNoteCommand) => {
      if (modalState.type === "edit_note") {
        updateNote(
          { noteId: modalState.note.id, command: data as UpdateNoteCommand },
          {
            onSuccess: () => {
              setModalState({ type: "closed" });
            },
          }
        );
      } else {
        createNote(data as CreateNoteCommand, {
          onSuccess: () => {
            setModalState({ type: "closed" });
          },
        });
      }
    },
    [modalState, createNote, updateNote]
  );

  const handleConfirmDelete = useCallback(() => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id, {
        onSuccess: () => {
          setNoteToDelete(null);
        },
      });
    }
  }, [noteToDelete, deleteNote]);

  // Handle plan generation
  const handleGeneratePlan = useCallback(async () => {
    try {
      await generatePlan(notes, projectName, durationDays);
      toast.success("Travel plan generated successfully!", {
        description: "Your personalized itinerary is ready.",
        duration: 4000,
      });
      // Refresh the plan data
      await fetchPlan();
      // Switch to plan tab
      setActiveTab("plan");
    } catch (err) {
      toast.error("Failed to generate plan", {
        description: err instanceof Error ? err.message : "Please try again later",
        duration: 4000,
      });
    }
  }, [notes, projectName, durationDays, generatePlan, fetchPlan]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Loading overlay for plan generation */}
      <LoadingOverlay isLoading={isGenerating} />

      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <a href="/projects">
            <ArrowLeftIcon />
            Back to Projects
          </a>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{projectName}</h1>
        <p className="text-muted-foreground mt-1">
          {durationDays} day{durationDays !== 1 ? 's' : ''} • Manage notes and generate travel plans
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="plan">Generated Plan</TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-0">
          {/* Header with action buttons */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Notes</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGeneratePlan} disabled={notes.length === 0 || isGenerating} variant="default">
                <SparklesIcon />
                {plan ? "Regenerate Plan" : "Generate Plan"}
              </Button>
              <Button onClick={handleCreateNote} size="default">
                <PlusIcon />
                Add Note
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <FilterControl initialFilters={filters} onFilterChange={setFilters} />
          </div>

          {/* Notes Grid */}
          <InfiniteScrollGrid
            notes={notes}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            error={isError ? error : null}
            onLoadMore={fetchNextPage}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onRetry={() => window.location.reload()}
          />
        </TabsContent>

        {/* Plan Tab */}
        <TabsContent value="plan" className="mt-0">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Generated Plan</h2>
              {plan && (
                <p className="text-sm text-muted-foreground mt-1">
                  Generated {new Date(plan.createdOn).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button onClick={handleGeneratePlan} disabled={notes.length === 0 || isGenerating} variant="default">
              <SparklesIcon />
              Regenerate Plan
            </Button>
          </div>

          {/* Plan Error */}
          {planError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">Error</h3>
                  <p className="text-sm text-destructive/90">{planError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isPlanLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading plan...</p>
            </div>
          )}

          {/* No plan yet */}
          {!isPlanLoading && !plan && !planError && (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">No plan generated yet</p>
              <Button onClick={handleGeneratePlan} disabled={notes.length === 0} variant="outline">
                <SparklesIcon />
                Generate Your First Plan
              </Button>
            </div>
          )}

          {/* Display plan */}
          {!isPlanLoading && plan && <ScheduleDisplay schedule={plan.schedule} />}
        </TabsContent>
      </Tabs>

      {/* Note Modal */}
      <NoteModal
        isOpen={modalState.type === "create_note" || modalState.type === "edit_note"}
        mode={modalState.type === "edit_note" ? "edit" : "create"}
        note={modalState.type === "edit_note" ? modalState.note : undefined}
        isLoading={isCreating || isUpdating}
        onSubmit={handleSubmitNote}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Dialog */}
      <NoteDeleteDialog
        isOpen={noteToDelete !== null}
        note={noteToDelete}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
      />
    </div>
  );
}

interface ProjectViewProps {
  projectId: string;
  projectName: string;
  durationDays: number;
}

/**
 * ProjectView component is the main container for project details with notes and plan tabs.
 * Wrapped with QueryClientProvider for React Query functionality.
 */
export function ProjectView({ projectId, projectName, durationDays }: ProjectViewProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectViewContent projectId={projectId} projectName={projectName} durationDays={durationDays} />
    </QueryClientProvider>
  );
}




================================================
FILE: src/components/ScheduleDisplay.tsx
================================================
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



================================================
FILE: src/components/ThemeToggle.tsx
================================================
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initialTheme = storedTheme || systemTheme;
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}




================================================
FILE: src/components/UserMenu.tsx
================================================
import { useState } from "react";
import { LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

interface UserMenuProps {
  userEmail: string;
}

export function UserMenu({ userEmail }: UserMenuProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout", {
        description: "Please try again",
      });
      setIsLoggingOut(false);
    }
  };

  // Get first letter of email for avatar
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9"
          aria-label="User menu"
        >
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{initial}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}




================================================
FILE: src/components/Welcome.astro
================================================
<div
  class="relative w-full mx-auto min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 sm:p-8"
>
  <div
    class="relative max-w-4xl mx-auto backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5 rounded-2xl shadow-2xl p-8 text-white border border-white/10"
  >
    <div class="space-y-8">
      <div class="text-center">
        <h1
          class="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-transparent bg-clip-text drop-shadow-lg"
        >
          Witaj w 10xDevs Astro Starter!
        </h1>
        <p class="text-xl text-blue-100/90 drop-shadow-md">
          Ten projekt został zbudowany w oparciu o nowoczesny stack technologiczny:
        </p>
      </div>

      <div class="flex flex-col gap-6 max-w-2xl mx-auto">
        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2
            class="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200"
          >
            Core
          </h2>
          <ul class="space-y-3">
            <li class="flex items-center space-x-3">
              <span class="font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-blue-200 shadow-sm">Astro v5.5.5</span>
              <span class="text-blue-100/90">- Metaframework do aplikacji webowych</span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-blue-200 shadow-sm">React v19</span>
              <span class="text-blue-100/90">- Biblioteka UI do komponentów interaktywnych</span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-blue-200 shadow-sm">TypeScript</span>
              <span class="text-blue-100/90">- Typowanie statyczne</span>
            </li>
          </ul>
        </div>

        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2
            class="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200"
          >
            Stylowanie
          </h2>
          <ul class="space-y-3">
            <li class="flex items-center space-x-3">
              <span class="font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-blue-200 shadow-sm"
                >Tailwind CSS v4</span
              >
              <span class="text-blue-100/90">- Utility-first CSS framework</span>
            </li>
          </ul>
        </div>

        <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2
            class="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200"
          >
            Statyczna analiza kodu
          </h2>
          <ul class="space-y-3">
            <li class="flex items-center space-x-3">
              <span class="font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-blue-200 shadow-sm">ESLint v9</span>
              <span class="text-blue-100/90">- Lintowanie kodu</span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-blue-200 shadow-sm">Prettier</span>
              <span class="text-blue-100/90">- Formatowanie kodu</span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="font-mono bg-blue-900/50 px-3 py-1.5 rounded-lg text-blue-200 shadow-sm"
                >Husky i Lint-staged</span
              >
              <span class="text-blue-100/90">- Automatyczna analiza kodu przed commitowaniem</span>
            </li>
          </ul>
        </div>
      </div>

      <p class="text-lg text-center text-blue-100/90 mt-8 leading-relaxed">
        Starter zawiera wszystko, czego potrzebujesz do rozpoczęcia tworzenia <br class="hidden sm:block" />
        <span class="font-semibold bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text"
          >nowoczesnych aplikacji webowych!</span
        >
      </p>
    </div>
  </div>
</div>



================================================
FILE: src/components/auth/LoginForm.tsx
================================================
import { useState, useCallback, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<keyof LoginFormData>>(new Set());

  // Validate individual field
  const validateField = useCallback((field: keyof LoginFormData, value: string): string | undefined => {
    switch (field) {
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Invalid email format";
        }
        return undefined;
      case "password":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        return undefined;
      default:
        return undefined;
    }
  }, []);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validateField("password", formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Handle input change
  const handleChange = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear general error when user types
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
    
    // Validate on change if field was previously touched
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [errors.general, touchedFields, validateField]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof LoginFormData) => {
    setTouchedFields((prev) => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, [formData, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouchedFields(new Set(["email", "password"]));
    
    // Validate form
    if (!validateForm()) {
      // Focus first invalid field
      const firstError = errors.email ? "email" : errors.password ? "password" : null;
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.focus();
      }
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // TODO: This will be implemented in the backend phase
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        
        if (response.status === 400) {
          setErrors({ general: "Invalid email or password format" });
        } else if (response.status === 401) {
          setErrors({ general: "Invalid credentials. Please try again." });
        } else if (response.status === 429) {
          setErrors({ general: "Too many login attempts. Please try again later." });
        } else {
          setErrors({ general: "An unexpected error occurred. Please try again later." });
        }
        return;
      }
      
      // Success - redirect to projects
      toast.success("Login successful!");
      window.location.href = "/projects";
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ 
        general: "Unable to connect. Please check your internet connection." 
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, errors]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your vacation plans
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* General error message */}
          {errors.general && (
            <div 
              className="p-3 bg-destructive/10 border border-destructive rounded-md"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}
          
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              disabled={isLoading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p 
                id="email-error" 
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
          
          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p 
                id="password-error" 
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}




================================================
FILE: src/components/hooks/usePlan.ts
================================================
import { useState, useCallback } from "react";
import type { ScheduleItemDto, NoteDto } from "../../types";

interface PlanData {
  schedule: ScheduleItemDto[];
  version: number;
  createdOn: string;
}

interface UsePlanReturn {
  plan: PlanData | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  fetchPlan: () => Promise<void>;
  generatePlan: (notes: NoteDto[], projectName: string, durationDays: number) => Promise<void>;
}

export function usePlan(projectId: string): UsePlanReturn {
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch existing plan for the project
   */
  const fetchPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/plan`);

      if (response.status === 404) {
        // No plan exists yet - this is expected
        setPlan(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch plan");
      }

      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plan");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  /**
   * Generate a new plan using AI
   */
  const generatePlan = useCallback(
    async (notes: NoteDto[], projectName: string, durationDays: number) => {
      if (notes.length === 0) {
        setError("Please add notes to your project before generating a plan");
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        // Prepare notes data for AI
        const notesData = notes.map((note) => ({
          id: note.id,
          content: note.content,
          priority: note.priority,
          place_tags: note.place_tags,
        }));

        // Call AI service
        const response = await fetch(`/api/projects/${projectId}/plan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            project_name: projectName,
            duration_days: durationDays,
            notes: notesData,
            preferences: {
              categories: [],
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to generate plan");
        }

      const data = await response.json();

      // Update plan with new data
      // Note: Version from response is used, or calculated from existing plans
      setPlan({
        schedule: data.schedule,
        version: data.version || (plan?.version || 0) + 1,
        createdOn: new Date().toISOString(),
      });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate plan");
        throw err; // Re-throw so caller can handle it
      } finally {
        setIsGenerating(false);
      }
    },
    [projectId, plan?.version]
  );

  return {
    plan,
    isLoading,
    isGenerating,
    error,
    fetchPlan,
    generatePlan,
  };
}




================================================
FILE: src/components/hooks/useProjectNotes.ts
================================================
import { useState, useEffect, useCallback } from "react";
import { useQueryClient, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { NoteDto, CreateNoteCommand, UpdateNoteCommand, NotesFilterViewModel } from "../../types";
import { fetchNotes, createNote, updateNote, deleteNote } from "../../lib/api/notes.api";

/**
 * Custom hook to manage Notes List state and API interactions
 */
export function useProjectNotes(projectId: string) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<NotesFilterViewModel>({
    priority: null,
    place_tag: "",
  });

  // Infinite query for fetching notes with pagination
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["notes", projectId, filters],
    queryFn: ({ pageParam = 1 }) => fetchNotes(projectId, pageParam, 20, filters.priority, filters.place_tag),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.page + 1;
      const totalPages = Math.ceil(lastPage.meta.total / lastPage.meta.size);
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages of notes into a single array
  const notes = data?.pages.flatMap((page) => page.data) || [];

  // Mutation for creating a note
  const createNoteMutation = useMutation({
    mutationFn: (command: CreateNoteCommand) => createNote(projectId, command),
    onSuccess: () => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
      toast.success("Note created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create note");
    },
  });

  // Mutation for updating a note
  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, command }: { noteId: string; command: UpdateNoteCommand }) =>
      updateNote(projectId, noteId, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
      toast.success("Note updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update note");
    },
  });

  // Mutation for deleting a note
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(projectId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", projectId] });
      toast.success("Note deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete note");
    },
  });

  // Handler for filter changes - resets the query
  const handleSetFilters = useCallback((newFilters: NotesFilterViewModel) => {
    setFilters(newFilters);
  }, []);

  // Handler for fetching next page with error toast for infinite scroll failures
  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch((err) => {
        toast.error(err?.message || "Failed to load more notes");
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    // Data
    notes,
    hasNextPage: hasNextPage ?? false,

    // Loading states
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,

    // Filter state
    filters,

    // Functions
    setFilters: handleSetFilters,
    fetchNextPage: handleFetchNextPage,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
  };
}



================================================
FILE: src/components/hooks/useProjectsPage.ts
================================================
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ModalState, ProjectDto, CreateProjectCommand, UpdateProjectCommand } from "../../types";
import { fetchProjects, createProject, updateProject, deleteProject } from "../../lib/api/projects.api";

/**
 * Custom hook to manage Projects Page state and API interactions
 */
export function useProjectsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState<ModalState>({ type: "closed" });

  // Query for fetching projects
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects", { page: currentPage, size: 20 }],
    queryFn: () => fetchProjects(currentPage, 20),
  });

  // Mutation for creating a project
  const createProjectMutation = useMutation({
    mutationFn: (command: CreateProjectCommand) => createProject(command),
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
      setModalState({ type: "closed" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  // Mutation for updating a project
  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, command }: { projectId: string; command: UpdateProjectCommand }) =>
      updateProject(projectId, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
      setModalState({ type: "closed" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update project");
    },
  });

  // Mutation for deleting a project
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
      setModalState({ type: "closed" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  // Event handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCreateProject = () => {
    setModalState({ type: "create_project" });
  };

  const handleEditProject = (project: ProjectDto) => {
    setModalState({ type: "edit_project", project });
  };

  const handleDeleteProject = (project: ProjectDto) => {
    setModalState({ type: "delete_project", project });
  };

  const handleCloseModal = () => {
    setModalState({ type: "closed" });
  };

  const handleConfirmDelete = () => {
    if (modalState.type === "delete_project") {
      deleteProjectMutation.mutate(modalState.project.id);
    }
  };

  return {
    // Data
    projects: projectsData?.data || [],
    meta: projectsData?.meta || { page: 1, size: 20, total: 0 },

    // Loading states
    isLoading,
    isError,
    error,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,

    // Modal state
    modalState,

    // Event handlers
    handlePageChange,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    handleCloseModal,
    handleConfirmDelete,

    // Mutation functions
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
  };
}



================================================
FILE: src/components/ui/alert-dialog.tsx
================================================
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal data-slot="alert-dialog-portal">
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};



================================================
FILE: src/components/ui/button.tsx
================================================
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };



================================================
FILE: src/components/ui/card.tsx
================================================
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };



================================================
FILE: src/components/ui/dialog.tsx
================================================
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};



================================================
FILE: src/components/ui/dropdown-menu.tsx
================================================
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-32 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};



================================================
FILE: src/components/ui/input.tsx
================================================
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };



================================================
FILE: src/components/ui/label.tsx
================================================
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };



================================================
FILE: src/components/ui/select.tsx
================================================
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-ring/50 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};



================================================
FILE: src/components/ui/sonner.tsx
================================================
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };



================================================
FILE: src/components/ui/tabs.tsx
================================================
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };




================================================
FILE: src/components/ui/textarea.tsx
================================================
import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-ring/50 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };



================================================
FILE: src/db/database.types.ts
================================================
[Binary file]


================================================
FILE: src/db/supabase.client.ts
================================================
import type { AstroCookies } from "astro";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import type { Database } from "./database.types.ts";

// Export SupabaseClient type for use in other files
export type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie configuration for Supabase Auth
 * These settings ensure secure, HTTP-only cookie-based authentication
 */
export const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

/**
 * Parse cookie header string into array of cookie objects
 * Required by Supabase SSR getAll() implementation
 */
function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  return cookieHeader.split(";").map((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

/**
 * Create Supabase Server Client for SSR
 * 
 * CRITICAL: This client uses the @supabase/ssr pattern with:
 * - getAll() and setAll() for cookie management (NEVER use get/set/remove individually)
 * - Server-side authentication with proper cookie handling
 * 
 * Usage:
 *   In middleware: const supabase = createSupabaseServerInstance({ headers, cookies })
 *   In API routes: const supabase = createSupabaseServerInstance({ headers: request.headers, cookies })
 *   In Astro pages: const supabase = createSupabaseServerInstance({ headers: Astro.request.headers, cookies: Astro.cookies })
 * 
 * @param context - Object containing headers and cookies from Astro context
 * @returns Configured Supabase client for server-side operations
 */
export const createSupabaseServerInstance = (context: {
  headers: Headers;
  cookies: AstroCookies;
}) => {
  const supabase = createServerClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return parseCookieHeader(context.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            context.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return supabase;
};



================================================
FILE: src/layouts/AuthLayout.astro
================================================
---
import "../styles/global.css";
import { ThemeToggle } from "../components/ThemeToggle";
import { Toaster } from "../components/ui/sonner";

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <title>{title}</title>
  </head>
  <body>
    <div class="fixed top-4 right-4 z-50">
      <ThemeToggle client:load />
    </div>
    <main class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <slot />
    </main>
    <Toaster client:load />
  </body>
</html>




================================================
FILE: src/layouts/Layout.astro
================================================
---
import "../styles/global.css";
import { Toaster } from "../components/ui/sonner";
import { ThemeToggle } from "../components/ThemeToggle";
import { UserMenu } from "../components/UserMenu";

interface Props {
  title?: string;
}

const { title = "VacationPlanner" } = Astro.props;

// Get authenticated user from middleware
const user = Astro.locals.user;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <script is:inline>
      // Initialize theme before page renders to prevent flash
      (function() {
        const storedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = storedTheme || systemTheme;
        
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body>
    <!-- Navigation Header -->
    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 flex h-16 items-center justify-between">
        <!-- Logo and Navigation -->
        <div class="flex items-center gap-6">
          <a href="/" class="flex items-center space-x-2">
            <span class="text-xl font-bold">VacationPlanner</span>
          </a>
          
          {user && (
            <nav class="hidden md:flex items-center gap-6">
              <a 
                href="/projects" 
                class="text-sm font-medium transition-colors hover:text-primary"
              >
                Projects
              </a>
            </nav>
          )}
        </div>

        <!-- Right side: Theme toggle and User menu -->
        <div class="flex items-center gap-2">
          <ThemeToggle client:load />
          {user && (
            <UserMenu userEmail={user.email} client:load />
          )}
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <slot />
    
    <Toaster client:load />
  </body>
</html>

<style>
  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
  }
</style>



================================================
FILE: src/lib/api-utils.ts
================================================
import type { APIContext } from "astro";
import { z } from "zod";

/**
 * Standardowa struktura odpowiedzi błędu API
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

/**
 * Class representing an API error with appropriate status code
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Tworzy odpowiedź JSON z błędem
 */
export function createErrorResponse(statusCode: number, error: string, message: string, details?: unknown): Response {
  const body: ApiErrorResponse = { error, message, details };
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Tworzy odpowiedź JSON z sukcesem
 */
export function createSuccessResponse<T>(data: T, statusCode = 200): Response {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Obsługuje błędy Zod i tworzy odpowiednią odpowiedź API
 */
export function handleZodError(error: z.ZodError): Response {
  return createErrorResponse(400, "Validation Error", "Invalid input data", error.errors);
}

/**
 * Główna funkcja obsługi błędów API
 */
export function handleApiError(error: unknown): Response {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return createErrorResponse(error.statusCode, "API Error", error.message, error.details);
  }

  if (error instanceof z.ZodError) {
    return handleZodError(error);
  }

  // Unexpected server error
  return createErrorResponse(500, "Internal Server Error", "An unexpected server error occurred");
}

/**
 * Pobiera i weryfikuje token JWT z nagłówka Authorization
 */
export function getAuthToken(context: APIContext): string {
  const authHeader = context.request.headers.get("Authorization");

  if (!authHeader) {
    throw new ApiError(401, "Missing authorization token");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new ApiError(401, "Invalid authorization token format");
  }

  return parts[1];
}

/**
 * Weryfikuje użytkownika i zwraca user_id
 */
export async function verifyUser(context: APIContext): Promise<string> {
  const token = getAuthToken(context);
  const supabase = context.locals.supabase;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new ApiError(401, "Invalid or expired authorization token");
  }

  return user.id;
}



================================================
FILE: src/lib/constants.ts
================================================
/**
 * Application-wide constants
 */

/**
 * Available tags for categorizing notes
 * These tags help organize travel notes beyond just places
 */
export const NOTE_TAGS = [
  "place",          // Location, destination, attraction
  "activity",       // Things to do, experiences
  "food",           // Restaurants, cafes, cuisine
  "accommodation",  // Hotels, hostels, lodging
  "transportation", // How to get around, travel logistics
  "budget",         // Cost-related information
  "for_who",        // Suitable for (kids, couples, solo, etc.)
  "timing",         // Best time to visit, opening hours
  "booking",        // Reservations, tickets to book
  "culture",        // Museums, history, local customs
  "nature",         // Parks, beaches, outdoor activities
  "nightlife",      // Bars, clubs, evening entertainment
  "shopping",       // Markets, stores, souvenirs
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




================================================
FILE: src/lib/errors.ts
================================================
/**
 * Custom Error Classes for Service Layer
 *
 * This file contains custom error classes for handling various
 * error scenarios across the application services.
 */

/**
 * Base error class for all service errors
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Network-related errors (timeouts, connection failures)
 */
export class NetworkError extends ServiceError {
  constructor(message: string, details?: unknown) {
    super(message, "NETWORK_ERROR", undefined, details);
  }
}

/**
 * Authentication and authorization errors (401, 403)
 */
export class AuthenticationError extends ServiceError {
  constructor(message: string, statusCode = 401, details?: unknown) {
    super(message, "AUTHENTICATION_ERROR", statusCode, details);
  }
}

/**
 * Rate limiting errors (429)
 */
export class RateLimitError extends ServiceError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    details?: unknown
  ) {
    super(message, "RATE_LIMIT_ERROR", 429, details);
  }
}

/**
 * Validation errors (schema validation, input validation)
 */
export class ValidationError extends ServiceError {
  constructor(
    message: string,
    public readonly validationErrors?: unknown[],
    details?: unknown
  ) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

/**
 * Generic API errors (4xx, 5xx)
 */
export class ApiError extends ServiceError {
  constructor(
    message: string,
    statusCode: number,
    public readonly responseBody?: unknown,
    details?: unknown
  ) {
    super(message, "API_ERROR", statusCode, details);
  }
}

/**
 * Configuration errors (missing required config, invalid config)
 */
export class ConfigurationError extends ServiceError {
  constructor(message: string, details?: unknown) {
    super(message, "CONFIGURATION_ERROR", undefined, details);
  }
}

/**
 * Timeout errors for long-running operations
 */
export class TimeoutError extends ServiceError {
  constructor(
    message: string,
    public readonly timeoutMs: number,
    details?: unknown
  ) {
    super(message, "TIMEOUT_ERROR", undefined, details);
  }
}

/**
 * Error handler utility to determine if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof TimeoutError) return true;
  if (error instanceof RateLimitError) return true;
  if (error instanceof ApiError && error.statusCode && error.statusCode >= 500) {
    return true;
  }
  return false;
}

/**
 * Extract retry-after value from error
 */
export function getRetryAfter(error: unknown): number | undefined {
  if (error instanceof RateLimitError) {
    return error.retryAfter;
  }
  return undefined;
}



================================================
FILE: src/lib/groq.service.ts
================================================
/**
 * GROQ Service
 *
 * Service class for interfacing with the GROQ API to perform
 * LLM-based chat operations with structured JSON response validation.
 */

import Ajv, { type ValidateFunction } from "ajv";
import type {
  ChatRequest,
  ChatResponse,
  GroqPayload,
  GroqServiceConfig,
  GroqApiResponse,
  ChatMessage,
  ResponseFormat,
  JSONSchema,
} from "./groq.types";
import {
  NetworkError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  ApiError,
  ConfigurationError,
  TimeoutError,
  isRetryableError,
  getRetryAfter,
} from "./errors";

/**
 * Default configuration values
 */
const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "gpt-4";
const DEFAULT_PARAMS = {
  temperature: 0.8,
  max_tokens: 1500,
};
const DEFAULT_TIMEOUT_MS = 30000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

/**
 * GROQService class for managing GROQ API interactions
 */
export class GROQService {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;
  private defaultParams: Record<string, unknown>;
  private ajv: Ajv;
  private timeoutMs: number;

  /**
   * Initialize GROQ service with configuration
   */
  constructor(config: GroqServiceConfig) {
    // Validate required configuration
    if (!config.apiKey || config.apiKey.trim() === "") {
      throw new ConfigurationError("API key is required and cannot be empty");
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
    this.defaultParams = config.defaultParams || DEFAULT_PARAMS;
    this.timeoutMs = DEFAULT_TIMEOUT_MS;

    // Initialize AJV for JSON schema validation
    this.ajv = new Ajv({
      strict: false,
      validateFormats: false,
      allErrors: true,
    });
  }

  /**
   * Send a chat request and receive a structured response
   */
  async sendChat<T = unknown>(request: ChatRequest): Promise<ChatResponse<T>> {
    // Validate request
    if (!request.userMessage && (!request.messages || request.messages.length === 0)) {
      throw new ValidationError("Either userMessage or messages array must be provided");
    }

    if (!request.responseSchema) {
      throw new ValidationError("Response schema is required for structured output");
    }

    // Build payload
    const payload = this._buildPayload(request);

    // Send request with retry logic
    const rawResponse = await this._requestWithRetry(payload);

    // Validate and extract response
    const validatedResponse = this._validateResponse<T>(rawResponse, request.responseSchema);

    return validatedResponse;
  }

  /**
   * Update the API key at runtime
   */
  setApiKey(key: string): void {
    if (!key || key.trim() === "") {
      throw new ConfigurationError("API key cannot be empty");
    }
    this.apiKey = key;
  }

  /**
   * Override the default model
   */
  setDefaultModel(modelName: string): void {
    if (!modelName || modelName.trim() === "") {
      throw new ConfigurationError("Model name cannot be empty");
    }
    this.defaultModel = modelName;
  }

  /**
   * Override the default parameters
   */
  setDefaultParams(params: Record<string, unknown>): void {
    this.defaultParams = { ...params };
  }

  /**
   * Set request timeout in milliseconds
   */
  setTimeoutMs(timeoutMs: number): void {
    if (timeoutMs <= 0) {
      throw new ConfigurationError("Timeout must be greater than 0");
    }
    this.timeoutMs = timeoutMs;
  }

  /**
   * Build the request payload for GROQ API
   */
  private _buildPayload(request: ChatRequest): GroqPayload {
    // Determine which model to use
    const model = request.model || this.defaultModel;

    // Build messages array
    let messages: ChatMessage[];
    if (request.messages && request.messages.length > 0) {
      // Use provided messages array
      messages = [...request.messages];
    } else {
      // Build from systemMessage and userMessage
      messages = [];
      if (request.systemMessage) {
        messages.push({
          role: "system",
          content: request.systemMessage,
        });
      }
      messages.push({
        role: "user",
        content: request.userMessage,
      });
    }

    // Merge parameters
    const parameters = {
      ...this.defaultParams,
      ...(request.parameters || {}),
    };

    // Build response format
    const responseFormat: ResponseFormat = {
      type: "json_schema",
      json_schema: {
        name: request.schemaName || "Response",
        strict: true,
        schema: request.responseSchema,
      },
    };

    // Construct the payload
    const payload: GroqPayload = {
      model,
      messages,
      response_format: responseFormat,
      ...parameters,
    };

    return payload;
  }

  /**
   * Validate API response against the provided JSON schema
   */
  private _validateResponse<T>(raw: unknown, schema: JSONSchema): ChatResponse<T> {
    // First, validate that we received a valid API response structure
    if (!raw || typeof raw !== "object") {
      throw new ValidationError("Invalid API response: expected an object", [], raw);
    }

    const apiResponse = raw as GroqApiResponse;

    // Extract the content from the API response
    if (!apiResponse.choices || apiResponse.choices.length === 0) {
      throw new ValidationError("Invalid API response: no choices returned", [], apiResponse);
    }

    const choice = apiResponse.choices[0];
    if (!choice.message || !choice.message.content) {
      throw new ValidationError("Invalid API response: no message content", [], apiResponse);
    }

    // Parse the JSON content
    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(choice.message.content);
    } catch (error) {
      throw new ValidationError("Failed to parse response content as JSON", [], {
        content: choice.message.content,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Validate against schema
    const validate: ValidateFunction = this.ajv.compile(schema);
    const valid = validate(parsedContent);

    if (!valid) {
      throw new ValidationError("Response does not match expected schema", validate.errors || [], {
        data: parsedContent,
        errors: validate.errors,
      });
    }

    // Return validated response
    return {
      data: parsedContent as T,
      raw: apiResponse,
      usage: apiResponse.usage,
    };
  }

  /**
   * Send HTTP request to GROQ API with retry logic
   */
  private async _requestWithRetry(payload: GroqPayload, attempt = 1): Promise<unknown> {
    try {
      return await this._request(payload);
    } catch (error) {
      // Check if error is retryable and we haven't exceeded max retries
      if (attempt >= MAX_RETRIES || !isRetryableError(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const retryAfter = getRetryAfter(error);
      const delay = retryAfter ? retryAfter * 1000 : INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);

      // Wait before retrying
      await this._sleep(delay);

      // Retry the request
      return this._requestWithRetry(payload, attempt + 1);
    }
  }

  /**
   * Send HTTP POST request to GROQ API
   */
  private async _request(payload: GroqPayload): Promise<unknown> {
    const url = `${this.baseUrl}/chat/completions`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        await this._handleHttpError(response);
      }

      // Parse and return JSON response
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort (timeout) errors
      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(`Request timed out after ${this.timeoutMs}ms`, this.timeoutMs);
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new NetworkError("Network request failed", { originalError: error });
      }

      // Re-throw if it's already our custom error
      if (
        error instanceof NetworkError ||
        error instanceof AuthenticationError ||
        error instanceof RateLimitError ||
        error instanceof ValidationError ||
        error instanceof ApiError
      ) {
        throw error;
      }

      // Wrap unknown errors
      throw new NetworkError("An unexpected error occurred during the request", {
        originalError: error,
      });
    }
  }

  /**
   * Handle HTTP error responses
   */
  private async _handleHttpError(response: Response): Promise<never> {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }

    const errorMessage = this._extractErrorMessage(errorBody);

    // Handle specific status codes
    switch (response.status) {
      case 401:
      case 403:
        throw new AuthenticationError(
          errorMessage || "Authentication failed. Please check your API key.",
          response.status,
          errorBody
        );

      case 429: {
        const retryAfter = this._extractRetryAfter(response);
        throw new RateLimitError(errorMessage || "Rate limit exceeded. Please try again later.", retryAfter, errorBody);
      }

      case 400:
        throw new ValidationError(errorMessage || "Invalid request parameters", [], errorBody);

      case 404:
        throw new ApiError(errorMessage || "Resource not found", 404, errorBody);

      default:
        throw new ApiError(
          errorMessage || `API request failed with status ${response.status}`,
          response.status,
          errorBody
        );
    }
  }

  /**
   * Extract error message from error response body
   */
  private _extractErrorMessage(errorBody: unknown): string | undefined {
    if (!errorBody || typeof errorBody !== "object") {
      return undefined;
    }

    const body = errorBody as Record<string, unknown>;

    // Try common error message fields
    if (typeof body.error === "string") {
      return body.error;
    }

    if (
      body.error &&
      typeof body.error === "object" &&
      "message" in body.error &&
      typeof body.error.message === "string"
    ) {
      return body.error.message;
    }

    if (typeof body.message === "string") {
      return body.message;
    }

    return undefined;
  }

  /**
   * Extract retry-after value from response headers
   */
  private _extractRetryAfter(response: Response): number | undefined {
    const retryAfterHeader = response.headers.get("Retry-After");
    if (!retryAfterHeader) {
      return undefined;
    }

    const retryAfter = parseInt(retryAfterHeader, 10);
    return isNaN(retryAfter) ? undefined : retryAfter;
  }

  /**
   * Sleep utility for retry delays
   */
  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}



================================================
FILE: src/lib/groq.types.ts
================================================
/**
 * GROQ Service Type Definitions
 *
 * This file contains all type definitions for the GROQ service,
 * including request/response types, payloads, and JSON schema definitions.
 */

/**
 * JSON Schema definition for structured response validation
 */
export interface JSONSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: unknown;
  [key: string]: unknown;
}

/**
 * Response format configuration for GROQ API
 */
export interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: JSONSchema;
  };
}

/**
 * Message role types for chat conversations
 */
export type MessageRole = "system" | "user" | "assistant";

/**
 * Individual chat message
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/**
 * Request object for chat completion
 */
export interface ChatRequest {
  systemMessage?: string;
  userMessage: string;
  messages?: ChatMessage[];
  model?: string;
  parameters?: Record<string, unknown>;
  responseSchema: JSONSchema;
  schemaName?: string;
}

/**
 * Response object from chat completion
 */
export interface ChatResponse<T = unknown> {
  data: T;
  raw: unknown;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * Internal payload structure for GROQ API requests
 */
export interface GroqPayload {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string | string[];
  response_format: ResponseFormat;
  [key: string]: unknown;
}

/**
 * Configuration options for GROQService
 */
export interface GroqServiceConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  defaultParams?: Record<string, unknown>;
}

/**
 * Raw API response structure from GROQ
 */
export interface GroqApiResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: {
    index?: number;
    message?: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}



================================================
FILE: src/lib/utils.ts
================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



================================================
FILE: src/lib/api/notes.api.ts
================================================
import type { CreateNoteCommand, NoteDto, NotesListResponseDto, UpdateNoteCommand } from "../../types";

/**
 * API utility functions for notes endpoints
 */

/**
 * Fetch paginated list of notes for a project
 */
export async function fetchNotes(
  projectId: string,
  page = 1,
  size = 20,
  priority?: number | null,
  place_tag?: string
): Promise<NotesListResponseDto> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (priority !== null && priority !== undefined) {
    params.append("priority", priority.toString());
  }

  if (place_tag && place_tag.trim()) {
    params.append("place_tag", place_tag.trim());
  }

  const response = await fetch(`/api/projects/${projectId}/notes?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch notes" }));
    throw new Error(errorData.message || "Failed to fetch notes");
  }

  return response.json();
}

/**
 * Create a new note for a project
 */
export async function createNote(projectId: string, command: CreateNoteCommand): Promise<NoteDto> {
  const response = await fetch(`/api/projects/${projectId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to create note" }));
    throw new Error(errorData.message || "Failed to create note");
  }

  return response.json();
}

/**
 * Update an existing note
 */
export async function updateNote(projectId: string, noteId: string, command: UpdateNoteCommand): Promise<NoteDto> {
  const response = await fetch(`/api/projects/${projectId}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update note" }));
    throw new Error(errorData.message || "Failed to update note");
  }

  return response.json();
}

/**
 * Delete a note
 */
export async function deleteNote(projectId: string, noteId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to delete note" }));
    throw new Error(errorData.message || "Failed to delete note");
  }
}



================================================
FILE: src/lib/api/projects.api.ts
================================================
import type { CreateProjectCommand, ProjectDto, ProjectsListResponseDto, UpdateProjectCommand } from "../../types";

/**
 * API utility functions for projects endpoints
 */

/**
 * Fetch paginated list of projects
 */
export async function fetchProjects(page = 1, size = 20): Promise<ProjectsListResponseDto> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`/api/projects?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch projects" }));
    throw new Error(errorData.message || "Failed to fetch projects");
  }

  return response.json();
}

/**
 * Create a new project
 */
export async function createProject(command: CreateProjectCommand): Promise<ProjectDto> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to create project" }));
    throw new Error(errorData.message || "Failed to create project");
  }

  return response.json();
}

/**
 * Update an existing project
 */
export async function updateProject(projectId: string, command: UpdateProjectCommand): Promise<ProjectDto> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update project" }));
    throw new Error(errorData.message || "Failed to update project");
  }

  return response.json();
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to delete project" }));
    throw new Error(errorData.message || "Failed to delete project");
  }
}



================================================
FILE: src/lib/schemas/auth.schema.ts
================================================
import { z } from "zod";

/**
 * Login validation schema
 * 
 * Validates user login credentials:
 * - Email: Must be valid email format
 * - Password: Required, minimum 1 character (backend validates with Supabase)
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

/**
 * Type inference for login data
 */
export type LoginInput = z.infer<typeof loginSchema>;




================================================
FILE: src/lib/schemas/note.schema.ts
================================================
import { z } from "zod";

/**
 * Schemat walidacji parametru projectId w URL
 */
export const projectIdParamSchema = z.string().uuid("Project ID must be a valid UUID");

/**
 * Schemat walidacji parametru noteId w URL
 */
export const noteIdParamSchema = z.string().uuid("Note ID must be a valid UUID");

/**
 * Schemat walidacji dla tworzenia notatki
 */
export const createNoteCommandSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  priority: z.number().int().min(1).max(3, "Priority must be between 1 and 3"),
  place_tags: z.array(z.string()).nullable().optional(),
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedCreateNoteCommand = z.infer<typeof createNoteCommandSchema>;

/**
 * Schemat walidacji dla aktualizacji notatki (wszystkie pola opcjonalne)
 */
export const updateNoteCommandSchema = z.object({
  content: z.string().min(1, "Content cannot be empty").optional(),
  priority: z.number().int().min(1).max(3, "Priority must be between 1 and 3").optional(),
  place_tags: z.array(z.string()).nullable().optional(),
});

/**
 * Typ wynikowy z walidacji schematu aktualizacji
 */
export type ValidatedUpdateNoteCommand = z.infer<typeof updateNoteCommandSchema>;

/**
 * Schemat walidacji dla parametrów zapytania listy notatek
 */
export const listNotesQuerySchema = z
  .object({
    page: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    priority: z.string().nullable().optional(),
    place_tag: z.string().nullable().optional(),
  })
  .transform((data) => {
    const priority = data.priority ? parseInt(data.priority, 10) : undefined;
    return {
      page: data.page ? parseInt(data.page, 10) : 1,
      size: data.size ? Math.min(parseInt(data.size, 10), 100) : 20,
      priority: priority !== undefined && priority >= 1 && priority <= 3 ? priority : undefined,
      place_tag: data.place_tag || undefined,
    };
  })
  .refine((data) => data.page >= 1, { message: "Page must be at least 1", path: ["page"] })
  .refine((data) => data.size >= 1, { message: "Size must be at least 1", path: ["size"] });

/**
 * Typ wynikowy z walidacji parametrów zapytania listy notatek
 */
export type ValidatedListNotesQuery = z.infer<typeof listNotesQuerySchema>;



================================================
FILE: src/lib/schemas/plan.schema.ts
================================================
import { z } from "zod";

/**
 * Schemat walidacji dla notatki w komendzie generowania planu
 */
const noteSchema = z.object({
  id: z.string().uuid("Note ID must be a valid UUID"),
  content: z.string().min(1, "Note content cannot be empty"),
  priority: z.number().int().min(1).max(3, "Priority must be a number between 1 and 3"),
  place_tags: z.array(z.string()).nullable(),
});

/**
 * Schemat walidacji dla preferencji użytkownika (opcjonalny)
 */
const preferencesSchema = z
  .object({
    categories: z.array(z.string().min(1)),
  })
  .optional();

/**
 * Whitelist dozwolonych modeli AI
 */
const ALLOWED_AI_MODELS = ["gpt-4", "gpt-4o-mini", "gpt-5", "claude-3-opus", "claude-3.5-sonnet", "openai/gpt-oss-20b"] as const;

/**
 * Schemat walidacji dla komendy generowania planu
 */
export const generatePlanCommandSchema = z.object({
  model: z.enum(ALLOWED_AI_MODELS, {
    errorMap: () => ({ message: `Model must be one of: ${ALLOWED_AI_MODELS.join(", ")}` }),
  }),
  project_name: z.string().min(1, "Project name cannot be empty").max(200, "Project name too long"),
  duration_days: z.number().int().min(1, "Duration must be at least 1 day").max(365, "Duration cannot exceed 365 days"),
  notes: z.array(noteSchema).min(1, "At least one note must be provided").max(100, "Maximum 100 notes allowed"),
  preferences: preferencesSchema,
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedGeneratePlanCommand = z.infer<typeof generatePlanCommandSchema>;

/**
 * Schemat walidacji parametru projectId w URL
 */
export const projectIdParamSchema = z.string().uuid("Project ID must be a valid UUID");



================================================
FILE: src/lib/schemas/project.schema.ts
================================================
import { z } from "zod";

/**
 * Schemat walidacji dla tworzenia projektu podróży
 */
export const createProjectCommandSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  duration_days: z.number().int().min(1, "Duration must be at least 1"),
  planned_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .nullable()
    .optional(),
});

/**
 * Typ wynikowy z walidacji schematu
 */
export type ValidatedCreateProjectCommand = z.infer<typeof createProjectCommandSchema>;

/**
 * Schemat walidacji dla parametrów zapytania paginacji
 */
export const listProjectsQuerySchema = z
  .object({
    page: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    sort: z.string().nullable().optional(),
    order: z.string().nullable().optional(),
  })
  .transform((data) => ({
    page: data.page ? parseInt(data.page, 10) : 1,
    size: data.size ? Math.min(parseInt(data.size, 10), 100) : 20,
    sort: (["created_on", "name", "duration_days", "planned_date"] as const).includes(data.sort as any)
      ? (data.sort as "created_on" | "name" | "duration_days" | "planned_date")
      : "created_on",
    order: data.order === "asc" || data.order === "desc" ? data.order : "desc",
  }))
  .refine((data) => data.page >= 1, { message: "Page must be at least 1", path: ["page"] })
  .refine((data) => data.size >= 1, { message: "Size must be at least 1", path: ["size"] });

/**
 * Typ wynikowy z walidacji parametrów zapytania
 */
export type ValidatedListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

/**
 * Schemat walidacji parametru projectId w URL
 */
export const projectIdParamSchema = z.string().uuid("Project ID must be a valid UUID");

/**
 * Schemat walidacji dla aktualizacji projektu (wszystkie pola opcjonalne)
 */
export const updateProjectCommandSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  duration_days: z.number().int().min(1, "Duration must be at least 1").optional(),
  planned_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .nullable()
    .optional(),
});

/**
 * Typ wynikowy z walidacji schematu aktualizacji
 */
export type ValidatedUpdateProjectCommand = z.infer<typeof updateProjectCommandSchema>;



================================================
FILE: src/middleware/index.ts
================================================
import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client.ts";

/**
 * Public paths that don't require authentication
 * Includes both server-rendered pages and API endpoints
 */
const PUBLIC_PATHS = [
  // Landing page
  "/",
  // Auth pages
  "/auth/login",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/logout",
];

/**
 * Authentication middleware
 * 
 * Responsibilities:
 * 1. Create Supabase server client for each request
 * 2. Verify user session from cookies
 * 3. Attach user to context.locals if authenticated
 * 4. Redirect unauthenticated users from protected routes
 * 5. Redirect authenticated users from auth pages
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, request, url, redirect } = context;

  // Create Supabase server client with proper SSR cookie handling
  const supabase = createSupabaseServerInstance({
    headers: request.headers,
    cookies,
  });

  // Attach Supabase client to context for use in routes
  context.locals.supabase = supabase;

  // IMPORTANT: Always get user session first before any other operations
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Attach user to context if authenticated
  if (user) {
    context.locals.user = user;
  }

  // Check if current path is public
  const pathname = url.pathname;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Define protected routes (routes that require authentication)
  const protectedRoutes = ["/projects"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Define auth routes (login, register, etc.)
  const authRoutes = ["/auth/login"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !user) {
    return redirect(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Redirect authenticated users from auth pages to projects
  if (isAuthRoute && user) {
    return redirect("/projects");
  }

  return next();
});



================================================
FILE: src/pages/index.astro
================================================
---
import LandingPage from "../components/LandingPage.astro";
import Layout from "../layouts/Layout.astro";

export const prerender = false;

// Check if user is authenticated
const user = Astro.locals.user;

// If authenticated, redirect to projects page
if (user) {
  return Astro.redirect("/projects");
}
---

<Layout title="VacationPlanner - Plan Your Dream Vacation">
  <LandingPage />
</Layout>



================================================
FILE: src/pages/api/auth/login.ts
================================================
import type { APIRoute } from "astro";
import { loginSchema } from "../../../lib/schemas/auth.schema.ts";
import { handleApiError, createSuccessResponse, ApiError } from "../../../lib/api-utils.ts";
import { createSupabaseServerInstance } from "../../../db/supabase.client.ts";

export const prerender = false;

/**
 * POST /api/auth/login
 * 
 * Authenticate user with email and password
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Success Response (200):
 * {
 *   "user": {
 *     "id": "uuid",
 *     "email": "user@example.com"
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error (invalid email format, missing fields)
 * - 401: Invalid credentials
 * - 500: Server error
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input with Zod schema
    const validatedData = loginSchema.parse(body);

    // Create Supabase server instance with cookie handling
    const supabase = createSupabaseServerInstance({
      headers: request.headers,
      cookies,
    });

    // Attempt to sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    // Handle authentication errors
    if (error) {
      console.error("Login error:", error);

      // Map Supabase errors to appropriate HTTP status codes
      if (error.message.includes("Invalid login credentials")) {
        throw new ApiError(401, "Invalid credentials. Please try again.");
      }

      if (error.message.includes("Email not confirmed")) {
        throw new ApiError(401, "Please confirm your email before logging in.");
      }

      // Generic authentication error
      throw new ApiError(401, "Authentication failed. Please check your credentials.");
    }

    // Check if user data exists
    if (!data.user) {
      throw new ApiError(401, "Authentication failed. Please try again.");
    }

    // Return success response with user data
    return createSuccessResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
};




================================================
FILE: src/pages/api/auth/logout.ts
================================================
import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse } from "../../../lib/api-utils.ts";
import { createSupabaseServerInstance } from "../../../db/supabase.client.ts";

export const prerender = false;

/**
 * POST /api/auth/logout
 * 
 * Sign out user and clear authentication cookies
 * 
 * Request Body: None (reads cookies automatically)
 * 
 * Success Response (200):
 * {
 *   "message": "Logout successful"
 * }
 * 
 * Error Responses:
 * - 500: Server error
 * 
 * Note: This endpoint succeeds even if user is not logged in (idempotent)
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Create Supabase server instance with cookie handling
    const supabase = createSupabaseServerInstance({
      headers: request.headers,
      cookies,
    });

    // Sign out user (this invalidates the session and clears cookies)
    const { error } = await supabase.auth.signOut();

    // Log error but don't fail the request
    // Logout should be idempotent - always succeed even if session is invalid
    if (error) {
      console.warn("Logout warning (non-critical):", error);
    }

    // Return success response
    return createSuccessResponse({
      message: "Logout successful",
    });
  } catch (error) {
    return handleApiError(error);
  }
};




================================================
FILE: src/pages/api/projects/index.ts
================================================
import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse, ApiError } from "../../../lib/api-utils";
import { createProjectCommandSchema, listProjectsQuerySchema } from "../../../lib/schemas/project.schema";
import { projectService } from "../../../services/project.service";

/**
 * GET /api/projects
 *
 * Endpoint do pobierania listy projektów użytkownika z paginacją.
 *
 * Query Parameters:
 * - page (integer, optional, default: 1)
 * - size (integer, optional, default: 20)
 * - sort (string, optional, default: "created_on")
 * - order (string, optional, default: "desc")
 *
 * Response 200:
 * {
 *   "data": [{ "id": "uuid", "name": "string", "duration_days": 5, "planned_date": "2026-03-15" }],
 *   "meta": { "page": 1, "size": 20, "total": 1 }
 * }
 *
 * Error Codes:
 * - 400: Invalid query parameters
 * - 401: User not authenticated
 * - 500: Server error or database error
 */
export const GET: APIRoute = async (context) => {
  try {
    // Get authenticated user from middleware
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const userId = user.id;

    // Parsowanie i walidacja parametrów zapytania
    const query = listProjectsQuerySchema.parse({
      page: context.url.searchParams.get("page"),
      size: context.url.searchParams.get("size"),
      sort: context.url.searchParams.get("sort"),
      order: context.url.searchParams.get("order"),
    });

    // Wywołanie serwisu do pobrania listy projektów
    const result = await projectService.listProjects(userId, query, context.locals.supabase);

    return createSuccessResponse(result, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * POST /api/projects
 *
 * Endpoint do tworzenia nowego projektu podróży dla użytkownika.
 *
 * Request Body:
 * {
 *   "name": "Trip to Paris",
 *   "duration_days": 5,
 *   "planned_date": "2026-03-15"  // opcjonalne
 * }
 *
 * Response 201:
 * {
 *   "id": "uuid",
 *   "name": "Trip to Paris",
 *   "duration_days": 5,
 *   "planned_date": "2026-03-15"
 * }
 *
 * Error Codes:
 * - 400: Invalid input data validation
 * - 401: User not authenticated
 * - 500: Server error or database error
 */
export const POST: APIRoute = async (context) => {
  try {
    // Get authenticated user from middleware
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const userId = user.id;

    // Krok 2: Parsowanie i walidacja JSON body
    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON format in request body");
    }

    // Krok 3: Walidacja danych wejściowych za pomocą Zod
    const command = createProjectCommandSchema.parse(body);

    // Krok 4: Wywołanie serwisu do utworzenia projektu
    const project = await projectService.createProject(userId, command, context.locals.supabase);

    // Krok 5: Zwrócenie odpowiedzi 201 Created
    return createSuccessResponse(project, 201);
  } catch (error) {
    // Obsługa wszystkich błędów przez centralny handler
    return handleApiError(error);
  }
};

export const prerender = false;



================================================
FILE: src/pages/api/projects/[projectId]/index.ts
================================================
import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse, ApiError } from "../../../../lib/api-utils";
import { projectIdParamSchema, updateProjectCommandSchema } from "../../../../lib/schemas/project.schema";
import { projectService } from "../../../../services/project.service";

/**
 * GET /api/projects/{projectId}
 *
 * Endpoint do pobierania pojedynczego projektu.
 *
 * Response 200:
 * {
 *   "id": "uuid",
 *   "name": "Trip to Paris",
 *   "duration_days": 5,
 *   "planned_date": "2026-03-15"
 * }
 *
 * Error Codes:
 * - 400: Invalid projectId UUID format
 * - 401: User not authenticated
 * - 404: Project not found or not owned by user
 * - 500: Server error or database error
 */
export const GET: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const project = await projectService.getProject(projectId, user.id, context.locals.supabase);
    return createSuccessResponse(project, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * PATCH /api/projects/{projectId}
 *
 * Endpoint do aktualizacji projektu (wszystkie pola opcjonalne).
 *
 * Request Body:
 * {
 *   "name": "Updated Trip Name",
 *   "duration_days": 7,
 *   "planned_date": "2026-04-01"
 * }
 *
 * Response 200: Updated project
 *
 * Error Codes:
 * - 400: Invalid input
 * - 401: User not authenticated
 * - 404: Project not found
 * - 500: Server error
 */
export const PATCH: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);

    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON format in request body");
    }

    const command = updateProjectCommandSchema.parse(body);
    const project = await projectService.updateProject(projectId, user.id, command, context.locals.supabase);
    return createSuccessResponse(project, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * DELETE /api/projects/{projectId}
 *
 * Endpoint do usuwania projektu.
 *
 * Response 204: No content
 *
 * Error Codes:
 * - 400: Invalid projectId
 * - 401: User not authenticated
 * - 404: Project not found
 * - 500: Server error
 */
export const DELETE: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    await projectService.deleteProject(projectId, user.id, context.locals.supabase);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
};

export const prerender = false;



================================================
FILE: src/pages/api/projects/[projectId]/plan.ts
================================================
import type { APIRoute } from "astro";
import { generatePlanCommandSchema, projectIdParamSchema } from "../../../../lib/schemas/plan.schema";
import { planService } from "../../../../services/plan.service";
import { createSuccessResponse, createErrorResponse, ApiError } from "../../../../lib/api-utils";
import { getAIService } from "../../../../services/ai.service";
import { z } from "zod";
import type { Json } from "../../../../db/database.types";

export const prerender = false;

/**
 * GET /api/projects/{projectId}/plan
 *
 * Fetches the latest successfully generated plan for a project
 */
export const GET: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      return createErrorResponse(401, "Unauthorized", "User not authenticated");
    }

    const projectId = context.params.projectId;

    if (!projectId) {
      return createErrorResponse(400, "Bad Request", "Project ID is required");
    }

    // Fetch the latest successful plan from ai_logs (most recent by created_on)
    // RLS will automatically filter by user_id
    const { data: aiLog, error } = await context.locals.supabase
      .from("ai_logs")
      .select("response, version, created_on")
      .eq("project_id", projectId)
      .eq("status", "success")
      .order("created_on", { ascending: false })
      .limit(1)
      .single();

    if (error || !aiLog) {
      return createErrorResponse(404, "Not Found", "No plan found for this project");
    }

    // Extract schedule from response
    const response = aiLog.response as { schedule?: unknown };

    return createSuccessResponse(
      {
        schedule: response.schedule || [],
        version: aiLog.version,
        createdOn: aiLog.created_on,
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(500, "Server Error", message);
  }
};

/**
 * POST /api/projects/{projectId}/plan
 *
 * Endpoint do synchronicznego generowania planu podróży dla projektu.
 *
 * Request Body:
 * {
 *   "model": "gpt-4o-mini",  // User-facing model name (mapped to GROQ model internally)
 *   "project_name": "Summer Trip to Paris",  // Name of the travel project
 *   "duration_days": 5,                      // Number of days for the itinerary
 *   "notes": [{ "id": "uuid", "content": "string", "priority": 1, "place_tags": ["string"] }],
 *   "preferences": { "categories": ["string"] }  // opcjonalne
 * }
 *
 * Response 200:
 * {
 *   "schedule": [{ "day": 1, "activities": ["..."] }]
 * }
 *
 * Error Codes:
 * - 400: Invalid input data validation
 * - 401: User not authenticated
 * - 404: Project does not exist or does not belong to user
 * - 500: Server error or AI service error
 */
export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return createErrorResponse(401, "Unauthorized", "User not authenticated");
  }

  const startTime = Date.now();
  let logId: string | null = null;
  let prompt = "";
  let requestBody: unknown = null;
  let responseCode = 500; // Default to server error

  try {
    // Capture raw request body first for logging (even if invalid JSON)
    const rawBody = await context.request.text();
    try {
      requestBody = JSON.parse(rawBody);
    } catch {
      requestBody = { raw: rawBody }; // Store invalid JSON as raw text
      responseCode = 400;
      throw new Error("Invalid JSON format in request body");
    }

    // Krok 1: Validate URL params and request body
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const command = generatePlanCommandSchema.parse(requestBody);

    // Prepare prompt and create pending log
    const aiService = getAIService();
    prompt = aiService.generatePrompt(command);
    const { data: pendingData, error: pendingError } = await context.locals.supabase
      .from("ai_logs")
      .insert({
        project_id: projectId,
        user_id: user.id,
        prompt,
        request_body: requestBody as Json,
        response: {},
        response_code: null,
        status: "pending",
        duration_ms: null,
      })
      .select("id")
      .single();
    if (pendingError || !pendingData) {
      console.error("Error creating AI log entry:", pendingError);
    } else {
      logId = pendingData.id;
    }

    // Call service and return result
    const { plan } = await planService.generatePlan(projectId, user.id, command, context.locals.supabase);
    const duration = Date.now() - startTime;
    responseCode = 200;

    if (logId) {
      await context.locals.supabase
        .from("ai_logs")
        .update({
          status: "success",
          response: plan as unknown as Json,
          response_code: responseCode,
          duration_ms: duration,
        })
        .eq("id", logId);
    }
    return createSuccessResponse(plan, 200);
  } catch (error) {
    // Determine response code based on error type
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : String(error);
    let details: unknown = undefined;

    // Determine appropriate response code if not already set
    if (responseCode === 500) {
      if (error instanceof ApiError) {
        responseCode = error.statusCode;
        details = error.details;
      } else if (error instanceof z.ZodError) {
        responseCode = 400;
        details = error.errors;
      } else if (message.includes("Invalid JSON")) {
        responseCode = 400;
      }
    }

    // Update or insert failure log
    if (logId) {
      await context.locals.supabase
        .from("ai_logs")
        .update({ status: "failure", response: { error: message }, response_code: responseCode, duration_ms: duration })
        .eq("id", logId);
    } else {
      const user = context.locals.user;
      if (user) {
        await context.locals.supabase.from("ai_logs").insert({
          project_id: context.params.projectId!,
          user_id: user.id,
          prompt,
          request_body: requestBody as Json,
          response: { error: message },
          response_code: responseCode,
          status: "failure",
          duration_ms: duration,
        });
      }
    }

    // Return error response with the same status code logged to database
    const errorType = responseCode === 400 ? "Validation Error" : responseCode === 404 ? "Not Found" : "Server Error";
    return createErrorResponse(responseCode, errorType, message, details);
  }
};



================================================
FILE: src/pages/api/projects/[projectId]/notes/[noteId].ts
================================================
import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse, ApiError } from "../../../../../lib/api-utils";
import {
  projectIdParamSchema,
  noteIdParamSchema,
  updateNoteCommandSchema,
} from "../../../../../lib/schemas/note.schema";
import { noteService } from "../../../../../services/note.service";

/**
 * GET /api/projects/{projectId}/notes/{noteId}
 *
 * Endpoint do pobierania pojedynczej notatki.
 */
export const GET: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const noteId = noteIdParamSchema.parse(context.params.noteId);
    const note = await noteService.getNote(noteId, projectId, user.id, context.locals.supabase);
    return createSuccessResponse(note, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * PATCH /api/projects/{projectId}/notes/{noteId}
 *
 * Endpoint do aktualizacji notatki (wszystkie pola opcjonalne).
 */
export const PATCH: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const noteId = noteIdParamSchema.parse(context.params.noteId);

    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON format in request body");
    }

    const command = updateNoteCommandSchema.parse(body);
    const note = await noteService.updateNote(noteId, projectId, user.id, command, context.locals.supabase);
    return createSuccessResponse(note, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * DELETE /api/projects/{projectId}/notes/{noteId}
 *
 * Endpoint do usuwania notatki.
 */
export const DELETE: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);
    const noteId = noteIdParamSchema.parse(context.params.noteId);
    await noteService.deleteNote(noteId, projectId, user.id, context.locals.supabase);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
};

export const prerender = false;



================================================
FILE: src/pages/api/projects/[projectId]/notes/index.ts
================================================
import type { APIRoute } from "astro";
import { handleApiError, createSuccessResponse, ApiError } from "../../../../../lib/api-utils";
import {
  projectIdParamSchema,
  createNoteCommandSchema,
  listNotesQuerySchema,
} from "../../../../../lib/schemas/note.schema";
import { noteService } from "../../../../../services/note.service";

/**
 * GET /api/projects/{projectId}/notes
 *
 * Endpoint do pobierania listy notatek projektu z paginacją i filtrami.
 *
 * Query Parameters:
 * - page (integer, optional, default: 1)
 * - size (integer, optional, default: 20)
 * - priority (integer, optional) - Filter by priority (1-3)
 * - place_tag (string, optional) - Filter by place tag
 *
 * Response 200:
 * {
 *   "data": [{ "id": "uuid", "project_id": "uuid", "content": "string", "priority": 1, "place_tags": [...], "updated_on": "..." }],
 *   "meta": { "page": 1, "size": 20, "total": 1 }
 * }
 *
 * Error Codes:
 * - 401: User not authenticated
 */
export const GET: APIRoute = async (context) => {
  try {
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const projectId = projectIdParamSchema.parse(context.params.projectId);

    const query = listNotesQuerySchema.parse({
      page: context.url.searchParams.get("page"),
      size: context.url.searchParams.get("size"),
      priority: context.url.searchParams.get("priority"),
      place_tag: context.url.searchParams.get("place_tag"),
    });

    const result = await noteService.listNotes(projectId, user.id, query, context.locals.supabase);
    return createSuccessResponse(result, 200);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * POST /api/projects/{projectId}/notes
 *
 * Endpoint do tworzenia nowej notatki dla projektu podróży.
 *
 * URL Parameters:
 * - projectId: UUID projektu
 *
 * Request Body:
 * {
 *   "content": "Visit Eiffel Tower at sunset",
 *   "priority": 1,
 *   "place_tags": ["Paris", "Monuments"]  // opcjonalne
 * }
 *
 * Response 201:
 * {
 *   "id": "uuid",
 *   "project_id": "uuid",
 *   "content": "Visit Eiffel Tower at sunset",
 *   "priority": 1,
 *   "place_tags": ["Paris", "Monuments"],
 *   "updated_on": "2025-10-21T12:00:00Z"
 * }
 *
 * Error Codes:
 * - 400: Invalid projectId UUID or input data validation failure
 * - 401: User not authenticated
 * - 404: Project not found or does not belong to user
 * - 500: Server error or database error
 */
export const POST: APIRoute = async (context) => {
  try {
    // Get authenticated user
    const user = context.locals.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    // Krok 1: Walidacja projectId z URL
    const projectId = projectIdParamSchema.parse(context.params.projectId);

    // Krok 2: Weryfikacja własności projektu
    await noteService.verifyProjectOwnership(projectId, user.id, context.locals.supabase);

    // Krok 3: Parsowanie i walidacja JSON body
    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      throw new ApiError(400, "Invalid JSON format in request body");
    }

    // Krok 4: Walidacja danych wejściowych za pomocą Zod
    const command = createNoteCommandSchema.parse(body);

    // Krok 5: Wywołanie serwisu do utworzenia notatki
    const note = await noteService.createNote(projectId, command, context.locals.supabase);

    // Krok 6: Zwrócenie odpowiedzi 201 Created
    return createSuccessResponse(note, 201);
  } catch (error) {
    // Obsługa wszystkich błędów przez centralny handler
    return handleApiError(error);
  }
};

export const prerender = false;



================================================
FILE: src/pages/auth/login.astro
================================================
---
import AuthLayout from "../../layouts/AuthLayout.astro";
import { LoginForm } from "../../components/auth/LoginForm";

export const prerender = false;

// Middleware handles redirect for authenticated users
// If user is already logged in, they'll be redirected to /projects automatically
---

<AuthLayout title="Login | VacationPlanner">
  <LoginForm client:load />
</AuthLayout>




================================================
FILE: src/pages/projects/index.astro
================================================
---
import Layout from "../../layouts/Layout.astro";
import { ProjectsPage } from "../../components/ProjectsPage";
---

<Layout title="Projects | 10x Vacation Planner">
  <ProjectsPage client:load />
</Layout>



================================================
FILE: src/pages/projects/[projectId]/notes.astro
================================================
---
import Layout from "../../../layouts/Layout.astro";
import { ProjectView } from "../../../components/ProjectView";

const { projectId } = Astro.params;

if (!projectId) {
  return Astro.redirect("/projects");
}

// Fetch project data to get duration_days
const { data: project, error } = await Astro.locals.supabase
  .from("travel_projects")
  .select("id, name, duration_days")
  .eq("id", projectId)
  .single();

if (error || !project) {
  return Astro.redirect("/projects");
}
---

<Layout title={`${project.name} | 10x Vacation Planner`}>
  <ProjectView client:load projectId={projectId} projectName={project.name} durationDays={project.duration_days} />
</Layout>



================================================
FILE: src/services/ai.service.mock.ts
================================================
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



================================================
FILE: src/services/ai.service.ts
================================================
/**
 * AI Service - Real Implementation using GROQ
 *
 * Service for generating travel plans using LLM through GROQ API
 */

import type { GeneratePlanCommand, PlanResponseDto, ScheduleItemDto } from "../types";
import { GROQService } from "../lib/groq.service";
import type { JSONSchema } from "../lib/groq.types";
import { ValidationError, ApiError as GroqApiError } from "../lib/errors";
import { ApiError } from "../lib/api-utils";

/**
 * JSON Schema for the plan response
 * This ensures the LLM returns structured data matching PlanResponseDto
 */
const PLAN_RESPONSE_SCHEMA: JSONSchema = {
  type: "object",
  properties: {
    schedule: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: {
            type: "number",
            description: "Day number (1, 2, 3, etc.). MUST include ALL days from 1 to the total number of days requested.",
          },
          activities: {
            type: "array",
            items: {
              type: "string",
              description: "Activity description",
            },
            description: "List of 3-5 activities for the day",
          },
        },
        required: ["day", "activities"],
        additionalProperties: false,
      },
      description: "Complete daily schedule for ALL days of the trip. Must include every single day from day 1 to the last day.",
    },
  },
  required: ["schedule"],
  additionalProperties: false,
};

/**
 * Real AI Service for generating travel plans
 */
export class AIService {
  private groqService: GROQService;

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("GROQ API key is required");
    }

    this.groqService = new GROQService({
      apiKey,
      defaultModel: "llama-3.3-70b-versatile",
      defaultParams: {
        temperature: 0.7,
        max_tokens: 4096,
      },
    });
  }

  /**
   * Generate a travel plan using GROQ LLM
   */
  async generatePlan(command: GeneratePlanCommand): Promise<PlanResponseDto> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(command);

      const response = await this.groqService.sendChat<PlanResponseDto>({
        systemMessage: systemPrompt,
        userMessage: userPrompt,
        responseSchema: PLAN_RESPONSE_SCHEMA,
        schemaName: "TravelPlanResponse",
        model: this.mapModelName(command.model),
        parameters: {
          temperature: 0.7,
          max_tokens: 4096,
        },
      });

      // Validate that we have the expected number of days
      if (!response.data.schedule || response.data.schedule.length === 0) {
        throw new ApiError(500, "Generated plan has no schedule items");
      }

      if (response.data.schedule.length !== command.duration_days) {
        throw new ApiError(
          500,
          `Generated plan has ${response.data.schedule.length} days but expected ${command.duration_days} days`
        );
      }

      // Validate that days are sequential starting from 1
      const dayNumbers = response.data.schedule.map((item) => item.day).sort((a, b) => a - b);
      for (let i = 0; i < command.duration_days; i++) {
        if (dayNumbers[i] !== i + 1) {
          throw new ApiError(500, `Generated plan is missing day ${i + 1} or has incorrect day numbering`);
        }
      }

      return response.data;
    } catch (error) {
      // Handle GROQ-specific errors
      if (error instanceof ValidationError) {
        throw new ApiError(500, `AI response validation failed: ${error.message}`);
      }

      if (error instanceof GroqApiError) {
        throw new ApiError(502, `AI service error: ${error.message}`);
      }

      // Re-throw ApiErrors as-is
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle unknown errors
      console.error("Unexpected error in AI service:", error);
      throw new ApiError(500, "Failed to generate travel plan");
    }
  }

  /**
   * Generate the user prompt for logging purposes
   * Note: System prompt is not included as it's static and stored in code
   */
  generatePrompt(command: GeneratePlanCommand): string {
    return this.buildUserPrompt(command);
  }

  /**
   * Build the system prompt that defines the AI's role and behavior
   */
  private buildSystemPrompt(): string {
    return `You are an expert travel planner AI assistant. Your task is to create detailed, personalized travel itineraries based on user notes and preferences.

RESPONSIBILITIES:
- Analyze user notes about places, activities, and attractions
- Prioritize activities based on user-assigned priority levels (1=low, 2=medium, 3=high)
- Create a day-by-day schedule that is logical and feasible
- Consider travel time and geographical proximity when scheduling activities
- Balance the itinerary to avoid overloading any single day
- Include high-priority items early in the trip when possible

OUTPUT REQUIREMENTS:
- CRITICAL: Generate a COMPLETE schedule for ALL days from day 1 to the last day
- DO NOT skip any days - every single day must be included in the response
- Each day should have 3-5 activities
- Activities should be specific and actionable
- Include breaks, meals, and travel time considerations
- Activities should be diverse and well-balanced throughout the trip
- Days must be numbered sequentially: 1, 2, 3, etc.

FORMATTING:
- Be concise but informative in activity descriptions
- Use natural language that is easy to understand
- Ensure the schedule is realistic and achievable`;
  }

  /**
   * Build the user prompt with specific trip details
   */
  private buildUserPrompt(command: GeneratePlanCommand): string {
    // Sort notes by priority (low to high: 1=high, 2=medium, 3=low)
    const sortedNotes = [...command.notes].sort((a, b) => a.priority - b.priority);

    // Group notes by priority (1=high, 2=medium, 3=low)
    const highPriorityNotes = sortedNotes.filter((n) => n.priority === 1);
    const mediumPriorityNotes = sortedNotes.filter((n) => n.priority === 2);
    const lowPriorityNotes = sortedNotes.filter((n) => n.priority === 3);

    let prompt = `Please create a detailed travel itinerary based on the following information:\n\n`;

    // Add project name/destination
    prompt += `DESTINATION: ${command.project_name}\n`;
    
    // Add trip duration
    prompt += `TRIP DURATION: ${command.duration_days} day${command.duration_days !== 1 ? 's' : ''}\n\n`;

    // Add high priority notes
    if (highPriorityNotes.length > 0) {
      prompt += `HIGH PRIORITY (Must Include):\n`;
      highPriorityNotes.forEach((note, idx) => {
        const tags = note.place_tags && note.place_tags.length > 0 ? ` [${note.place_tags.join(", ")}]` : "";
        prompt += `${idx + 1}. ${note.content}${tags}\n`;
      });
      prompt += `\n`;
    }

    // Add medium priority notes
    if (mediumPriorityNotes.length > 0) {
      prompt += `MEDIUM PRIORITY (Should Include):\n`;
      mediumPriorityNotes.forEach((note, idx) => {
        const tags = note.place_tags && note.place_tags.length > 0 ? ` [${note.place_tags.join(", ")}]` : "";
        prompt += `${idx + 1}. ${note.content}${tags}\n`;
      });
      prompt += `\n`;
    }

    // Add low priority notes
    if (lowPriorityNotes.length > 0) {
      prompt += `LOW PRIORITY (Include if time permits):\n`;
      lowPriorityNotes.forEach((note, idx) => {
        const tags = note.place_tags && note.place_tags.length > 0 ? ` [${note.place_tags.join(", ")}]` : "";
        prompt += `${idx + 1}. ${note.content}${tags}\n`;
      });
      prompt += `\n`;
    }

    // Add preferences if provided
    if (command.preferences && command.preferences.categories.length > 0) {
      prompt += `USER PREFERENCES:\n`;
      prompt += `Interested in: ${command.preferences.categories.join(", ")}\n\n`;
    }

    // Add final instructions
    prompt += `INSTRUCTIONS:\n`;
    prompt += `- IMPORTANT: Create a COMPLETE day-by-day itinerary for ALL ${command.duration_days} day${command.duration_days !== 1 ? 's' : ''}\n`;
    prompt += `- You MUST include every single day from Day 1 to Day ${command.duration_days}\n`;
    prompt += `- DO NOT skip any days - the response must contain exactly ${command.duration_days} days\n`;
    prompt += `- Each day should have 3-5 activities\n`;
    prompt += `- Prioritize high-priority items and include them early in the schedule\n`;
    prompt += `- Ensure activities are geographically logical\n`;
    prompt += `- Include practical activities like meals, breaks, and travel time\n`;
    prompt += `- Make the schedule realistic and enjoyable\n`;

    return prompt;
  }

  /**
   * Map user-facing model names to GROQ model names
   * Note: Only models that support json_schema response format are used
   * See: https://console.groq.com/docs/structured-outputs#supported-models
   */
  private mapModelName(requestedModel: string): string {
    const modelMap: Record<string, string> = {
      "gpt-4": "openai/gpt-oss-20b",
      "gpt-4o-mini": "openai/gpt-oss-20b",
      "gpt-5": "openai/gpt-oss-20b",
      "claude-3-opus": "openai/gpt-oss-20b",
      "claude-3.5-sonnet": "openai/gpt-oss-20b",
    };

    return modelMap[requestedModel] || "openai/gpt-oss-20b";
  }
}

/**
 * Create singleton instance of AI service
 * The API key will be read from environment variables at runtime
 */
let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    // Try GROQ_API_KEY first, fallback to OPENROUTER_API_KEY for backwards compatibility
    let apiKey = import.meta.env.GROQ_API_KEY || import.meta.env.OPENROUTER_API_KEY;
    
    // Fallback for development/debugging
    if (!apiKey) {
      console.error("⚠️ GROQ_API_KEY not found in environment variables");
      console.error("Available env vars:", Object.keys(import.meta.env));
      throw new Error(
        "GROQ_API_KEY environment variable is not set. " +
        "Please add GROQ_API_KEY=your_key_here to your .env file and restart the dev server."
      );
    }
    
    // Log which key is being used (for debugging)
    if (import.meta.env.DEV) {
      console.log(
        "Using API key from:",
        import.meta.env.GROQ_API_KEY ? "GROQ_API_KEY" : "OPENROUTER_API_KEY (fallback)"
      );
    }
    
    aiServiceInstance = new AIService(apiKey);
  }
  return aiServiceInstance;
}

/**
 * DEPRECATED: Use getAIService() instead
 * This export is kept for backwards compatibility but may cause issues
 * if imported at module level before environment variables are loaded
 */
export const aiService = {
  generatePlan: (command: GeneratePlanCommand) => getAIService().generatePlan(command),
  generatePrompt: (command: GeneratePlanCommand) => getAIService().generatePrompt(command),
};



================================================
FILE: src/services/note.service.ts
================================================
import type { NoteDto, NotesListResponseDto, UpdateNoteCommand } from "../types";
import { ApiError } from "../lib/api-utils";
import type { SupabaseClient } from "../db/supabase.client";
import type { Database } from "../db/database.types";
import type { ValidatedListNotesQuery } from "../lib/schemas/note.schema";

type DbClient = SupabaseClient<Database>;

/**
 * Typ dla komendy tworzenia notatki (bez project_id, który pochodzi z URL)
 */
interface CreateNoteInput {
  content: string;
  priority: number;
  place_tags?: string[] | null;
}

/**
 * Service odpowiedzialny za zarządzanie notatkami
 */
export class NoteService {
  /**
   * Weryfikuje istnienie projektu i własność
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @throws ApiError(404) jeśli projekt nie istnieje lub nie należy do użytkownika
   */
  async verifyProjectOwnership(projectId: string, userId: string, db: DbClient): Promise<void> {
    const { data: project, error } = await db
      .from("travel_projects")
      .select("id, user_id")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      console.error("Project not found or Supabase error:", error);
      throw new ApiError(404, "Project not found");
    }

    if (project.user_id !== userId) {
      console.error(`User ID mismatch - Project user_id: ${project.user_id}, Expected user_id: ${userId}`);
      throw new ApiError(404, "Project not found"); // Don't reveal that the project exists
    }
  }

  /**
   * Pobiera listę notatek projektu z paginacją i filtrami
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param query - Parametry zapytania (page, size, priority, place_tag)
   * @param db - Klient Supabase
   * @returns Lista notatek z metadanymi paginacji
   * @throws ApiError w przypadku błędów
   */
  async listNotes(
    projectId: string,
    userId: string,
    query: ValidatedListNotesQuery,
    db: DbClient
  ): Promise<NotesListResponseDto> {
    // Najpierw zweryfikuj własność projektu
    await this.verifyProjectOwnership(projectId, userId, db);

    const { page, size, priority, place_tag } = query;
    const offset = (page - 1) * size;

    // Buduj zapytanie z filtrami
    let countQuery = db.from("notes").select("*", { count: "exact", head: true }).eq("project_id", projectId);

    let dataQuery = db
      .from("notes")
      .select("id, project_id, content, priority, place_tags, updated_on")
      .eq("project_id", projectId);

    // Dodaj filtry jeśli są podane
    if (priority !== undefined) {
      countQuery = countQuery.eq("priority", priority);
      dataQuery = dataQuery.eq("priority", priority);
    }

    if (place_tag) {
      countQuery = countQuery.contains("place_tags", [place_tag]);
      dataQuery = dataQuery.contains("place_tags", [place_tag]);
    }

    // Pobierz całkowitą liczbę notatek
    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("Error counting notes:", countError);
      throw new ApiError(500, "Failed to count notes");
    }

    // Pobierz notatki z paginacją
    const { data, error } = await dataQuery.order("priority", { ascending: true }).range(offset, offset + size - 1);

    if (error) {
      console.error("Error listing notes:", error);
      throw new ApiError(500, "Failed to list notes");
    }

    return {
      data: (data || []) as NoteDto[],
      meta: {
        page,
        size,
        total: count || 0,
      },
    };
  }

  /**
   * Pobiera pojedynczą notatkę po ID
   *
   * @param noteId - ID notatki
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @returns Notatka
   * @throws ApiError(404) jeśli notatka nie istnieje lub projekt nie należy do użytkownika
   */
  async getNote(noteId: string, projectId: string, userId: string, db: DbClient): Promise<NoteDto> {
    // Najpierw zweryfikuj własność projektu
    await this.verifyProjectOwnership(projectId, userId, db);

    const { data, error } = await db
      .from("notes")
      .select("id, project_id, content, priority, place_tags, updated_on")
      .eq("id", noteId)
      .eq("project_id", projectId)
      .single();

    if (error || !data) {
      console.error("Note not found or Supabase error:", error);
      throw new ApiError(404, "Note not found");
    }

    return data as NoteDto;
  }

  /**
   * Aktualizuje notatkę
   *
   * @param noteId - ID notatki
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param command - Komenda z danymi do aktualizacji
   * @param db - Klient Supabase
   * @returns Zaktualizowana notatka
   * @throws ApiError(404) jeśli notatka nie istnieje
   */
  async updateNote(
    noteId: string,
    projectId: string,
    userId: string,
    command: UpdateNoteCommand,
    db: DbClient
  ): Promise<NoteDto> {
    // Najpierw sprawdź czy notatka istnieje i należy do projektu użytkownika
    await this.getNote(noteId, projectId, userId, db);

    const { data, error } = await db
      .from("notes")
      .update({
        ...(command.content !== undefined && { content: command.content }),
        ...(command.priority !== undefined && { priority: command.priority }),
        ...(command.place_tags !== undefined && { place_tags: command.place_tags }),
      })
      .eq("id", noteId)
      .eq("project_id", projectId)
      .select("id, project_id, content, priority, place_tags, updated_on")
      .single();

    if (error || !data) {
      console.error("Error updating note:", error);
      throw new ApiError(500, "Failed to update note");
    }

    return data as NoteDto;
  }

  /**
   * Usuwa notatkę
   *
   * @param noteId - ID notatki
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @throws ApiError(404) jeśli notatka nie istnieje
   */
  async deleteNote(noteId: string, projectId: string, userId: string, db: DbClient): Promise<void> {
    // Najpierw sprawdź czy notatka istnieje i należy do projektu użytkownika
    await this.getNote(noteId, projectId, userId, db);

    const { error } = await db.from("notes").delete().eq("id", noteId).eq("project_id", projectId);

    if (error) {
      console.error("Error deleting note:", error);
      throw new ApiError(500, "Failed to delete note");
    }
  }

  /**
   * Tworzy nową notatkę dla projektu
   *
   * @param projectId - ID projektu
   * @param command - Komenda z danymi nowej notatki
   * @param db - Klient Supabase
   * @returns Utworzona notatka
   * @throws ApiError w przypadku błędów bazy danych
   */
  async createNote(projectId: string, command: CreateNoteInput, db: DbClient): Promise<NoteDto> {
    const { data, error } = await db
      .from("notes")
      .insert({
        project_id: projectId,
        content: command.content,
        priority: command.priority,
        place_tags: command.place_tags ?? null,
      })
      .select("id, project_id, content, priority, place_tags, updated_on")
      .single();

    if (error || !data) {
      console.error("Error creating note:", error);
      throw new ApiError(500, "Failed to create note");
    }

    return data as NoteDto;
  }
}

/**
 * Singleton instance note service
 */
export const noteService = new NoteService();



================================================
FILE: src/services/plan.service.ts
================================================
import type { Database } from "../db/database.types";
import type { GeneratePlanCommand, PlanResponseDto } from "../types";
import { ApiError } from "../lib/api-utils";
import { getAIService } from "./ai.service";
import type { SupabaseClient } from "../db/supabase.client";

type DbClient = SupabaseClient<Database>;

/**
 * Service odpowiedzialny za generowanie planu podróży
 */
export class PlanService {
  /**
   * Generuje plan podróży dla projektu
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika (dla weryfikacji własności)
   * @param command - Komenda z parametrami generowania
   * @param supabase - Klient Supabase
   * @returns Plan podróży z metadanymi projektu
   * @throws ApiError w przypadku błędów
   */
  async generatePlan(projectId: string, userId: string, command: GeneratePlanCommand, supabase: DbClient): Promise<{ plan: PlanResponseDto; durationDays: number }> {
    // Krok 1: Weryfikacja istnienia projektu i własności
    const project = await this.fetchAndVerifyProject(projectId, userId, supabase);

    // Krok 2: Pobranie notatek projektu
    const notes = await this.fetchProjectNotes(projectId, supabase);

    // Krok 3: Walidacja zgodności notatek
    this.validateNotes(command.notes, notes);

    // Krok 4: Wywołanie AI service (logowanie przeniesione do trasy API)
    const aiService = getAIService();
    const plan = await aiService.generatePlan(command);
    
    return {
      plan,
      durationDays: project.duration_days,
    };
  }

  /**
   * Pobiera projekt i weryfikuje własność
   */
  private async fetchAndVerifyProject(projectId: string, userId: string, supabase: DbClient) {
    const { data: project, error } = await supabase
      .from("travel_projects")
      .select("id, name, user_id, duration_days")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      console.error("Project not found or Supabase error:", error);
      throw new ApiError(404, "Project not found");
    }

    if (project.user_id !== userId) {
      console.error(`User ID mismatch - Project user_id: ${project.user_id}, Expected user_id: ${userId}`);
      throw new ApiError(404, "Project not found"); // Don't reveal that the project exists
    }

    return project;
  }

  /**
   * Pobiera notatki przypisane do projektu
   */
  private async fetchProjectNotes(projectId: string, supabase: DbClient) {
    const { data: notes, error } = await supabase
      .from("notes")
      .select("id, content, priority, place_tags")
      .eq("project_id", projectId)
      .order("priority", { ascending: true });

    if (error) {
      throw new ApiError(500, "Error fetching project notes");
    }

    return notes || [];
  }

  /**
   * Waliduje zgodność notatek z bazy danych z notatkami w komendzie
   */
  private validateNotes(
    commandNotes: GeneratePlanCommand["notes"],
    dbNotes: { id: string; content: string; priority: number; place_tags: string[] | null }[]
  ) {
    const dbNoteIds = new Set(dbNotes.map((n) => n.id));

    for (const note of commandNotes) {
      if (!dbNoteIds.has(note.id)) {
        throw new ApiError(400, `Note with ID ${note.id} does not belong to this project`);
      }
    }
  }

  /**
   * Tworzy wpis w ai_logs ze statusem 'pending'
   * @returns ID utworzonego logu
   */
  private async createPendingLog(
    projectId: string,
    userId: string,
    command: GeneratePlanCommand,
    supabase: DbClient
  ): Promise<string> {
    const aiService = getAIService();
    const prompt = aiService.generatePrompt(command);

    const { data, error } = await supabase
      .from("ai_logs")
      .insert({
        project_id: projectId,
        user_id: userId,
        prompt,
        response: {}, // Pusty obiekt zamiast null (response jest NOT NULL w bazie)
        status: "pending",
        duration_ms: null,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Error creating AI log entry:", error);
      throw new ApiError(500, "Error creating AI log entry");
    }

    return data.id;
  }

  /**
   * Aktualizuje status wpisu w ai_logs
   */
  private async updateLogStatus(
    logId: string,
    status: Database["public"]["Enums"]["ai_status"],
    response: PlanResponseDto | null,
    durationMs: number,
    errorMessage: string | null,
    supabase: DbClient
  ) {
    const responseData =
      status === "success" && response
        ? (response as unknown as Database["public"]["Tables"]["ai_logs"]["Update"]["response"])
        : ({ error: errorMessage } as unknown as Database["public"]["Tables"]["ai_logs"]["Update"]["response"]);

    const { error } = await supabase
      .from("ai_logs")
      .update({
        status,
        response: responseData,
        duration_ms: durationMs,
      })
      .eq("id", logId);

    if (error) {
      console.error("Error updating AI log:", error);
      // Don't throw error - this is a logging operation, shouldn't block the main flow
    }
  }
}

/**
 * Singleton instance plan service
 */
export const planService = new PlanService();



================================================
FILE: src/services/project.service.ts
================================================
import type { CreateProjectCommand, ProjectDto, ProjectsListResponseDto, UpdateProjectCommand } from "../types";
import { ApiError } from "../lib/api-utils";
import type { SupabaseClient } from "../db/supabase.client";
import type { Database } from "../db/database.types";
import type { ValidatedListProjectsQuery } from "../lib/schemas/project.schema";

type DbClient = SupabaseClient<Database>;

/**
 * Service odpowiedzialny za zarządzanie projektami podróży
 */
export class ProjectService {
  /**
   * Pobiera listę projektów użytkownika z paginacją
   *
   * @param userId - ID użytkownika
   * @param query - Parametry zapytania (page, size, sort, order)
   * @param db - Klient Supabase
   * @returns Lista projektów z metadanymi paginacji
   * @throws ApiError w przypadku błędów bazy danych
   */
  async listProjects(
    userId: string,
    query: ValidatedListProjectsQuery,
    db: DbClient
  ): Promise<ProjectsListResponseDto> {
    const { page, size, sort, order } = query;
    const offset = (page - 1) * size;

    // Pobierz całkowitą liczbę projektów
    const { count, error: countError } = await db
      .from("travel_projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Error counting projects:", countError);
      throw new ApiError(500, "Failed to count projects");
    }

    // Pobierz projekty z paginacją i sortowaniem
    const { data, error } = await db
      .from("travel_projects")
      .select("id, name, duration_days, planned_date")
      .eq("user_id", userId)
      .order(sort, { ascending: order === "asc" })
      .range(offset, offset + size - 1);

    if (error) {
      console.error("Error listing projects:", error);
      throw new ApiError(500, "Failed to list projects");
    }

    return {
      data: (data || []) as ProjectDto[],
      meta: {
        page,
        size,
        total: count || 0,
      },
    };
  }

  /**
   * Pobiera pojedynczy projekt po ID
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @returns Projekt
   * @throws ApiError(404) jeśli projekt nie istnieje lub nie należy do użytkownika
   */
  async getProject(projectId: string, userId: string, db: DbClient): Promise<ProjectDto> {
    const { data, error } = await db
      .from("travel_projects")
      .select("id, name, duration_days, planned_date")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      console.error("Project not found or Supabase error:", error);
      throw new ApiError(404, "Project not found");
    }

    return data as ProjectDto;
  }

  /**
   * Aktualizuje projekt
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param command - Komenda z danymi do aktualizacji
   * @param db - Klient Supabase
   * @returns Zaktualizowany projekt
   * @throws ApiError(404) jeśli projekt nie istnieje lub nie należy do użytkownika
   */
  async updateProject(
    projectId: string,
    userId: string,
    command: UpdateProjectCommand,
    db: DbClient
  ): Promise<ProjectDto> {
    // Najpierw sprawdź czy projekt istnieje i należy do użytkownika
    await this.getProject(projectId, userId, db);

    const { data, error } = await db
      .from("travel_projects")
      .update({
        ...(command.name !== undefined && { name: command.name }),
        ...(command.duration_days !== undefined && { duration_days: command.duration_days }),
        ...(command.planned_date !== undefined && { planned_date: command.planned_date }),
      })
      .eq("id", projectId)
      .eq("user_id", userId)
      .select("id, name, duration_days, planned_date")
      .single();

    if (error || !data) {
      console.error("Error updating project:", error);
      throw new ApiError(500, "Failed to update project");
    }

    return data as ProjectDto;
  }

  /**
   * Usuwa projekt
   *
   * @param projectId - ID projektu
   * @param userId - ID użytkownika
   * @param db - Klient Supabase
   * @throws ApiError(404) jeśli projekt nie istnieje lub nie należy do użytkownika
   */
  async deleteProject(projectId: string, userId: string, db: DbClient): Promise<void> {
    // Najpierw sprawdź czy projekt istnieje i należy do użytkownika
    await this.getProject(projectId, userId, db);

    const { error } = await db.from("travel_projects").delete().eq("id", projectId).eq("user_id", userId);

    if (error) {
      console.error("Error deleting project:", error);
      throw new ApiError(500, "Failed to delete project");
    }
  }

  /**
   * Tworzy nowy projekt podróży dla użytkownika
   *
   * @param userId - ID użytkownika tworzącego projekt
   * @param command - Komenda z danymi nowego projektu
   * @param db - Klient Supabase
   * @returns Utworzony projekt
   * @throws ApiError w przypadku błędów bazy danych
   */
  async createProject(userId: string, command: CreateProjectCommand, db: DbClient): Promise<ProjectDto> {
    const { data, error } = await db
      .from("travel_projects")
      .insert({
        user_id: userId,
        name: command.name,
        duration_days: command.duration_days,
        planned_date: command.planned_date ?? null,
      })
      .select("id, name, duration_days, planned_date")
      .single();

    if (error || !data) {
      console.error("Error creating project:", error);
      throw new ApiError(500, "Failed to create project");
    }

    return data as ProjectDto;
  }
}

/**
 * Singleton instance project service
 */
export const projectService = new ProjectService();



================================================
FILE: src/styles/global.css
================================================
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.1450 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.1450 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.1450 0 0);
  --primary: oklch(0.2050 0 0);
  --primary-foreground: oklch(0.9850 0 0);
  --secondary: oklch(0.9700 0 0);
  --secondary-foreground: oklch(0.2050 0 0);
  --muted: oklch(0.9700 0 0);
  --muted-foreground: oklch(0.5560 0 0);
  --accent: oklch(0.9700 0 0);
  --accent-foreground: oklch(0.2050 0 0);
  --destructive: oklch(0.5770 0.2450 27.3250);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.9220 0 0);
  --input: oklch(0.9220 0 0);
  --ring: oklch(0.7080 0 0);
  --chart-1: oklch(0.8100 0.1000 252);
  --chart-2: oklch(0.6200 0.1900 260);
  --chart-3: oklch(0.5500 0.2200 263);
  --chart-4: oklch(0.4900 0.2200 264);
  --chart-5: oklch(0.4200 0.1800 266);
  --sidebar: oklch(0.9850 0 0);
  --sidebar-foreground: oklch(0.1450 0 0);
  --sidebar-primary: oklch(0.2050 0 0);
  --sidebar-primary-foreground: oklch(0.9850 0 0);
  --sidebar-accent: oklch(0.9700 0 0);
  --sidebar-accent-foreground: oklch(0.2050 0 0);
  --sidebar-border: oklch(0.9220 0 0);
  --sidebar-ring: oklch(0.7080 0 0);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: 0.625rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.1773 0.0253 209.3678);
  --foreground: oklch(0.9850 0 0);
  --card: oklch(0.2538 0.0102 207.0469);
  --card-foreground: oklch(0.9850 0 0);
  --popover: oklch(0.2690 0 0);
  --popover-foreground: oklch(0.9850 0 0);
  --primary: oklch(0.6859 0.1152 193.3408);
  --primary-foreground: oklch(0.2404 0.0355 207.5502);
  --secondary: oklch(0.3245 0.0498 207.3673);
  --secondary-foreground: oklch(0.9850 0 0);
  --muted: oklch(0.2690 0 0);
  --muted-foreground: oklch(0.7080 0 0);
  --accent: oklch(0.3710 0 0);
  --accent-foreground: oklch(0.9850 0 0);
  --destructive: oklch(0.7040 0.1910 22.2160);
  --destructive-foreground: oklch(0.9850 0 0);
  --border: oklch(0.2750 0 0);
  --input: oklch(0.3250 0 0);
  --ring: oklch(0.5560 0 0);
  --chart-1: oklch(0.8100 0.1000 252);
  --chart-2: oklch(0.6200 0.1900 260);
  --chart-3: oklch(0.5500 0.2200 263);
  --chart-4: oklch(0.4900 0.2200 264);
  --chart-5: oklch(0.4200 0.1800 266);
  --sidebar: oklch(0.2050 0 0);
  --sidebar-foreground: oklch(0.9850 0 0);
  --sidebar-primary: oklch(0.4880 0.2430 264.3760);
  --sidebar-primary-foreground: oklch(0.9850 0 0);
  --sidebar-accent: oklch(0.2690 0 0);
  --sidebar-accent-foreground: oklch(0.9850 0 0);
  --sidebar-border: oklch(0.2750 0 0);
  --sidebar-ring: oklch(0.4390 0 0);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: 0.625rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}



================================================
FILE: supabase/config.toml
================================================
# For detailed configuration reference documentation, visit:
# https://supabase.com/docs/guides/local-development/cli/config
# A string used to distinguish different Supabase projects on the same host. Defaults to the
# working directory name when running `supabase init`.
project_id = "10x-vacation-planner"

[api]
enabled = true
# Port to use for the API URL.
port = 54321
# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
# endpoints. `public` and `graphql_public` schemas are included by default.
schemas = ["public", "graphql_public"]
# Extra schemas to add to the search_path of every request.
extra_search_path = ["public", "extensions"]
# The maximum number of rows returns from a view, table, or stored procedure. Limits payload size
# for accidental or malicious requests.
max_rows = 1000

[api.tls]
# Enable HTTPS endpoints locally using a self-signed certificate.
enabled = false
# Paths to self-signed certificate pair.
# cert_path = "../certs/my-cert.pem"
# key_path = "../certs/my-key.pem"

[db]
# Port to use for the local database URL.
port = 54322
# Port used by db diff command to initialize the shadow database.
shadow_port = 54320
# The database major version to use. This has to be the same as your remote database's. Run `SHOW
# server_version;` on the remote database to check.
major_version = 17

[db.pooler]
enabled = false
# Port to use for the local connection pooler.
port = 54329
# Specifies when a server connection can be reused by other clients.
# Configure one of the supported pooler modes: `transaction`, `session`.
pool_mode = "transaction"
# How many server connections to allow per user/database pair.
default_pool_size = 20
# Maximum number of client connections allowed.
max_client_conn = 100

# [db.vault]
# secret_key = "env(SECRET_VALUE)"

[db.migrations]
# If disabled, migrations will be skipped during a db push or reset.
enabled = true
# Specifies an ordered list of schema files that describe your database.
# Supports glob patterns relative to supabase directory: "./schemas/*.sql"
schema_paths = []

[db.seed]
# If enabled, seeds the database after migrations during a db reset.
enabled = true
# Specifies an ordered list of seed files to load during db reset.
# Supports glob patterns relative to supabase directory: "./seeds/*.sql"
sql_paths = ["./seed.sql"]

[db.network_restrictions]
# Enable management of network restrictions.
enabled = false
# List of IPv4 CIDR blocks allowed to connect to the database.
# Defaults to allow all IPv4 connections. Set empty array to block all IPs.
allowed_cidrs = ["0.0.0.0/0"]
# List of IPv6 CIDR blocks allowed to connect to the database.
# Defaults to allow all IPv6 connections. Set empty array to block all IPs.
allowed_cidrs_v6 = ["::/0"]

[realtime]
enabled = true
# Bind realtime via either IPv4 or IPv6. (default: IPv4)
# ip_version = "IPv6"
# The maximum length in bytes of HTTP request headers. (default: 4096)
# max_header_length = 4096

[studio]
enabled = true
# Port to use for Supabase Studio.
port = 54323
# External URL of the API server that frontend connects to.
api_url = "http://127.0.0.1"
# OpenAI API Key to use for Supabase AI in the Supabase Studio.
openai_api_key = "env(OPENAI_API_KEY)"

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
# are monitored, and you can view the emails that would have been sent from the web interface.
[inbucket]
enabled = true
# Port to use for the email testing server web interface.
port = 54324
# Uncomment to expose additional ports for testing user applications that send emails.
# smtp_port = 54325
# pop3_port = 54326
# admin_email = "admin@email.com"
# sender_name = "Admin"

[storage]
enabled = true
# The maximum file size allowed (e.g. "5MB", "500KB").
file_size_limit = "50MiB"

# Image transformation API is available to Supabase Pro plan.
# [storage.image_transformation]
# enabled = true

# Uncomment to configure local storage buckets
# [storage.buckets.images]
# public = false
# file_size_limit = "50MiB"
# allowed_mime_types = ["image/png", "image/jpeg"]
# objects_path = "./images"

[auth]
enabled = true
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails.
site_url = "http://127.0.0.1:3000"
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://127.0.0.1:3000"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 (1 week).
jwt_expiry = 3600
# Path to JWT signing key. DO NOT commit your signing keys file to git.
# signing_keys_path = "./signing_keys.json"
# If disabled, the refresh token will never expire.
enable_refresh_token_rotation = true
# Allows refresh tokens to be reused after expiry, up to the specified interval in seconds.
# Requires enable_refresh_token_rotation = true.
refresh_token_reuse_interval = 10
# Allow/disallow new user signups to your project.
enable_signup = true
# Allow/disallow anonymous sign-ins to your project.
enable_anonymous_sign_ins = false
# Allow/disallow testing manual linking of accounts
enable_manual_linking = false
# Passwords shorter than this value will be rejected as weak. Minimum 6, recommended 8 or more.
minimum_password_length = 6
# Passwords that do not meet the following requirements will be rejected as weak. Supported values
# are: `letters_digits`, `lower_upper_letters_digits`, `lower_upper_letters_digits_symbols`
password_requirements = ""

[auth.rate_limit]
# Number of emails that can be sent per hour. Requires auth.email.smtp to be enabled.
email_sent = 2
# Number of SMS messages that can be sent per hour. Requires auth.sms to be enabled.
sms_sent = 30
# Number of anonymous sign-ins that can be made per hour per IP address. Requires enable_anonymous_sign_ins = true.
anonymous_users = 30
# Number of sessions that can be refreshed in a 5 minute interval per IP address.
token_refresh = 150
# Number of sign up and sign-in requests that can be made in a 5 minute interval per IP address (excludes anonymous users).
sign_in_sign_ups = 30
# Number of OTP / Magic link verifications that can be made in a 5 minute interval per IP address.
token_verifications = 30
# Number of Web3 logins that can be made in a 5 minute interval per IP address.
web3 = 30

# Configure one of the supported captcha providers: `hcaptcha`, `turnstile`.
# [auth.captcha]
# enabled = true
# provider = "hcaptcha"
# secret = ""

[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = true
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false
# If enabled, users will need to reauthenticate or have logged in recently to change their password.
secure_password_change = false
# Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.
max_frequency = "1s"
# Number of characters used in the email OTP.
otp_length = 6
# Number of seconds before the email OTP expires (defaults to 1 hour).
otp_expiry = 3600

# Use a production-ready SMTP server
# [auth.email.smtp]
# enabled = true
# host = "smtp.sendgrid.net"
# port = 587
# user = "apikey"
# pass = "env(SENDGRID_API_KEY)"
# admin_email = "admin@email.com"
# sender_name = "Admin"

# Uncomment to customize email template
# [auth.email.template.invite]
# subject = "You have been invited"
# content_path = "./supabase/templates/invite.html"

[auth.sms]
# Allow/disallow new user signups via SMS to your project.
enable_signup = false
# If enabled, users need to confirm their phone number before signing in.
enable_confirmations = false
# Template for sending OTP to users
template = "Your code is {{ .Code }}"
# Controls the minimum amount of time that must pass before sending another sms otp.
max_frequency = "5s"

# Use pre-defined map of phone number to OTP for testing.
# [auth.sms.test_otp]
# 4152127777 = "123456"

# Configure logged in session timeouts.
# [auth.sessions]
# Force log out after the specified duration.
# timebox = "24h"
# Force log out if the user has been inactive longer than the specified duration.
# inactivity_timeout = "8h"

# This hook runs before a new user is created and allows developers to reject the request based on the incoming user object.
# [auth.hook.before_user_created]
# enabled = true
# uri = "pg-functions://postgres/auth/before-user-created-hook"

# This hook runs before a token is issued and allows you to add additional claims based on the authentication method used.
# [auth.hook.custom_access_token]
# enabled = true
# uri = "pg-functions://<database>/<schema>/<hook_name>"

# Configure one of the supported SMS providers: `twilio`, `twilio_verify`, `messagebird`, `textlocal`, `vonage`.
[auth.sms.twilio]
enabled = false
account_sid = ""
message_service_sid = ""
# DO NOT commit your Twilio auth token to git. Use environment variable substitution instead:
auth_token = "env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)"

# Multi-factor-authentication is available to Supabase Pro plan.
[auth.mfa]
# Control how many MFA factors can be enrolled at once per user.
max_enrolled_factors = 10

# Control MFA via App Authenticator (TOTP)
[auth.mfa.totp]
enroll_enabled = false
verify_enabled = false

# Configure MFA via Phone Messaging
[auth.mfa.phone]
enroll_enabled = false
verify_enabled = false
otp_length = 6
template = "Your code is {{ .Code }}"
max_frequency = "5s"

# Configure MFA via WebAuthn
# [auth.mfa.web_authn]
# enroll_enabled = true
# verify_enabled = true

# Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,
# `discord`, `facebook`, `github`, `gitlab`, `google`, `keycloak`, `linkedin_oidc`, `notion`, `twitch`,
# `twitter`, `slack`, `spotify`, `workos`, `zoom`.
[auth.external.apple]
enabled = false
client_id = ""
# DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead:
secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"
# Overrides the default auth redirectUrl.
redirect_uri = ""
# Overrides the default auth provider URL. Used to support self-hosted gitlab, single-tenant Azure,
# or any other third-party OIDC providers.
url = ""
# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
skip_nonce_check = false

# Allow Solana wallet holders to sign in to your project via the Sign in with Solana (SIWS, EIP-4361) standard.
# You can configure "web3" rate limit in the [auth.rate_limit] section and set up [auth.captcha] if self-hosting.
[auth.web3.solana]
enabled = false

# Use Firebase Auth as a third-party provider alongside Supabase Auth.
[auth.third_party.firebase]
enabled = false
# project_id = "my-firebase-project"

# Use Auth0 as a third-party provider alongside Supabase Auth.
[auth.third_party.auth0]
enabled = false
# tenant = "my-auth0-tenant"
# tenant_region = "us"

# Use AWS Cognito (Amplify) as a third-party provider alongside Supabase Auth.
[auth.third_party.aws_cognito]
enabled = false
# user_pool_id = "my-user-pool-id"
# user_pool_region = "us-east-1"

# Use Clerk as a third-party provider alongside Supabase Auth.
[auth.third_party.clerk]
enabled = false
# Obtain from https://clerk.com/setup/supabase
# domain = "example.clerk.accounts.dev"

# OAuth server configuration
[auth.oauth_server]
# Enable OAuth server functionality
enabled = false
# Path for OAuth consent flow UI
authorization_url_path = "/oauth/consent"
# Allow dynamic client registration
allow_dynamic_registration = false

[edge_runtime]
enabled = true
# Supported request policies: `oneshot`, `per_worker`.
# `per_worker` (default) — enables hot reload during local development.
# `oneshot` — fallback mode if hot reload causes issues (e.g. in large repos or with symlinks).
policy = "per_worker"
# Port to attach the Chrome inspector for debugging edge functions.
inspector_port = 8083
# The Deno major version to use.
deno_version = 2

# [edge_runtime.secrets]
# secret_key = "env(SECRET_VALUE)"

[analytics]
enabled = true
port = 54327
# Configure one of the supported backends: `postgres`, `bigquery`.
backend = "postgres"

# Experimental features may be deprecated any time
[experimental]
# Configures Postgres storage engine to use OrioleDB (S3)
orioledb_version = ""
# Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com
s3_host = "env(S3_HOST)"
# Configures S3 bucket region, eg. us-east-1
s3_region = "env(S3_REGION)"
# Configures AWS_ACCESS_KEY_ID for S3 bucket
s3_access_key = "env(S3_ACCESS_KEY)"
# Configures AWS_SECRET_ACCESS_KEY for S3 bucket
s3_secret_key = "env(S3_SECRET_KEY)"



================================================
FILE: supabase/migrations/20251012120000_initial_schema.sql
================================================
-- =====================================================
-- Migration: Initial Schema Setup
-- Description: Creates the core database schema for VacationPlanner application
-- Date: 2025-10-12
-- 
-- Tables Created:
--   - travel_projects: User's travel planning projects
--   - notes: Free-form notes for attractions/activities
--   - ai_logs: Audit log for AI-generated itineraries
--
-- Additional Objects:
--   - ai_status enum type
--   - Indexes for query optimization
--   - Trigger for automatic updated_on timestamps
--   - Row-Level Security policies for data isolation
--
-- Prerequisites:
--   - Supabase Auth configured (provides auth.users table and auth.uid() function)
--   - pgcrypto extension for UUID generation
-- =====================================================

-- Enable required extensions
-- pgcrypto provides gen_random_uuid() function for UUID generation
create extension if not exists pgcrypto;

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- ai_status: Tracks the lifecycle of AI generation requests
-- Values:
--   - pending: AI generation request initiated but not completed
--   - success: AI successfully generated itinerary
--   - failure: AI generation failed (used for debugging and retry logic)
create type ai_status as enum ('pending', 'success', 'failure');

-- =====================================================
-- TABLES
-- =====================================================

-- -----------------------------------------------------
-- Table: travel_projects
-- Purpose: Stores user's vacation planning projects
-- Security: User-owned, RLS enabled
-- -----------------------------------------------------
create table travel_projects (
  id uuid primary key default gen_random_uuid(),
  -- Foreign key to Supabase Auth users table
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Project name (e.g., "Summer Trip to Italy")
  name text not null,
  -- Total duration of the trip in days
  duration_days integer not null,
  -- When the project was created
  created_on timestamptz not null default now(),
  -- Optional: the actual planned start date of the trip
  planned_date date null
);

-- Add comment for table documentation
comment on table travel_projects is 'User-owned travel planning projects containing notes and generating AI itineraries';
comment on column travel_projects.duration_days is 'Total number of days for the trip, used for itinerary generation';
comment on column travel_projects.planned_date is 'Actual planned start date of the trip (optional)';

-- -----------------------------------------------------
-- Table: notes
-- Purpose: Free-form notes about attractions, activities, and preferences
-- Security: Inherited from parent travel_projects, RLS enabled
-- -----------------------------------------------------
create table notes (
  id uuid primary key default gen_random_uuid(),
  -- Reference to parent travel project
  project_id uuid not null references travel_projects(id) on delete cascade,
  -- Free-form text content (e.g., "Visit Colosseum, opens at 9am")
  content text not null,
  -- Priority level for AI scheduling: 1 = high, 2 = medium, 3 = low
  priority smallint not null default 2 check (priority between 1 and 3),
  -- Optional tags for location/place names (array for future filtering)
  place_tags text[] null,
  -- Auto-updated timestamp of last modification
  updated_on timestamptz not null default now()
);

-- Add comment for table documentation
comment on table notes is 'Free-form notes about attractions and activities for a travel project';
comment on column notes.priority is 'Priority level for AI itinerary generation: 1 = must-see (high), 2 = should-see (medium), 3 = optional (low)';
comment on column notes.place_tags is 'Array of location/place tags for future filtering and grouping';

-- -----------------------------------------------------
-- Table: ai_logs
-- Purpose: Audit trail of AI-generated itineraries
-- Security: User-owned, RLS enabled
-- Note: Supports versioning - each regeneration increments version
-- -----------------------------------------------------
create table ai_logs (
  id uuid primary key default gen_random_uuid(),
  -- Foreign key to user (denormalized for direct access control)
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Foreign key to the project this generation is for
  project_id uuid not null references travel_projects(id) on delete cascade,
  -- The full prompt sent to the AI (stored for debugging and audit)
  prompt text not null,
  -- The AI response in JSON format (structured itinerary data)
  response jsonb not null,
  -- Current status of the AI generation request
  status ai_status not null,
  -- Time taken for AI to respond in milliseconds (null if pending)
  duration_ms integer null,
  -- Timestamp when the AI generation was initiated
  created_on timestamptz not null default now(),
  -- Version number for tracking regenerations (higher = more recent)
  version integer not null default 1
);

-- Add comment for table documentation
comment on table ai_logs is 'Audit log of AI-generated itineraries with versioning support';
comment on column ai_logs.version is 'Incremented on each regeneration; highest version is the latest itinerary';
comment on column ai_logs.duration_ms is 'AI response time in milliseconds, used for performance monitoring';
comment on column ai_logs.response is 'Structured JSON containing the generated day-by-day itinerary';

-- =====================================================
-- INDEXES
-- =====================================================

-- Index for filtering travel projects by user
create index idx_travel_projects_user_id on travel_projects(user_id);

-- Index for retrieving notes by project (most common query pattern)
create index idx_notes_project_id on notes(project_id);

-- GIN index for efficient array operations on place_tags
create index idx_notes_place_tags on notes using gin(place_tags);

-- Composite index for retrieving latest AI logs by project (version DESC for latest first)
create index idx_ai_logs_project_version on ai_logs(project_id, version desc);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Function to automatically update the updated_on timestamp
-- This ensures notes always have accurate modification timestamps
create or replace function update_updated_on_column()
returns trigger as $$
begin
  new.updated_on = now();
  return new;
end;
$$ language plpgsql;

-- Attach trigger to notes table
-- Fires before any UPDATE operation to refresh the updated_on timestamp
create trigger set_notes_updated_on
  before update on notes
  for each row
  execute function update_updated_on_column();

comment on function update_updated_on_column() is 'Automatically updates updated_on timestamp before row updates';

-- =====================================================
-- ROW-LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all user-scoped tables
-- This ensures users can only access their own data
-- DISABLED FOR NOW
-- alter table travel_projects enable row level security;
-- alter table notes enable row level security;
-- alter table ai_logs enable row level security;

-- -----------------------------------------------------
-- RLS Policies: travel_projects
-- Purpose: Users can only access their own travel projects
-- DISABLED FOR NOW
-- -----------------------------------------------------

-- Policy: Allow authenticated users to SELECT their own projects
-- create policy travel_projects_select_authenticated
--   on travel_projects
--   for select
--   to authenticated
--   using (user_id = auth.uid());

-- Policy: Allow authenticated users to INSERT their own projects
-- create policy travel_projects_insert_authenticated
--   on travel_projects
--   for insert
--   to authenticated
--   with check (user_id = auth.uid());

-- Policy: Allow authenticated users to UPDATE their own projects
-- create policy travel_projects_update_authenticated
--   on travel_projects
--   for update
--   to authenticated
--   using (user_id = auth.uid())
--   with check (user_id = auth.uid());

-- Policy: Allow authenticated users to DELETE their own projects
-- create policy travel_projects_delete_authenticated
--   on travel_projects
--   for delete
--   to authenticated
--   using (user_id = auth.uid());

-- -----------------------------------------------------
-- RLS Policies: notes
-- Purpose: Users can only access notes belonging to their projects
-- Strategy: Check project ownership through travel_projects join
-- DISABLED FOR NOW
-- -----------------------------------------------------

-- Policy: Allow authenticated users to SELECT notes from their projects
-- create policy notes_select_authenticated
--   on notes
--   for select
--   to authenticated
--   using (
--     exists (
--       select 1
--       from travel_projects tp
--       where tp.id = notes.project_id
--         and tp.user_id = auth.uid()
--     )
--   );

-- Policy: Allow authenticated users to INSERT notes into their projects
-- create policy notes_insert_authenticated
--   on notes
--   for insert
--   to authenticated
--   with check (
--     exists (
--       select 1
--       from travel_projects tp
--       where tp.id = notes.project_id
--         and tp.user_id = auth.uid()
--     )
--   );

-- Policy: Allow authenticated users to UPDATE notes in their projects
-- create policy notes_update_authenticated
--   on notes
--   for update
--   to authenticated
--   using (
--     exists (
--       select 1
--       from travel_projects tp
--       where tp.id = notes.project_id
--         and tp.user_id = auth.uid()
--     )
--   )
--   with check (
--     exists (
--       select 1
--       from travel_projects tp
--       where tp.id = notes.project_id
--         and tp.user_id = auth.uid()
--     )
--   );

-- Policy: Allow authenticated users to DELETE notes from their projects
-- create policy notes_delete_authenticated
--   on notes
--   for delete
--   to authenticated
--   using (
--     exists (
--       select 1
--       from travel_projects tp
--       where tp.id = notes.project_id
--         and tp.user_id = auth.uid()
--     )
--   );

-- -----------------------------------------------------
-- RLS Policies: ai_logs
-- Purpose: Users can only access their own AI generation logs
-- Note: Direct user_id check for performance (no join needed)
-- DISABLED FOR NOW
-- -----------------------------------------------------

-- Policy: Allow authenticated users to SELECT their own AI logs
-- create policy ai_logs_select_authenticated
--   on ai_logs
--   for select
--   to authenticated
--   using (user_id = auth.uid());

-- Policy: Allow authenticated users to INSERT their own AI logs
-- create policy ai_logs_insert_authenticated
--   on ai_logs
--   for insert
--   to authenticated
--   with check (user_id = auth.uid());

-- Policy: Allow authenticated users to UPDATE their own AI logs
-- create policy ai_logs_update_authenticated
--   on ai_logs
--   for update
--   to authenticated
--   using (user_id = auth.uid())
--   with check (user_id = auth.uid());

-- Policy: Allow authenticated users to DELETE their own AI logs
-- create policy ai_logs_delete_authenticated
--   on ai_logs
--   for delete
--   to authenticated
--   using (user_id = auth.uid());

-- =====================================================
-- END OF MIGRATION
-- =====================================================




================================================
FILE: supabase/migrations/20251016143000_add_request_metadata_to_ai_logs.sql
================================================
-- =====================================================
-- Migration: Add Request Metadata to ai_logs
-- Description: Adds request_body and response_code columns to ai_logs table
-- Date: 2025-10-16
-- 
-- Purpose:
--   Enhance ai_logs table to capture complete API request/response metadata
--   for better debugging, auditing, and monitoring of AI generation requests.
--
-- Tables Modified:
--   - ai_logs: Add request_body (JSONB) and response_code (INTEGER)
--
-- Backward Compatibility:
--   Existing rows will have NULL values for new columns initially.
--   Application code should handle NULL values for historical records.
-- =====================================================

-- Add request_body column to store the complete API request payload
-- This captures all parameters sent to the AI service (e.g., temperature, model, etc.)
-- JSONB format allows flexible storage and efficient querying of request parameters
alter table ai_logs 
  add column request_body jsonb null;

-- Add response_code column to store HTTP status code from AI service
-- Used for monitoring API health and debugging failed requests
-- Examples: 200 (success), 500 (server error), 429 (rate limit)
alter table ai_logs 
  add column response_code integer null;

-- Add column comments for documentation
comment on column ai_logs.request_body is 'Complete API request payload sent to AI service in JSON format';
comment on column ai_logs.response_code is 'HTTP status code from AI service response (e.g., 200, 500, 429)';

-- =====================================================
-- INDEX MODIFICATION
-- =====================================================

-- Drop the existing index that uses version field
-- The version field is less useful for time-based queries and sorting
drop index if exists idx_ai_logs_project_version;

-- Create new index using created_on for chronological ordering
-- This index optimizes queries that retrieve AI logs by project in chronological order
-- Most common use case: fetching latest AI generation for a project
create index idx_ai_logs_project_created_on on ai_logs(project_id, created_on desc);

comment on index idx_ai_logs_project_created_on is 'Optimizes queries for retrieving AI logs by project in chronological order (latest first)';

-- =====================================================
-- DATA MIGRATION NOTES
-- =====================================================
-- 
-- Existing rows will have NULL values for these columns.
-- Consider running a data migration script if historical records
-- need to be populated with default or reconstructed values.
-- 
-- Example: Set default response_code for successful historical records:
-- update ai_logs 
--   set response_code = 200 
--   where status = 'success' and response_code is null;
-- =====================================================

-- =====================================================
-- END OF MIGRATION
-- =====================================================




================================================
FILE: supabase/migrations/20251105_enable_rls_policies.sql
================================================
-- =====================================================
-- Migration: Enable Row-Level Security (RLS) Policies
-- Description: Enables RLS on all tables and creates policies for user data isolation
-- Date: 2025-11-05
-- 
-- Purpose:
--   This migration enables authentication-based access control by:
--   1. Enabling RLS on travel_projects, notes, and ai_logs tables
--   2. Creating policies that use auth.uid() for user verification
--   3. Ensuring users can only access their own data
--
-- Prerequisites:
--   - Initial schema migration (20251012120000_initial_schema.sql) completed
--   - Supabase Auth configured and user accounts created
--
-- Testing After Migration:
--   1. Create test user in Supabase Dashboard
--   2. Verify user can only access their own projects
--   3. Verify user cannot access other users' data
-- =====================================================

-- =====================================================
-- ENABLE ROW-LEVEL SECURITY
-- =====================================================

-- Enable RLS on all user-scoped tables
-- Once enabled, NO data is accessible unless explicitly allowed by policies
ALTER TABLE travel_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: travel_projects
-- Purpose: Users can only access their own travel projects
-- =====================================================

-- Policy: Allow authenticated users to SELECT their own projects
CREATE POLICY travel_projects_select_policy
  ON travel_projects
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Allow authenticated users to INSERT their own projects
-- WITH CHECK ensures user_id matches the authenticated user
CREATE POLICY travel_projects_insert_policy
  ON travel_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to UPDATE their own projects
-- USING checks current ownership, WITH CHECK ensures it stays owned by same user
CREATE POLICY travel_projects_update_policy
  ON travel_projects
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to DELETE their own projects
CREATE POLICY travel_projects_delete_policy
  ON travel_projects
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- RLS POLICIES: notes
-- Purpose: Users can only access notes belonging to their projects
-- Strategy: Check project ownership through travel_projects join
-- =====================================================

-- Policy: Allow authenticated users to SELECT notes from their projects
CREATE POLICY notes_select_policy
  ON notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to INSERT notes into their projects
CREATE POLICY notes_insert_policy
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to UPDATE notes in their projects
CREATE POLICY notes_update_policy
  ON notes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to DELETE notes from their projects
CREATE POLICY notes_delete_policy
  ON notes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES: ai_logs
-- Purpose: Users can only access their own AI generation logs
-- Note: Can verify via user_id OR via project ownership
-- Using user_id directly for performance (no join needed)
-- =====================================================

-- Policy: Allow authenticated users to SELECT their own AI logs
CREATE POLICY ai_logs_select_policy
  ON ai_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Allow authenticated users to INSERT their own AI logs
CREATE POLICY ai_logs_insert_policy
  ON ai_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to UPDATE their own AI logs
-- Note: Updates are rare, but included for completeness
CREATE POLICY ai_logs_update_policy
  ON ai_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to DELETE their own AI logs
CREATE POLICY ai_logs_delete_policy
  ON ai_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- VERIFICATION QUERIES (for testing after migration)
-- =====================================================

-- To test RLS policies after migration, run these queries as different users:
-- 
-- 1. Check if RLS is enabled:
--    SELECT tablename, rowsecurity 
--    FROM pg_tables 
--    WHERE schemaname = 'public' 
--    AND tablename IN ('travel_projects', 'notes', 'ai_logs');
--
-- 2. List all policies:
--    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
--    FROM pg_policies
--    WHERE tablename IN ('travel_projects', 'notes', 'ai_logs')
--    ORDER BY tablename, policyname;
--
-- 3. Test data isolation (as authenticated user):
--    SELECT * FROM travel_projects;  -- Should only return user's own projects
--    SELECT * FROM notes;            -- Should only return notes from user's projects
--    SELECT * FROM ai_logs;          -- Should only return user's own AI logs

-- =====================================================
-- END OF MIGRATION
-- =====================================================




================================================
FILE: .ai/api-plan.md
================================================
# REST API Plan

## 1. Resources
- **User** (`users`)
- **Travel Project** (`travel_projects`)
- **Note** (`notes`)
- **AI Log** (`ai_logs`)

## 2. Endpoints


### 2.2 Profile & Preferences

#### Get Profile
- Method: GET
- Path: `/users/me`
- Description: Get current user profile
- Response (200):
  ```json
  { "id": "uuid", "email": "string", "preferences": {"categories": []} }
  ```

#### Update Preferences
- Method: PATCH
- Path: `/users/me/preferences`
- Description: Update tourism preferences
- Request:
  ```json
  { "preferences": { "categories": ["beach", "mountains"] } }
  ```
- Response (200):
  ```json
  { "preferences": { ... } }
  ```

### 2.3 Travel Projects

#### List Projects
- Method: GET
- Path: `/projects`
- Description: Paginated list of user’s projects
- Query Params: `?page=1&size=20&sort=created_on&order=desc`
- Response (200):
  ```json
  { "data": [ { "id": "uuid", "name": "string", "duration_days": 3, "planned_date": "YYYY-MM-DD" } ], "meta": { "page":1,"size":20,"total":N } }
  ```

#### Create Project
- Method: POST
- Path: `/projects`
- Request:
  ```json
  { "name": "string", "duration_days": integer, "planned_date": "YYYY-MM-DD" }
  ```
- Response (201): Created project object
- Validation: `name` nonempty, `duration_days` ≥1

#### Get Project
- Method: GET
- Path: `/projects/{projectId}`

#### Update Project
- Method: PATCH
- Path: `/projects/{projectId}`
- Request: same as create (all optional)

#### Delete Project
- Method: DELETE
- Path: `/projects/{projectId}`

### 2.4 Notes

#### List Notes
- Method: GET
- Path: `/projects/{projectId}/notes`
- Query: `?page=1&size=20&priority=1&place_tag=Paris`

#### Create Note
- Method: POST
- Path: `/projects/{projectId}/notes`
- Request:
  ```json
  { "content":"string","priority":1,"place_tags":["string"] }
  ```
- Response (201): Created note object
- Validation: `content` nonempty, `priority` between 1 and 3

#### Get Note
- Method: GET
- Path: `/projects/{projectId}/notes/{noteId}`

#### Update Note
- Method: PATCH
- Path: `/projects/{projectId}/notes/{noteId}`

#### Delete Note
- Method: DELETE
- Path: `/projects/{projectId}/notes/{noteId}`

### 2.5 AI Plan Generation

#### Generate Plan
- Method: POST
- Path: `/projects/{projectId}/plan`
- Description: Synchronous AI plan generation
- Request:
  ```json
  {
    "model": "gpt-5",                   // AI model to use
    "notes": [                           // all notes in project
      { "id": "uuid", "content": "string", "priority": 1, "place_tags": ["string"] }
    ],
    "preferences": { "categories": ["string"] }  // user profile preferences
  }
  ```
- Response (200):
  ```json
  { "schedule": [ { "day":1,"activities":["..."] } ] }
  ```
- Errors:
  - 400: Invalid Input
  - 500: AI service errors
- On request, server logs to `ai_logs` with status `pending`, updates to `success`/`failure` and increments `version`

#### Get AI Logs
- Method: GET
- Path: `/projects/{projectId}/logs`
- Query: `?page=1&size=20`

#### Get AI Log by ID
- Method: GET
- Path: `/projects/{projectId}/logs/{logId}`
- Description: Retrieve a specific AI log entry
- Response (200):
  ```json
  { "id": "uuid", "project_id": "uuid", "prompt": "string", "response": {}, "status": "success", "duration_ms": 123, "version": 1, "created_on": "timestamp" }
  ```

#### List Failed AI Logs
- Method: GET
- Path: `/logs/failed`
- Description: Retrieve all AI log entries with status failure
- Query Params: `?page=1&size=20`
- Response (200):
  ```json
  { "data": [ /* array of ai_logs with status='failure' */ ], "meta": { "page":1,"size":20,"total":N } }
  ```

## 3. Authentication and Authorization
- Token-based authentication using Supabase Auth via `Authorization: Bearer <token>` header
- Users authenticate via `/auth/register` or `/auth/login` to receive a bearer token
- Protected endpoints require a valid token; user_id is enforced as JWT sub
- RLS policies enforced at DB layer where possible

## 4. Validation and Business Logic

### Validation
- `users.email`: valid email format
- `password`: minimum 8 chars
- `projects.name`: nonempty
- `duration_days` (optional): integer ≥1
- `planned_date` (optional): valid date
- `notes.content`: nonempty
- `priority`: integer 1–3
- `place_tags` (optional): array of strings

### Business Logic
- AI plan generation: synchronous call with spinner and retry on failure
- Log all AI interactions in `


================================================
FILE: .ai/API_QUICK_REFERENCE.md
================================================
# API Quick Reference Guide

Base URL: `http://localhost:4321/api` (or your deployment URL)

## Projects API

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/projects` | Create project | DEFAULT_USER_ID |
| GET | `/projects` | List projects | DEFAULT_USER_ID |
| GET | `/projects/{id}` | Get project | DEFAULT_USER_ID |
| PATCH | `/projects/{id}` | Update project | DEFAULT_USER_ID |
| DELETE | `/projects/{id}` | Delete project | DEFAULT_USER_ID |

### Create Project
```json
POST /projects
{
  "name": "Summer Trip",
  "duration_days": 7,
  "planned_date": "2026-06-15"  // optional
}
→ 201 Created
```

### List Projects
```
# All parameters are optional!
GET /projects
GET /projects?page=1&size=20
GET /projects?sort=name&order=asc
→ 200 OK
{
  "data": [...],
  "meta": { "page": 1, "size": 20, "total": 5 }
}

# Defaults: page=1, size=20, sort=created_on, order=desc
```

### Update Project
```json
PATCH /projects/{id}
{
  "name": "Updated Trip",  // all fields optional
  "duration_days": 10
}
→ 200 OK
```

### Delete Project
```
DELETE /projects/{id}
→ 204 No Content
```

---

## Notes API

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/projects/{projectId}/notes` | Create note | DEFAULT_USER_ID |
| GET | `/projects/{projectId}/notes` | List notes | DEFAULT_USER_ID |
| GET | `/projects/{projectId}/notes/{noteId}` | Get note | DEFAULT_USER_ID |
| PATCH | `/projects/{projectId}/notes/{noteId}` | Update note | DEFAULT_USER_ID |
| DELETE | `/projects/{projectId}/notes/{noteId}` | Delete note | DEFAULT_USER_ID |

### Create Note
```json
POST /projects/{projectId}/notes
{
  "content": "Visit Eiffel Tower",
  "priority": 1,  // 1=high, 2=medium, 3=low
  "place_tags": ["Paris", "Landmarks"]  // optional
}
→ 201 Created
```

### List Notes
```
# All parameters are optional!
GET /projects/{projectId}/notes
GET /projects/{projectId}/notes?page=1&size=20
GET /projects/{projectId}/notes?priority=1
GET /projects/{projectId}/notes?place_tag=Paris
→ 200 OK
{
  "data": [...],
  "meta": { "page": 1, "size": 20, "total": 3 }
}

# Defaults: page=1, size=20
```

### Update Note
```json
PATCH /projects/{projectId}/notes/{noteId}
{
  "content": "Updated content",  // all fields optional
  "priority": 2
}
→ 200 OK
```

### Delete Note
```
DELETE /projects/{projectId}/notes/{noteId}
→ 204 No Content
```

---

## AI Plan Generation

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/projects/{projectId}/plan` | Generate AI plan | DEFAULT_USER_ID |

### Generate Plan
```json
POST /projects/{projectId}/plan
{
  "model": "gpt-4",
  "notes": [
    {
      "id": "uuid",
      "content": "Visit Eiffel Tower",
      "priority": 1,
      "place_tags": ["Paris"]
    }
  ],
  "preferences": {  // optional
    "categories": ["culture", "history"]
  }
}
→ 200 OK
{
  "schedule": [
    { "day": 1, "activities": ["Morning: Eiffel Tower", "..."] }
  ]
}
```

---

## Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful read/update |
| 201 | Created | Successful create |
| 204 | No Content | Successful delete |
| 400 | Bad Request | Validation error, invalid input |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Database/server error |

---

## Common Parameters

**⚠️ ALL PARAMETERS ARE OPTIONAL** - The API works without any parameters!

### Pagination (Optional)
- `page` (integer, optional, default: 1) - Page number
- `size` (integer, optional, default: 20, max: 100) - Items per page

### Projects Sorting (Optional)
- `sort` (string, optional, default: "created_on") - Field to sort by
  - Options: `created_on`, `name`, `duration_days`, `planned_date`
  - Invalid values are ignored and default to `created_on`
- `order` (string, optional, default: "desc") - Sort order
  - Options: `asc`, `desc`
  - Invalid values are ignored and default to `desc`

### Notes Filtering (Optional)
- `priority` (integer, optional, 1-3) - Filter by priority
  - Invalid values are ignored (no filtering applied)
- `place_tag` (string, optional) - Filter by place tag

---

## Validation Rules

### Projects
- `name`: non-empty string (required)
- `duration_days`: integer ≥ 1 (required)
- `planned_date`: YYYY-MM-DD format (optional)

### Notes
- `content`: non-empty string (required)
- `priority`: integer 1-3 (required)
  - 1 = High priority
  - 2 = Medium priority
  - 3 = Low priority
- `place_tags`: array of strings (optional)

### AI Plan
- `model`: one of ["gpt-4", "gpt-5", "claude-3-opus", "claude-3.5-sonnet"]
- `notes`: array, 1-100 items
- `preferences.categories`: array of strings (optional)

---

## Error Response Format

```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_small",
      "path": ["duration_days"],
      "message": "Duration must be at least 1"
    }
  ]
}
```

---

## Quick Start Example

```bash
# 1. Create a project
curl -X POST http://localhost:4321/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Paris Trip", "duration_days": 5}'

# Response: { "id": "abc-123", ... }

# 2. Add a note
curl -X POST http://localhost:4321/api/projects/abc-123/notes \
  -H "Content-Type: application/json" \
  -d '{"content": "Visit Louvre", "priority": 1, "place_tags": ["Paris"]}'

# 3. List all notes
curl http://localhost:4321/api/projects/abc-123/notes

# 4. Generate plan
curl -X POST http://localhost:4321/api/projects/abc-123/plan \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4", "notes": [{"id": "note-id", "content": "Visit Louvre", "priority": 1, "place_tags": ["Paris"]}]}'
```

---

## Files & Schemas

### Service Files
- `src/services/project.service.ts` - Project operations
- `src/services/note.service.ts` - Note operations
- `src/services/plan.service.ts` - AI plan generation
- `src/services/ai.service.mock.ts` - Mock AI service

### Schema Files
- `src/lib/schemas/project.schema.ts` - Project validation
- `src/lib/schemas/note.schema.ts` - Note validation
- `src/lib/schemas/plan.schema.ts` - Plan validation

### Utility Files
- `src/lib/api-utils.ts` - Error handling, responses, auth helpers
- `src/types.ts` - TypeScript type definitions

---

## Testing

See test files:
- `.ai/project-creation-tests.md` (10 test cases)
- `.ai/note-creation-tests.md` (14 test cases)
- `.ai/implementation-plans/all-endpoints-tests.md` (All endpoints)

Import curl commands to Postman for easy testing.

---

## Current Limitations

⚠️ **Authentication**: Currently using `DEFAULT_USER_ID` constant
- JWT authentication planned for future implementation
- All endpoints will require Bearer token authentication

✅ **Database**: Full PostgreSQL via Supabase
✅ **Validation**: Comprehensive Zod schemas
✅ **Error Handling**: Centralized and consistent
✅ **Documentation**: Complete JSDoc comments




================================================
FILE: .ai/auth-spec.md
================================================
# Authentication Architecture Specification - VacationPlanner

## Document Information

**Version:** 1.0  
**Date:** November 3, 2025  
**Requirements:** US-001, US-002, US-003, US-004 from PRD  
**Tech Stack:** Astro 5, React 19, TypeScript 5, Supabase Auth, Tailwind 4

---

## Executive Summary

This document defines the technical architecture for implementing user authentication in VacationPlanner. The system will provide login and logout functionality using Supabase Auth as the authentication provider. The architecture maintains compatibility with the existing SSR (Server-Side Rendering) model configured in Astro and ensures all existing features continue to work without disruption.

Key architectural decisions:
- **Server-Side Session Management**: Leverage Supabase Auth with server-side session verification
- **Cookie-Based Authentication**: Use HTTP-only cookies for secure token storage
- **Middleware-Based Protection**: Implement route protection at the middleware layer
- **Graceful Degradation**: Authenticated and non-authenticated states clearly separated
- **Minimal MVP**: Login/logout only - user accounts created manually via Supabase Dashboard or by system admin

---

## 1. USER INTERFACE ARCHITECTURE

### 1.1 Page Structure Overview

The authentication system introduces new pages and modifies existing ones to support authenticated and non-authenticated states.

#### 1.1.1 New Authentication Pages

All authentication pages will be Astro pages (`.astro`) that render forms using React components for interactivity. This follows the existing pattern where Astro handles routing and SSR, while React provides client-side interactivity.

**Page: `/login`** (`src/pages/auth/login.astro`)
- **Purpose**: User login interface
- **Accessibility**: Public (unauthenticated only - authenticated users redirect to `/projects`)
- **Components**: LoginForm (React component)
- **Layout**: AuthLayout (new minimal layout without main navigation)
- **Server Logic**: Check if user is already authenticated; if yes, redirect to `/projects`

#### 1.1.2 Modified Existing Pages

**Page: `/` (`src/pages/index.astro`)**
- **Current State**: Shows Welcome component
- **New Behavior**:
  - If **unauthenticated**: Show landing page with login button
  - If **authenticated**: Redirect to `/projects`
- **Components**: 
  - LandingPage (new Astro component replacing Welcome)
  - Includes hero section, feature highlights, CTA button to login
- **Server Logic**: Check authentication status in Astro frontmatter; redirect authenticated users

**Page: `/projects`** (`src/pages/projects/index.astro`)
- **Current State**: Public access, shows ProjectsPage
- **New Behavior**: Protected route - requires authentication
- **Components**: ProjectsPage (existing, no changes)
- **Server Logic**: Middleware will handle redirect to `/login` if unauthenticated
- **Layout**: Layout.astro (extended with user menu)

**Page: `/projects/[projectId]/notes`** (`src/pages/projects/[projectId]/notes.astro`)
- **Current State**: Public access
- **New Behavior**: Protected route - requires authentication
- **Server Logic**: Middleware will handle redirect to `/login` if unauthenticated
- **Layout**: Layout.astro (extended with user menu)

### 1.2 Layout Architecture

#### 1.2.1 AuthLayout (`src/layouts/AuthLayout.astro`)

New minimal layout for authentication pages (login, register, password reset).

**Features:**
- Centered card-based design
- No main navigation
- Theme toggle in top-right corner (reuses ThemeToggle component)
- Toaster for notifications
- Background with subtle gradient

**Structure:**
```astro
<!doctype html>
<html lang="en">
  <head>...</head>
  <body>
    <ThemeToggle />
    <main class="min-h-screen flex items-center justify-center p-4">
      <slot />
    </main>
    <Toaster />
  </body>
</html>
```

#### 1.2.2 Layout.astro (Modified)

Extended to support authenticated state and user menu.

**Changes:**
- Add navigation header with:
  - Logo/App name (left)
  - Navigation links: Projects (for authenticated users)
  - User menu (right): Shows user email and Logout button
- ThemeToggle remains in fixed top-right position
- Responsive navigation for mobile

**User Menu Component** (`src/components/UserMenu.tsx`) - React
- Displays user email
- Dropdown menu with single action:
  - "Logout" button → triggers logout API call
- Uses Shadcn/ui DropdownMenu component

**Navigation Links:**
- "Projects" → `/projects` (visible only when authenticated)

### 1.3 React Components Architecture

All forms are interactive React components using controlled inputs with client-side validation. Form submission calls API endpoints using `fetch`.

#### 1.3.1 LoginForm Component

**Location:** `src/components/auth/LoginForm.tsx`

**Props:** None (standalone)

**State:**
- `email: string` - controlled input
- `password: string` - controlled input
- `isLoading: boolean` - submission state
- `error: string | null` - error message from API

**Validation:**
- Email: Required, valid email format
- Password: Required, minimum 6 characters (client-side)

**User Flow:**
1. User enters email and password
2. Client validates inputs
3. On submit:
   - Disable form, show loading state
   - POST to `/api/auth/login` with credentials
   - On success (200): Reload page or redirect to `/projects`
   - On error (400/401/500): Display error message below form

**Error Messages:**
- 400: "Invalid email or password format"
- 401: "Invalid credentials. Please try again."
- 500: "An unexpected error occurred. Please try again later."

**Accessibility:**
- Labels for all inputs
- Error messages associated with inputs via `aria-describedby`
- Submit button disabled during loading with `aria-busy`
- Focus management: on error, focus first invalid field

#### 1.3.2 UserMenu Component

**Location:** `src/components/UserMenu.tsx`

**Props:**
- `userEmail: string` - displayed in dropdown

**Features:**
- Email initial badge (first letter of email)
- Dropdown menu (Shadcn DropdownMenu)
- Single menu item:
  - Logout → calls logout API and reloads page

**Logout Flow:**
1. User clicks "Logout"
2. POST to `/api/auth/logout`
3. On success: `window.location.href = '/'` (reload to clear state)
4. On error: Display toast notification

### 1.4 Client-Side Routing and Navigation

**Redirects After Authentication Actions:**
- After successful login → `/projects`
- After logout → `/` (home page)

**Protected Route Behavior:**
- Middleware intercepts protected routes
- If not authenticated → redirect to `/login?redirect={original_path}`
- After login → redirect to original requested path (or `/projects` by default)

### 1.5 Error Handling and User Feedback

#### 1.5.1 Form Validation Errors

**Display Strategy:** Inline errors below form fields
- Red border on invalid input
- Error icon + message below field
- Error message connected via `aria-describedby`
- First invalid field receives focus

**Validation Timing:**
- On blur: Validate individual field
- On submit: Validate all fields
- On change (after first blur): Real-time validation

#### 1.5.2 API Errors

**Display Strategy:** Alert/banner above form
- Error icon + error message
- Dismissible close button
- Color-coded by severity (red for errors)

**Common Error Scenarios:**
- Network error: "Unable to connect. Please check your internet connection."
- 500 Server error: "An unexpected error occurred. Please try again later."
- 401 Unauthorized: "Your session has expired. Please log in again."
- 429 Rate limit: "Too many attempts. Please try again in X minutes."

#### 1.5.3 Success Messages

**Display Strategy:** 
- Toast notifications (using Sonner) for non-critical actions
- In-page success messages for critical flows (registration, password reset)
- Success messages include:
  - Checkmark icon
  - Clear success text
  - Next action guidance

**Examples:**
- Login success: Auto-redirect to projects (seamless experience)
- Logout success: Redirect to home page

### 1.6 Accessibility Considerations

All authentication forms and components will follow WCAG 2.1 Level AA standards:

- **Keyboard Navigation:** All interactive elements accessible via Tab, Enter, Escape
- **Screen Reader Support:**
  - Proper heading hierarchy (h1 → h2 → h3)
  - ARIA labels for icon buttons
  - ARIA live regions for dynamic error/success messages
  - Form field labels properly associated
- **Focus Management:**
  - Visible focus indicators on all interactive elements
  - Focus trapped in modals/dialogs
  - Focus moved to first error on validation failure
- **Color Contrast:** Minimum 4.5:1 ratio for text, 3:1 for UI components
- **Error Identification:** Errors identified by text, not color alone

---

## 2. BACKEND LOGIC

### 2.1 API Endpoints Structure

All authentication endpoints follow REST conventions and are located in `src/pages/api/auth/`.

#### 2.1.1 POST `/api/auth/login`

**Purpose:** Authenticate user and create session

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Validation Schema:**
```typescript
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
```

**Server Logic:**
1. Parse and validate request body
2. Call Supabase Auth `signInWithPassword()` with credentials
3. On success, Supabase returns session with access_token and refresh_token
4. Set HTTP-only cookies:
   - `sb-access-token` (access token, httpOnly, secure, sameSite: lax)
   - `sb-refresh-token` (refresh token, httpOnly, secure, sameSite: lax)
5. Return success response with user info

**Response 200 Success:**
```typescript
{
  user: {
    id: string;
    email: string;
  },
  message: "Login successful"
}
```

**Error Responses:**
- 400: Validation error
- 401: Invalid credentials
- 500: Server error

**Implementation File:** `src/pages/api/auth/login.ts`

**Service Dependency:** `AuthService.login()` + cookie management

**Cookie Settings:**
- Path: `/`
- MaxAge: 7 days (refresh token), 1 hour (access token)
- HttpOnly: true
- Secure: true (production only)
- SameSite: "lax"

---

#### 2.1.2 POST `/api/auth/logout`

**Purpose:** Terminate user session

**Request Body:** None (reads cookies)

**Server Logic:**
1. Extract access token from `sb-access-token` cookie
2. Call Supabase Auth `signOut()` with token
3. Clear authentication cookies (set MaxAge to 0)
4. Return success response

**Response 200 Success:**
```typescript
{
  message: "Logout successful"
}
```

**Error Responses:**
- 500: Server error

**Implementation File:** `src/pages/api/auth/logout.ts`

**Note:** This endpoint should succeed even if token is invalid/expired (logout is idempotent)

---

### 2.2 Service Layer

All authentication business logic is encapsulated in the `AuthService` class.

#### 2.2.1 AuthService Class

**Location:** `src/services/auth.service.ts`

**Responsibilities:**
- Interact with Supabase Auth API
- Manage user sessions
- Handle user login and logout

**Class Structure:**

```typescript
export class AuthService {
  /**
   * Authenticate user and return session
   */
  async login(
    email: string, 
    password: string, 
    db: DbClient
  ): Promise<LoginResult>

  /**
   * Sign out user (invalidate session)
   */
  async logout(
    accessToken: string, 
    db: DbClient
  ): Promise<void>

  /**
   * Verify user session (used by middleware)
   */
  async verifySession(
    accessToken: string, 
    db: DbClient
  ): Promise<User | null>
}

export const authService = new AuthService();
```

**Error Handling:**
- Throws `ApiError` with appropriate status codes
- Logs errors for debugging
- Sanitizes error messages before returning to client

---

### 2.3 Data Models and Database Schema

#### 2.3.1 User Authentication (Managed by Supabase Auth)

Supabase manages the `auth.users` table internally. We don't modify this table directly.

**Fields available from Supabase Auth:**
- `id` (UUID) - user ID
- `email` (string) - user email
- `created_at` (timestamp) - account creation date
- `encrypted_password` (string) - hashed password (not accessible)

**Note:** User accounts must be created manually via Supabase Dashboard by system administrators.

#### 2.3.2 Updated Travel Projects Table

**Table Name:** `travel_projects`

**Current Schema:** Already has `user_id` field

**RLS Update Required:** Ensure policies reference `auth.uid()` instead of hardcoded user ID

**Updated RLS Policies:**
```sql
-- Drop existing policies (if any)
DROP POLICY IF EXISTS travel_projects_select_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_insert_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_update_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_delete_policy ON travel_projects;

-- Users can only see their own projects
CREATE POLICY travel_projects_select_policy ON travel_projects
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own projects
CREATE POLICY travel_projects_insert_policy ON travel_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own projects
CREATE POLICY travel_projects_update_policy ON travel_projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own projects
CREATE POLICY travel_projects_delete_policy ON travel_projects
  FOR DELETE USING (auth.uid() = user_id);
```

**Migration File:** `supabase/migrations/20251103_update_rls_policies.sql`

#### 2.3.3 Updated Notes Table

**Table Name:** `notes`

Notes are linked to projects, so RLS policies should verify project ownership.

**Updated RLS Policies:**
```sql
-- Drop existing policies
DROP POLICY IF EXISTS notes_select_policy ON notes;
DROP POLICY IF EXISTS notes_insert_policy ON notes;
DROP POLICY IF EXISTS notes_update_policy ON notes;
DROP POLICY IF EXISTS notes_delete_policy ON notes;

-- Users can only see notes from their projects
CREATE POLICY notes_select_policy ON notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = notes.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );

-- Users can only insert notes into their projects
CREATE POLICY notes_insert_policy ON notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = notes.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );

-- Users can only update notes from their projects
CREATE POLICY notes_update_policy ON notes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = notes.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );

-- Users can only delete notes from their projects
CREATE POLICY notes_delete_policy ON notes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = notes.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );
```

**Migration File:** Same as above (`20251103_update_rls_policies.sql`)

#### 2.3.4 Updated AI Logs Table

**Table Name:** `ai_logs`

AI logs are linked to projects, so RLS policies should verify project ownership.

**Updated RLS Policies:**
```sql
-- Drop existing policies
DROP POLICY IF EXISTS ai_logs_select_policy ON ai_logs;
DROP POLICY IF EXISTS ai_logs_insert_policy ON ai_logs;

-- Users can only see AI logs from their projects
CREATE POLICY ai_logs_select_policy ON ai_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = ai_logs.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );

-- Service can insert AI logs for user's projects
CREATE POLICY ai_logs_insert_policy ON ai_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM travel_projects 
      WHERE travel_projects.id = ai_logs.project_id 
      AND travel_projects.user_id = auth.uid()
    )
  );
```

**Migration File:** Same as above (`20251103_update_rls_policies.sql`)

---

### 2.4 Input Validation

All input validation uses Zod schemas located in `src/lib/schemas/auth.schema.ts`.

**New Schema File:** `src/lib/schemas/auth.schema.ts`

**Schema Definitions:**
- `loginSchema` - validates login input

**Validation Rules:**
- **Email:** Must be valid email format (RFC 5322 compliant)
- **Password:** Minimum 8 characters (client-side validation)

**Error Response Format** (consistent with existing API):
```typescript
{
  error: "Validation Error",
  message: "Invalid input data",
  details: [
    {
      field: "password",
      message: "Password must be at least 8 characters"
    }
  ]
}
```

---

### 2.5 Exception Handling

Exception handling follows the existing pattern using `ApiError` class and `handleApiError` utility.

**Error Categories:**

1. **Validation Errors (400):**
   - Invalid email format
   - Password doesn't meet requirements
   - Missing required fields

2. **Authentication Errors (401):**
   - Invalid credentials
   - Expired or invalid token
   - Session expired

3. **Resource Errors (404):**
   - User not found (internal use only, not exposed to client)

4. **Rate Limit Errors (429):**
   - Too many login attempts

5. **Server Errors (500):**
   - Database connection errors
   - Supabase API errors
   - Unexpected server errors

**Error Logging:**
- All errors logged with `console.error()`
- Include error type, message, stack trace
- For production: Use structured logging with error tracking service (e.g., Sentry)

**Error Sanitization:**
- Never expose internal error details to client
- Generic error messages for 500 errors
- Specific error messages for validation/authentication errors only

---

### 2.6 Server-Side Rendering Updates

#### 2.6.1 Middleware Enhancement

**File:** `src/middleware/index.ts`

**Current Implementation:**
- Attaches Supabase client to `context.locals`

**Updated Implementation:**
- Attach Supabase client
- Extract access token from cookies
- Verify session with Supabase Auth
- Attach user to `context.locals.user` if authenticated
- Handle route protection (redirect unauthenticated users from protected routes)

**Enhanced Middleware Logic:**

```typescript
import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  // Attach Supabase client
  context.locals.supabase = supabaseClient;

  // Extract access token from cookie
  const accessToken = context.cookies.get("sb-access-token")?.value;

  // If access token exists, verify session
  if (accessToken) {
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);
    
    if (!error && user) {
      context.locals.user = user;
    }
  }

  // Define protected routes
  const protectedRoutes = ['/projects'];
  const authRoutes = ['/login'];
  const pathname = new URL(context.request.url).pathname;

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !context.locals.user) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Redirect authenticated users from auth pages to projects
  if (isAuthRoute && context.locals.user) {
    return context.redirect('/projects');
  }

  return next();
});
```

**Updated `env.d.ts` Type Definitions:**

```typescript
import type { User } from "@supabase/supabase-js";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      user?: User; // Add user to locals
    }
  }
}
```

#### 2.6.2 Page-Level Authentication Checks

While middleware handles redirects, individual pages should also check authentication status for conditional rendering.

**Example:** `src/pages/projects/index.astro`

```astro
---
import Layout from "../../layouts/Layout.astro";
import { ProjectsPage } from "../../components/ProjectsPage";

// User is guaranteed to be authenticated here (middleware redirected if not)
const user = Astro.locals.user;
---

<Layout title="Projects | VacationPlanner">
  <ProjectsPage client:load />
</Layout>
```

#### 2.6.3 API Endpoint Authentication

**Pattern for Protected API Endpoints:**

```typescript
export const GET: APIRoute = async (context) => {
  try {
    // Extract user from context (set by middleware)
    const user = context.locals.user;
    
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userId = user.id;

    // Proceed with authorized logic
    // ...
  } catch (error) {
    return handleApiError(error);
  }
};
```

**Alternative: Use `verifyUser()` utility** (for endpoints that need explicit token verification)

```typescript
export const GET: APIRoute = async (context) => {
  try {
    // Verify user and get user ID from token in Authorization header
    const userId = await verifyUser(context);

    // Proceed with authorized logic
    // ...
  } catch (error) {
    return handleApiError(error);
  }
};
```

**Recommendation:** Use `context.locals.user` for most protected pages and endpoints (middleware already verified). Use `verifyUser()` only for API endpoints that might be called from external clients with Authorization header.

---

## 3. AUTHENTICATION SYSTEM

### 3.1 Supabase Auth Integration

VacationPlanner leverages Supabase Auth for all authentication functionality. Supabase provides:

- User registration with email/password
- Email verification with magic links
- Password reset with magic links
- Session management with JWT tokens
- Secure password hashing (bcrypt)

#### 3.1.1 Supabase Configuration

**Environment Variables:**

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

**Supabase Dashboard Configuration:**

1. **Auth Providers:**
   - Email/Password enabled
   - No OAuth providers in MVP (can be added later)

2. **Email Settings:**
   - Disable email confirmations for signups (users can login immediately after registration)
   - Auto-confirm emails: Enabled

3. **User Management:**
   - Email confirmation NOT required before login
   - Users can access the app immediately after registration

#### 3.1.2 Session Management

**Session Flow:**

1. **Login:**
   - User provides email/password
   - Supabase verifies credentials
   - Supabase returns session object with:
     - `access_token` (JWT, expires in 1 hour)
     - `refresh_token` (expires in 7 days)
   - Server stores tokens in HTTP-only cookies

2. **Session Verification:**
   - Middleware reads `access_token` from cookie
   - Calls `supabase.auth.getUser(accessToken)` to verify
   - If valid, user is authenticated
   - If expired, attempt refresh using `refresh_token`

3. **Token Refresh:**
   - Middleware detects expired access token
   - Uses refresh token to get new access token
   - Updates cookies with new tokens
   - Continues request with refreshed session

4. **Logout:**
   - Client calls logout endpoint
   - Server calls `supabase.auth.signOut()`
   - Clears all auth cookies
   - Redirects to home page

**Token Storage Strategy:**

- **Access Token:** HTTP-only cookie, expires in 1 hour
- **Refresh Token:** HTTP-only cookie, expires in 7 days
- **Cookie Attributes:**
  - `HttpOnly`: Prevents JavaScript access (XSS protection)
  - `Secure`: Only sent over HTTPS (production)
  - `SameSite: Lax`: CSRF protection
  - `Path: /`: Available to all routes

**Security Considerations:**

- Tokens never exposed to client JavaScript
- Refresh token rotation (Supabase handles automatically)
- Session revocation on logout (server-side)
- CSRF protection via SameSite cookies


### 3.2 Cookie Management

**Cookie Management Utilities:**

**File:** `src/lib/auth/cookies.ts`

```typescript
import type { AstroCookies } from "astro";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

/**
 * Set authentication cookies
 */
export function setAuthCookies(cookies: AstroCookies, tokens: AuthTokens): void {
  const isProduction = import.meta.env.PROD;

  // Access token (1 hour)
  cookies.set("sb-access-token", tokens.access_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour in seconds
  });

  // Refresh token (7 days)
  cookies.set("sb-refresh-token", tokens.refresh_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(cookies: AstroCookies): void {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
}

/**
 * Get access token from cookies
 */
export function getAccessToken(cookies: AstroCookies): string | undefined {
  return cookies.get("sb-access-token")?.value;
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(cookies: AstroCookies): string | undefined {
  return cookies.get("sb-refresh-token")?.value;
}
```

**Usage in API Endpoints:**

```typescript
// Login endpoint
import { setAuthCookies } from "../../lib/auth/cookies";

export const POST: APIRoute = async (context) => {
  // ... authenticate user
  const { session } = await supabase.auth.signInWithPassword({ email, password });

  // Set cookies
  setAuthCookies(context.cookies, {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  return createSuccessResponse({ user: session.user });
};
```

### 3.3 Security Best Practices

#### 3.3.1 Password Security

- **Minimum Requirements:**
  - 8+ characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - (Optional: special character for extra security)

- **Hashing:**
  - Supabase uses bcrypt (industry standard)
  - Passwords never stored in plaintext
  - Hashing handled automatically by Supabase

#### 3.3.2 Token Security

- **JWT Tokens:**
  - Signed by Supabase (HMAC SHA-256)
  - Include expiration timestamp
  - Include user metadata

- **Storage:**
  - HTTP-only cookies prevent XSS attacks
  - Secure flag ensures HTTPS-only transmission
  - SameSite=Lax prevents CSRF attacks

- **Rotation:**
  - Access tokens expire after 1 hour
  - Refresh tokens expire after 7 days
  - Refresh tokens automatically rotated on use

#### 3.3.3 CSRF Protection

- **SameSite Cookies:**
  - Set to "lax" mode
  - Prevents cross-site request forgery

- **Origin Validation:**
  - Middleware can validate request origin header
  - Reject requests from untrusted origins

#### 3.3.4 Rate Limiting

**Implementation Strategy:**

- **Client-Side:**
  - Disable submit button after click
  - Show loading state during requests

- **Server-Side:**
  - Implement rate limiting for sensitive endpoints:
    - `/api/auth/login`: Max 10 attempts per IP per hour

**Rate Limit Implementation:**

Use in-memory store (for MVP) or Redis (production):

```typescript
// src/lib/rate-limiter.ts
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
}
```

**Usage in endpoints:**

```typescript
export const POST: APIRoute = async (context) => {
  const ip = context.clientAddress;
  
  if (!checkRateLimit(`login:${ip}`, 10, 60 * 60 * 1000)) {
    throw new ApiError(429, "Too many login attempts. Please try again later.");
  }

  // Proceed with login
};
```

#### 3.3.5 Email Enumeration Prevention

**Strategy:**
- Login errors are generic ("Invalid credentials") to prevent email enumeration
- Don't reveal whether email exists or password is incorrect
- Protects user privacy and security

#### 3.3.6 Session Hijacking Prevention

**Mitigations:**
- HTTP-only cookies (prevent JavaScript access)
- Secure flag on cookies (HTTPS only)
- Short-lived access tokens (1 hour)
- Refresh token rotation
- IP validation (optional: track IP on session creation)
- User-Agent validation (optional: detect session from different device)

### 3.4 User Experience Considerations

#### 3.4.1 Loading States

All forms show loading indicators during API calls:
- Disabled form inputs
- Loading spinner on submit button
- Button text changes (e.g., "Logging in..." instead of "Log In")

#### 3.4.2 Success Feedback

- Toast notifications for non-critical actions
- In-page messages for critical actions
- Auto-redirects after success (with countdown)
- Clear next-step instructions

#### 3.4.3 Error Recovery

- Clear, actionable error messages
- "Try Again" buttons for recoverable errors
- "Contact Support" links for persistent errors
- Preserve form data on error (don't clear valid inputs)

#### 3.4.4 Responsive Design

- Web application approach
- Readable font sizes (minimum 16px for inputs)
- Adequate spacing between interactive elements

### 3.5 Testing Considerations

#### 3.5.1 Manual Testing Scenarios

**Login Flow:**
1. Login with valid credentials → Success, redirect to projects
2. Login with invalid email → Error: "Invalid credentials"
3. Login with invalid password → Error: "Invalid credentials"
4. Login, then refresh page → Stay logged in (session persists)
5. Login, then close browser and reopen → Stay logged in (refresh token works)

**Session Management:**
1. Login, then logout → Redirect to home, can't access protected routes
2. Login, wait 1 hour, refresh page → Session refreshed, stay logged in
3. Login, wait 7 days → Session expired, redirect to login

**Protected Routes:**
1. Access `/projects` without login → Redirect to `/login`
2. Access `/login` when logged in → Redirect to `/projects`
3. Logout from any page → Redirect to home

#### 3.5.2 Automated Testing (Future)

Recommended test frameworks:
- **Unit Tests:** Vitest for service layer and utilities
- **Integration Tests:** Testing Library for React components
- **E2E Tests:** Playwright for full user flows

**Priority Test Cases:**
- Login and logout
- Protected route access
- Session persistence
- Token refresh
- Rate limiting on login endpoint

---

## 4. MIGRATION PLAN

### 4.1 Database Migrations

**Migration Files to Create:**

1. **`supabase/migrations/20251103_update_rls_policies.sql`**
   - Update RLS policies for `travel_projects`, `notes`, `ai_logs`
   - Replace hardcoded user ID with `auth.uid()`
   - Enable RLS on all tables

**Note:** User accounts must be created manually via Supabase Dashboard. Create test users for development:
```sql
-- Example: Create test user via Supabase Dashboard or SQL
-- Email: test@example.com
-- Password: TestPassword123
```

**Migration Execution:**
```bash
supabase migration up
```

### 4.2 Code Migration Steps

**Phase 1: Infrastructure**
1. Update `src/middleware/index.ts` with authentication logic
2. Create `src/lib/auth/cookies.ts` utility
3. Update `src/env.d.ts` with User type in Locals
4. Create `src/lib/schemas/auth.schema.ts` with validation schemas

**Phase 2: Service Layer**
1. Create `src/services/auth.service.ts`
2. Update `src/services/project.service.ts` to use `auth.uid()` from context
3. Update `src/services/note.service.ts` (if exists)
4. Update `src/services/plan.service.ts` (if exists)

**Phase 3: API Endpoints**
1. Create authentication endpoints in `src/pages/api/auth/` (login, logout)
2. Update existing API endpoints to use `context.locals.user`
3. Remove `DEFAULT_USER_ID` usage from all endpoints

**Phase 4: UI Components**
1. Create `src/layouts/AuthLayout.astro`
2. Update `src/layouts/Layout.astro` with navigation and user menu
3. Create `src/components/auth/LoginForm.tsx`
4. Create `src/components/UserMenu.tsx`
5. Create `src/components/LandingPage.astro`

**Phase 5: Pages**
1. Create login page: `src/pages/auth/login.astro`
2. Update `src/pages/index.astro` with landing page
3. Update existing pages (no changes needed, middleware handles protection)

**Phase 6: User Creation**
1. Create test users manually in Supabase Dashboard for development
2. Document user creation process for system administrators

**Phase 7: Testing**
1. Manual testing of login and logout flows
2. Test protected route access
3. Test session persistence
4. Test edge cases (expired tokens, rate limiting, etc.)

### 4.3 Rollback Plan

If issues arise during deployment:

1. **Database Rollback:**
   ```bash
   supabase migration down
   ```

2. **Code Rollback:**
   - Revert to previous git commit
   - Re-deploy previous version

3. **Temporary Fixes:**
   - Disable route protection in middleware (allow public access)
   - Add feature flag to toggle authentication on/off

### 4.4 Deployment Checklist

**Pre-Deployment:**
- [ ] All migrations tested in development
- [ ] Login and logout endpoints tested manually
- [ ] Login form tested in different browsers
- [ ] Test users created in Supabase Dashboard
- [ ] Environment variables set in production

**Deployment:**
- [ ] Run database migrations
- [ ] Deploy code to production
- [ ] Verify deployment health
- [ ] Test login and logout flows

**Post-Deployment:**
- [ ] Monitor error logs
- [ ] Monitor Supabase dashboard for auth events
- [ ] Test login and logout from different devices/browsers
- [ ] Verify rate limiting is working
- [ ] Create production user accounts for actual users

---

## 5. FUTURE ENHANCEMENTS

While not part of the MVP, these enhancements can be considered for future iterations:

### 5.1 User Registration

Add self-service user registration:
- Registration form with email and password
- Immediate account creation and login
- Email validation

**Benefits:**
- Users can create their own accounts
- Reduced administrative burden
- Faster onboarding

**Implementation:**
- Add registration page and form
- Create registration API endpoint
- Update landing page with registration link

### 5.2 User Profile Management

Add user profile page:
- View account information
- Update email address
- Change password
- Delete account option

**Benefits:**
- Users can manage their own accounts
- Self-service password changes
- Better user control

**Implementation:**
- Create profile page
- Add change password endpoint
- Add update email endpoint

### 5.3 Travel Preferences

Add user travel preferences (US-005):
- Save preferred travel categories
- Use preferences in AI trip planning
- Customize recommendations

**Benefits:**
- Personalized trip suggestions
- Better AI-generated itineraries
- Improved user experience

**Implementation:**
- Create user_preferences table
- Add preferences API endpoints
- Update profile page with preferences section
- Integrate preferences into AI service

### 5.4 Password Recovery

Add "Forgot Password" functionality:
- Email-based password reset with magic links
- Security questions as alternative
- SMS-based verification

**Benefits:**
- Users can recover forgotten passwords
- Reduced support burden
- Improved user experience

**Implementation:**
- Add forgot password page
- Implement email verification flow
- Add reset password endpoint
- Configure Supabase email templates

### 5.5 Email Verification

Add email verification for new registrations:
- Verify email before full account activation
- Resend verification link option
- Handle expired verification tokens

**Benefits:**
- Reduce spam accounts
- Ensure valid contact information
- Improved security

**Implementation:**
- Enable email confirmation in Supabase
- Add verification callback page
- Add resend verification endpoint
- Configure confirmation email template

### 5.6 OAuth Providers

Add social login options:
- Google OAuth
- GitHub OAuth
- Apple Sign In

**Benefits:**
- Faster registration
- No password to remember
- Trusted identity providers

**Implementation:**
- Supabase Auth supports OAuth out of the box
- Add provider buttons to login/register pages
- Configure OAuth apps in respective platforms

### 5.7 Multi-Factor Authentication (MFA)

Add optional 2FA for enhanced security:
- TOTP (Time-based One-Time Password)
- SMS verification
- Email verification codes

**Benefits:**
- Enhanced account security
- Protection against credential theft

**Implementation:**
- Supabase supports TOTP MFA
- Add MFA settings to profile page

### 5.8 Session Management UI

Allow users to view and manage active sessions:
- List of active sessions (device, location, last active)
- Revoke individual sessions
- "Logout all devices" option

**Benefits:**
- User control over security
- Detect unauthorized access

### 5.9 Email Change Flow

Allow users to change their email address:
- Request email change
- Verify new email
- Verify old email (for security)
- Update email after both verifications

**Benefits:**
- Users can update outdated email addresses
- Account recovery if email compromised

### 5.10 Account Deletion

Allow users to delete their accounts:
- "Delete Account" option in profile
- Confirmation dialog with password verification
- Grace period (e.g., 30 days) before permanent deletion
- Export data option before deletion

**Benefits:**
- GDPR compliance
- User data ownership

### 5.11 Remember Me

Add "Remember Me" checkbox on login:
- Extended refresh token expiration (30 days instead of 7)
- Separate cookie for "remember me" flag

**Benefits:**
- Better UX for frequent users
- Fewer re-logins

---

## 6. APPENDIX

### 6.1 Type Definitions

**New Types in `src/types.ts`:**

```typescript
// Authentication DTOs
export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  user: {
    id: string;
    email: string;
  };
  message: string;
}
```

### 6.2 File Structure Summary

**New Files:**
```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── UserMenu.tsx
│   └── LandingPage.astro
├── layouts/
│   └── AuthLayout.astro (new)
├── lib/
│   ├── auth/
│   │   └── cookies.ts
│   ├── schemas/
│   │   └── auth.schema.ts
│   └── rate-limiter.ts
├── pages/
│   ├── auth/
│   │   └── login.astro
│   └── api/
│       └── auth/
│           ├── login.ts
│           └── logout.ts
├── services/
│   └── auth.service.ts
supabase/
└── migrations/
    └── 20251103_update_rls_policies.sql
```

**Modified Files:**
```
src/
├── middleware/index.ts (updated)
├── layouts/Layout.astro (updated)
├── pages/index.astro (updated)
├── env.d.ts (updated)
├── types.ts (updated)
└── db/supabase.client.ts (remove DEFAULT_USER_ID after migration)
```

### 6.3 Environment Variables

**Required Environment Variables:**

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Application URLs
PUBLIC_APP_URL=http://localhost:3000  # Development
# PUBLIC_APP_URL=https://vacationplanner.com  # Production

# Optional: Rate Limiting (if using Redis)
# REDIS_URL=redis://localhost:6379
```

### 6.4 API Endpoint Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/login` | No | Authenticate user |
| POST | `/api/auth/logout` | Yes | Logout user |

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-03 | Architecture Team | Initial specification |

---

**End of Authentication Architecture Specification**




================================================
FILE: .ai/AUTHENTICATION_IMPLEMENTATION_GUIDE.md
================================================
# Authentication Implementation Guide

## ✅ Implementation Summary

The authentication system has been successfully integrated into VacationPlanner with the following components:

### 1. **Infrastructure Updates**
- ✅ Installed `@supabase/ssr` package
- ✅ Updated Supabase client with SSR pattern (createServerClient + getAll/setAll)
- ✅ Updated env.d.ts with User type in Locals
- ✅ Created auth validation schema (auth.schema.ts)

### 2. **Backend Implementation**
- ✅ Enhanced middleware with authentication logic and route protection
- ✅ Created POST `/api/auth/login` endpoint
- ✅ Created POST `/api/auth/logout` endpoint
- ✅ Created RLS migration file (`20251105_enable_rls_policies.sql`)

### 3. **Frontend Integration**
- ✅ Updated login.astro with auth redirect logic
- ✅ Updated index.astro with landing page and auth redirect
- ✅ Updated Layout.astro with UserMenu integration
- ✅ LoginForm.tsx already implemented (no changes needed)

---

## 🚀 Step-by-Step Implementation Instructions

### Step 1: Run Database Migration

The RLS (Row-Level Security) migration must be applied to enable proper data isolation between users.

**⚠️ IMPORTANT**: Before running the migration, ensure you have:
- Supabase CLI installed (`npm install -g supabase`)
- Your local Supabase instance running OR access to remote Supabase project

#### Option A: Local Development (Supabase CLI)

```bash
# Start local Supabase (if not already running)
supabase start

# Apply the migration
supabase migration up
```

#### Option B: Remote Supabase Project

```bash
# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push
```

#### Option C: Manual Application via Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/20251105_enable_rls_policies.sql`
3. Paste into the SQL editor
4. Click "Run" to execute

### Step 2: Verify Migration Success

After running the migration, verify that RLS is enabled:

```sql
-- Run this query in Supabase SQL Editor
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('travel_projects', 'notes', 'ai_logs');
```

**Expected Result:**
All three tables should show `rowsecurity = true`

### Step 3: Verify Test User Account

Check that you have at least one test user account in Supabase:

1. Go to Supabase Dashboard → Authentication → Users
2. Verify a test user exists (you mentioned one is already created)
3. Note the email for testing
4. If password is unknown, click "Send reset password email" or create a new test user

### Step 4: Start Development Server

```bash
npm run dev
```

The server should start on `http://localhost:4321` (or your configured port).

---

## 🧪 Testing Checklist

### **Test 1: Login Flow (Unauthenticated → Authenticated)**

1. ✅ **Visit landing page** (`/`)
   - Should show LandingPage component
   - Should see "Login" button/link
   - Should NOT see user menu

2. ✅ **Navigate to login page** (`/auth/login`)
   - Should show login form
   - Should see email and password fields

3. ✅ **Attempt login with invalid credentials**
   - Enter invalid email format → Should show client-side validation error
   - Enter valid email but wrong password → Should show "Invalid credentials" error
   - Should remain on login page

4. ✅ **Login with valid credentials**
   - Enter valid test user email and password
   - Click "Log In"
   - Should show loading state ("Logging in...")
   - Should redirect to `/projects` page
   - Should see user menu in header with email initial

### **Test 2: Authenticated State Persistence**

1. ✅ **Refresh page while logged in**
   - Should remain logged in
   - Should stay on `/projects` page
   - User menu should still be visible

2. ✅ **Navigate to home page while logged in** (`/`)
   - Should automatically redirect to `/projects`

3. ✅ **Try to access login page while logged in** (`/auth/login`)
   - Should automatically redirect to `/projects`

### **Test 3: Protected Route Access**

1. ✅ **Open new incognito/private window**
   - Visit `/projects` directly (without logging in)
   - Should redirect to `/auth/login?redirect=/projects`
   - After login, should redirect back to `/projects`

### **Test 4: Logout Flow**

1. ✅ **Click on user menu** (avatar with email initial)
   - Should show dropdown with email and "Logout" option

2. ✅ **Click "Logout"**
   - Should show loading state ("Logging out...")
   - Should redirect to home page (`/`)
   - Should NOT see user menu anymore
   - Should see landing page

3. ✅ **Try to access protected routes after logout**
   - Visit `/projects`
   - Should redirect to `/auth/login`

### **Test 5: Row-Level Security (RLS) Verification**

**Prerequisites**: Create 2 test users in Supabase Dashboard

1. ✅ **Login as User A**
   - Create a project
   - Add some notes to the project
   - Logout

2. ✅ **Login as User B**
   - Go to `/projects`
   - Should NOT see User A's projects
   - Create a separate project
   - Should only see own project

3. ✅ **Verify API-level isolation**
   - Open browser DevTools → Network tab
   - Check API responses for `/api/projects`
   - Should only return projects owned by current user

### **Test 6: Session Expiration (Optional)**

1. ✅ **Login and wait for session expiration** (access token expires after 1 hour)
   - Login as test user
   - Wait for token to expire OR manually delete `sb-access-token` cookie
   - Refresh page
   - Should be automatically logged out and redirected to `/auth/login`

---

## 🔍 Troubleshooting Guide

### Problem: "Migration failed" or "Policy already exists"

**Solution**: 
```sql
-- Drop existing policies first (if migration fails)
DROP POLICY IF EXISTS travel_projects_select_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_insert_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_update_policy ON travel_projects;
DROP POLICY IF EXISTS travel_projects_delete_policy ON travel_projects;
DROP POLICY IF EXISTS notes_select_policy ON notes;
DROP POLICY IF EXISTS notes_insert_policy ON notes;
DROP POLICY IF EXISTS notes_update_policy ON notes;
DROP POLICY IF EXISTS notes_delete_policy ON notes;
DROP POLICY IF EXISTS ai_logs_select_policy ON ai_logs;
DROP POLICY IF EXISTS ai_logs_insert_policy ON ai_logs;
DROP POLICY IF EXISTS ai_logs_update_policy ON ai_logs;
DROP POLICY IF EXISTS ai_logs_delete_policy ON ai_logs;

-- Then re-run the migration
```

### Problem: "Invalid credentials" even with correct password

**Possible causes**:
1. Email not confirmed (if Supabase requires confirmation)
2. User account disabled
3. Password incorrect

**Solution**:
- Go to Supabase Dashboard → Authentication → Users
- Click on the user
- Verify "Email confirmed" is checked
- Try resetting password: "Send reset password email"

### Problem: "Cannot access projects" after login

**Possible causes**:
1. RLS policies not applied correctly
2. User ID mismatch

**Solution**:
1. Verify RLS is enabled:
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'travel_projects';
```
2. Check if policies exist:
```sql
SELECT * FROM pg_policies WHERE tablename = 'travel_projects';
```
3. Manually test policy:
```sql
-- Run as authenticated user
SET request.jwt.claim.sub = 'user-id-here';
SELECT * FROM travel_projects;
```

### Problem: "Middleware infinite redirect loop"

**Possible causes**:
- Middleware logic error
- Cookie not being set correctly

**Solution**:
1. Check browser console for errors
2. Check browser DevTools → Application → Cookies
3. Verify cookies `sb-access-token` and `sb-refresh-token` are set
4. Clear all cookies and try again

### Problem: "Cannot read property 'email' of undefined"

**Cause**: User object is undefined in component

**Solution**:
- Check that `Astro.locals.user` is defined in the page
- Verify middleware is running (add console.log in middleware)
- Check that page has `export const prerender = false;`

---

## 📋 Post-Implementation Checklist

### Code Cleanup

After successful testing, perform these cleanup tasks:

- [ ] Remove `DEFAULT_USER_ID` constant from any remaining files
- [ ] Update all API endpoints to use `context.locals.user.id` instead of hardcoded user ID
- [ ] Remove any test console.log statements
- [ ] Update README with authentication setup instructions

### Files to Update (Remove DEFAULT_USER_ID usage)

Search for `DEFAULT_USER_ID` in these locations:

```bash
# Find all files using DEFAULT_USER_ID
grep -r "DEFAULT_USER_ID" src/
```

Common files that might need updates:
- `src/services/project.service.ts`
- `src/services/note.service.ts`
- `src/pages/api/projects/index.ts`
- Any other API endpoints

**Replace pattern**:
```typescript
// OLD (REMOVE):
import { DEFAULT_USER_ID } from "../db/supabase.client.ts";
const userId = DEFAULT_USER_ID;

// NEW:
const userId = context.locals.user?.id;
if (!userId) {
  throw new ApiError(401, "Unauthorized");
}
```

### Production Deployment Checklist

Before deploying to production:

- [ ] Verify all environment variables are set in production
  - `SUPABASE_URL`
  - `SUPABASE_KEY` (anon key)
- [ ] Run RLS migration on production database
- [ ] Test login/logout flow in production
- [ ] Verify RLS policies work in production
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Enable rate limiting on login endpoint (recommended)
- [ ] Review Supabase Auth settings:
  - [ ] Email confirmation enabled/disabled (as per requirements)
  - [ ] Password requirements configured
  - [ ] Session expiration settings reviewed

---

## 🎯 User Stories Coverage

This implementation satisfies the following user stories from the PRD:

- ✅ **US-002: User Login** - Users can log in with email and password
- ✅ **US-003: User Logout** - Users can log out from the application
- ✅ **RLS Implementation** - User data isolation implemented via Row-Level Security

**Note**: US-001 (User Registration) is marked as "not needed for MVP" and is not implemented. Users must be created manually via Supabase Dashboard.

---

## 🔐 Security Implementation Notes

### Authentication Method
- **Method**: Email/Password with Supabase Auth
- **Session Storage**: HTTP-only cookies (prevents XSS attacks)
- **Cookie Attributes**:
  - `httpOnly: true` - Prevents JavaScript access
  - `secure: true` - HTTPS only (production)
  - `sameSite: 'lax'` - CSRF protection
  - `path: '/'` - Available to all routes

### Token Management
- **Access Token**: Expires after 1 hour
- **Refresh Token**: Expires after 7 days
- **Automatic Refresh**: Handled by Supabase SSR library

### Row-Level Security (RLS)
- **Enabled on**: `travel_projects`, `notes`, `ai_logs`
- **Policy Type**: User-scoped (uses `auth.uid()`)
- **Operations Protected**: SELECT, INSERT, UPDATE, DELETE

### Rate Limiting
- **Not implemented in MVP** (recommended for production)
- **Recommendation**: Add rate limiting to `/api/auth/login` endpoint
  - Suggested limit: 10 attempts per IP per hour
  - Can use middleware or external service (Cloudflare, Vercel)

---

## 📚 Architecture Documentation

### File Structure (New/Modified Files)

```
src/
├── db/
│   └── supabase.client.ts           ✅ UPDATED (SSR pattern)
├── middleware/
│   └── index.ts                     ✅ UPDATED (auth logic)
├── lib/
│   └── schemas/
│       └── auth.schema.ts           ✅ NEW
├── pages/
│   ├── index.astro                  ✅ UPDATED (redirect logic)
│   ├── auth/
│   │   └── login.astro              ✅ UPDATED (prerender false)
│   └── api/
│       └── auth/
│           ├── login.ts             ✅ NEW
│           └── logout.ts            ✅ NEW
├── layouts/
│   └── Layout.astro                 ✅ UPDATED (removed TODO)
├── components/
│   ├── UserMenu.tsx                 ✅ UPDATED (removed TODO)
│   └── auth/
│       └── LoginForm.tsx            ✅ ALREADY IMPLEMENTED
└── env.d.ts                         ✅ UPDATED (User type)

supabase/
└── migrations/
    └── 20251105_enable_rls_policies.sql  ✅ NEW
```

### Data Flow

```
1. User visits protected route (/projects)
   ↓
2. Middleware intercepts request
   ↓
3. Middleware creates Supabase client with cookies
   ↓
4. Middleware calls auth.getUser() to verify session
   ↓
5. If authenticated: Attach user to context.locals.user → Continue
   If not authenticated: Redirect to /auth/login
   ↓
6. Page/API receives request with context.locals.user populated
   ↓
7. Database queries filtered by RLS policies (auth.uid())
```

### Authentication Flow

```
LOGIN:
1. User submits LoginForm
2. POST to /api/auth/login
3. API validates with Zod schema
4. API calls Supabase auth.signInWithPassword()
5. Supabase sets HTTP-only cookies (automatic via SSR)
6. API returns success
7. LoginForm redirects to /projects
8. Middleware verifies cookies and attaches user to context

LOGOUT:
1. User clicks "Logout" in UserMenu
2. POST to /api/auth/logout
3. API calls Supabase auth.signOut()
4. Supabase clears cookies (automatic via SSR)
5. API returns success
6. UserMenu redirects to /
7. Middleware finds no valid session, user stays on landing page
```

---

## 🎉 Summary

The authentication system is fully implemented and follows:
- ✅ Supabase Auth best practices (SSR pattern)
- ✅ Cursor rules for Astro and React
- ✅ Auth specification from `auth-spec.md`
- ✅ Security best practices (HTTP-only cookies, RLS, input validation)
- ✅ Accessibility standards (ARIA labels, keyboard navigation)

**Next Steps**:
1. Run the database migration
2. Test the authentication flow thoroughly
3. Update remaining API endpoints to use `context.locals.user.id`
4. Remove `DEFAULT_USER_ID` from codebase
5. Deploy to production with proper environment variables

**Questions or Issues?**
Refer to the Troubleshooting Guide above or consult:
- `.ai/auth-spec.md` - Detailed architecture specification
- `.cursor/rules/supabase-auth.mdc` - Supabase Auth integration guide
- Supabase Documentation: https://supabase.com/docs/guides/auth/server-side




================================================
FILE: .ai/db-plan.md
================================================
# Database Schema Plan (PostgreSQL)

## 1. Tables

### users
This table is managed by Supabase Auth

- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **email**: TEXT NOT NULL UNIQUE
- **encrypted_password**: TEXT NOT NULL
- **created_on**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **confirmed_on**: TIMESTAMPTZ NULL
- **preferences**: JSONB NULL

### travel_projects
- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **name**: TEXT NOT NULL
- **duration_days**: INTEGER NOT NULL
- **created_on**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **planned_date**: DATE NULL

### notes
- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **project_id**: UUID NOT NULL REFERENCES travel_projects(id) ON DELETE CASCADE
- **content**: TEXT NOT NULL
- **priority**: SMALLINT NOT NULL DEFAULT 2 CHECK (priority BETWEEN 1 AND 3)
- **place_tags**: TEXT[] NULL
- **updated_on**: TIMESTAMPTZ NOT NULL DEFAULT now()

*Trigger will update `updated_on` on each UPDATE.*

### ai_logs
- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **project_id**: UUID NOT NULL REFERENCES travel_projects(id) ON DELETE CASCADE
- **request_body** JSONB NOT NULL
- **prompt**: TEXT NOT NULL (unlimited length for large prompts)
- **response**: JSONB NOT NULL
- **response_code**: INTEGER NOT NULL
- **duration_ms**: INTEGER NULL
- **created_on**: TIMESTAMPTZ NOT NULL DEFAULT now()

## 2. Relations

- **users** (1) → (N) **travel_projects**
- **travel_projects** (1) → (N) **notes**
- **users** (1) → (N) **ai_logs**
- **travel_projects** (1) → (N) **ai_logs**

## 3. Indexes

- GIN on `users(preferences)`
- GIN on `notes(place_tags)`
- BTREE on `notes(project_id)`
- BTREE on `travel_projects(user_id)`
- BTREE on `ai_logs(project_id, created_on DESC)`

## 4. Row-Level Security (RLS) Policies

Enable RLS on all tables containing user-scoped data.

### travel_projects
```sql
ALTER TABLE travel_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY travel_projects_select ON travel_projects FOR SELECT USING (user_id = auth.uid());
CREATE POLICY travel_projects_modify ON travel_projects FOR INSERT, UPDATE, DELETE WITH CHECK (user_id = auth.uid());
```

### notes
```sql
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY notes_select ON notes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM travel_projects tp
    WHERE tp.id = notes.project_id
      AND tp.user_id = auth.uid()
  )
);
CREATE POLICY notes_modify ON notes FOR INSERT, UPDATE, DELETE WITH CHECK (
  EXISTS (
    SELECT 1 FROM travel_projects tp
    WHERE tp.id = notes.project_id
      AND tp.user_id = auth.uid()
  )
);
```

### ai_logs
```sql
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_logs_select ON ai_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY ai_logs_modify ON ai_logs FOR INSERT, UPDATE, DELETE WITH CHECK (user_id = auth.uid());
```

## 5. Additional Notes

- **Trigger**: Create a PL/pgSQL function to set `updated_on = now()` before update on `notes`.
- **UUID Generation**: Requires the `pgcrypto` extension (`CREATE EXTENSION IF NOT EXISTS pgcrypto;`).
- **ENUM Type**: Define `ai_status` before table creation:
  ```sql
  CREATE TYPE ai_status AS ENUM ('pending', 'success', 'failure');
  ```
- **Future Extensions**: Consider partitioning large tables older than X months, TTL on logs, and a `reports` table when adding analytics.



================================================
FILE: .ai/env-setup-guide.md
================================================
# Konfiguracja zmiennych środowiskowych

## Problem: "supabaseUrl is required"

Ten błąd występuje, gdy brakuje pliku `.env` z konfiguracją Supabase.

## Rozwiązanie

### Krok 1: Uruchom lokalną instancję Supabase

```bash
npx supabase start
```

### Krok 2: Pobierz dane dostępowe

```bash
npx supabase status
```

Zapisz następujące wartości:
- **API URL** (np. `http://127.0.0.1:54321`)
- **Publishable key** (np. `sb_publishable_...`)

### Krok 3: Utwórz plik `.env`

W głównym katalogu projektu utwórz plik `.env`:

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_KEY=sb_publishable_
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

**Ważne:** Zastąp wartości swoimi danymi z `npx supabase status`

### Krok 4: Zrestartuj serwer deweloperski

```bash
# Zatrzymaj serwer (Ctrl+C)
# Uruchom ponownie
npm run dev
```

## Weryfikacja

Po restarcie serwera endpoint powinien działać prawidłowo:

```bash
curl -X POST http://localhost:4321/api/projects/a1b2c3d4-e5f6-7890-abcd-ef1234567890/plan \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5",
    "notes": [
      {
        "id": "note-0001-0000-0000-000000000001",
        "content": "Test",
        "priority": 3,
        "place_tags": null
      }
    ]
  }'
```

## Troubleshooting

### Problem: Zmienne nie są wczytywane

1. Sprawdź czy plik `.env` jest w głównym katalogu projektu
2. Sprawdź czy plik `.env` nie ma rozszerzenia `.txt` (Windows może ukrywać rozszerzenia)
3. Zrestartuj serwer deweloperski

### Problem: "Port already in use"

```bash
# Znajdź i zabij proces na porcie 4321
netstat -ano | findstr :4321
taskkill /PID <PID> /F
```

### Problem: Supabase nie działa

```bash
# Sprawdź status
npx supabase status

# Jeśli nie działa, uruchom:
npx supabase start
```

## Produkcja

Dla środowiska produkcyjnego użyj danych z Supabase Dashboard:

1. Zaloguj się do https://supabase.com
2. Wybierz swój projekt
3. Przejdź do **Settings** → **API**
4. Skopiuj:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_KEY`

## .gitignore

Plik `.env` **NIE POWINIEN** być commitowany do git. Upewnij się, że jest w `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
```

## Przykładowa zawartość .env

```env
# Supabase Local Development
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH

# Supabase Production (przykład)
# SUPABASE_URL=https://your-project-ref.supabase.co
# SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-...
```




================================================
FILE: .ai/generation-endpoint-implementation-plan.md
================================================
# API Endpoint Implementation Plan: POST /projects/{projectId}/plan

## 1. Przegląd punktu końcowego
Punkt końcowy umożliwia synchroniczne wygenerowanie planu podróży dla konkretnego projektu, korzystając z usługi AI. Logowane są zdarzenia w tabeli `ai_logs` z odpowiednim statusem (`pending`, `success`, `failure`).

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: `/projects/{projectId}/plan`
- Parametry ścieżki:
  - `projectId` (UUID) – wymagane, identyfikator projektu
- Request Body (JSON):
  ```json
  {
    "model": "gpt-5",                // string, wymagane
    "notes": [                         // array, wymagane
      { "id": "uuid", "content": "string", "priority": 1, "place_tags": ["string"] }
    ],
    "preferences": { "categories": ["string"] }  // obiekt, wymagany
  }
  ```
- Wymagane pola: `model`, `notes`, `preferences`
- Brak parametrów opcjonalnych w żądaniu

## 3. Wykorzystywane typy
- `GeneratePlanCommand` (src/types.ts)
- `ScheduleItemDto`, `PlanResponseDto` (src/types.ts)
- `AILogDto` (src/types.ts) – do zapisu w `ai_logs`

## 4. Szczegóły odpowiedzi
- Kod 200 OK
- Body:
  ```json
  { "schedule": [ { "day": 1, "activities": ["..."] } ] }
  ```
- Kody błędów:
  - 400 Bad Request – nieprawidłowy JSON lub walidacja
  - 401 Unauthorized – brak lub nieważny token
  - 404 Not Found – projekt nie istnieje lub nie należy do użytkownika
  - 500 Internal Server Error – błąd serwera lub AI service error

## 5. Przepływ danych
1. Autoryzacja: middleware Supabase weryfikuje token JWT i uzyskuje `user_id`.
2. Walidacja parametrów: sprawdzenie UUID, schematu ciała żądania.
3. Pobranie projektu: SELECT FROM `travel_projects` WHERE `id`=&`projectId` AND `user_id`=&`user_id`.
4. Pobranie notatek: SELECT FROM `notes` WHERE `project_id`=&`projectId`.
5. Złożenie `GeneratePlanCommand` (model, notes, preferences).
6. Insert do `ai_logs` z `status` = `pending`, `prompt` = wygenerowane dane wejściowe.
7. Wywołanie usługi AI przez Openrouter:
   - Mierzenie czasu startu/stopu
   - Otrzymanie odpowiedzi JSON z planem
8. Update `ai_logs`:
   - Ustawienie `status` = `success` lub `failure`
   - Zapis `response`, `duration_ms`
   - Inkrementacja `version`
9. Zwrócenie odpowiedzi klientowi.

## 6. Względy bezpieczeństwa
- Uwierzytelnianie: Supabase Auth middleware (JWT).
- Autoryzacja: użytkownik może operować tylko na swoich projektach.
- Walidacja wejścia: unikanie złośliwych danych, kontrole tabel… Tagi i treści.
- Whitelisting: dopuszczalne modele AI (np. ‘gpt-4’, ‘gpt-5’).
- Ochrona przed nadużyciami: limitowanie liczby żądań AI per user.

## 7. Obsługa błędów
| Scenariusz                        | Kod  | Opis                                                       |
|----------------------------------|------|------------------------------------------------------------|
| Błędny JSON / walidacja          | 400  | Zwraca szczegóły błędów walidacji                          |
| Brak/nieprawidłowy token         | 401  | Unauthorized                                               |
| Projekt nie istnieje lub nie należy do usera | 404  | Not Found                                                  |
| Błąd DB (SELECT/INSERT) , Błąd AI service (timeout, błąd)         | 500  | Internal Server Error                                     |
Każdy z błędów powoduje aktualizacje `ai_logs`.`status` = `failure`, log error 

## 8. Rozważania dotyczące wydajności
- Żądanie jest synchroniczne – zadbać o timeout 60s.
- Ograniczenie rozmiaru tablicy `notes` lub stronicowanie.
- Cache promptów / odpowiedzi (opcjonalnie).

## 9. Kroki implementacji
1. **Routing & Middleware**
   - Utworzyć plik kontrolera: `src/pages/api/projects/[projectId]/plan.ts` lub w backend service.
   - Dodać middleware Supabase do weryfikacji JWT.
2. **Walidacja wejścia**
   - Zdefiniować schemat Zod w `src/lib/schemas/plan.schema.ts`.
3. **Service**
   - Utworzyć `src/services/planService.ts` z metodą `generatePlan(command, userId)`.
   - Zawiera logikę: fetch project, fetch notes, insert/update `ai_logs`, wywołanie Openrouter.
   - Integruje się z zewnętrznym serwisem AI. Na etapie developmentu skorzystamy z mocków zamiast wywoływania serwisu AI
   - Pomiar czasu i obsługa błędów.
4. **Handler HTTP**
   - Parsowanie `projectId`, `req.body`, walidacja.
   - Wywołanie `planService.generatePlan`.
   - Obsługa wyjątków i mapowanie na kody HTTP.
5. **Dokumentacja**
   - Aktualizacja README i OpenAPI spec.




================================================
FILE: .ai/groq-service-implementation-plan.md
================================================
# GROQ Service Implementation Plan

This document outlines the design and implementation plan for the `GROQService`, which interfaces with the GROQ API to perform LLM-based chat operations with structured JSON response validation.

## 1. Service Description
The `GROQService` provides methods to construct and send chat requests to the GROQ API, handling message formatting, authentication, error handling, and response validation against a JSON schema.

Key responsibilities:
- Build request payloads with system and user messages
- Configure model name and parameters
- Manage API key and authentication headers
- Send HTTP requests and parse responses
- Validate structured JSON responses
- Log requests and errors

## 2. Constructor Description
```typescript
constructor(config: {
  apiKey: string;
  baseUrl?: string;        // default: "https://api.groq.com/v1/llm"
  defaultModel?: string;    // e.g., "groq-llm-s2"
  defaultParams?: Record<string, unknown>;  // e.g., { temperature: 0.8, max_tokens: 1500 }
})
```
- **apiKey**: Required. Used for Bearer authentication in `Authorization` header.
- **baseUrl**: Optional. Base URL for GROQ inference endpoint.
- **defaultModel**: Optional. Default model name for chat requests.
- **defaultParams**: Optional. Default parameters for model invocation.

## 3. Public Methods and Fields
### Methods
- `sendChat(request: ChatRequest): Promise<ChatResponse>`
  - Constructs payload, sends request, validates and returns structured response.
- `setApiKey(key: string): void`
  - Update the API key at runtime.
- `setDefaultModel(modelName: string): void`
  - Override the default model.
- `setDefaultParams(params: Record<string, unknown>): void`
  - Override the default parameters.

### Fields
- `apiKey: string`
- `baseUrl: string`
- `defaultModel: string`
- `defaultParams: Record<string, unknown>`

## 4. Private Methods and Fields
- `_buildPayload(request: ChatRequest): GroqPayload`
  - Assembles the request body with:
    - `model`: Model name
    - `messages`: Array of `{ role, content }` objects
    - `parameters`: Merged default and per-request parameters
    - `response_format`: JSON schema format object
- `_validateResponse(raw: unknown, schema: JSONSchema): ChatResponse`
  - Uses AJV or similar library to validate JSON against the provided schema.
- `_request(payload: GroqPayload): Promise<unknown>`
  - Sends HTTP POST with headers:
    - `Authorization: Bearer ${apiKey}`
    - `Content-Type: application/json`
- `_handleError(error: unknown): never`
  - Normalizes errors into custom types.

## 5. Error Handling
Potential error scenarios:
1. Network failures or timeouts
2. HTTP 401 Unauthorized (invalid API key)
3. HTTP 429 Rate limiting
4. HTTP 4xx client errors
5. HTTP 5xx server errors
6. Invalid JSON payload in response
7. Schema validation failures

Approach:
- Define custom error classes: `NetworkError`, `AuthenticationError`, `RateLimitError`, `ValidationError`, `ApiError`.
- Implement retry logic with exponential backoff for transient errors (5xx, network timeouts).
- Surface user-friendly messages and log detailed diagnostics.

## 6. Security Considerations
- Store `apiKey` securely, do not log sensitive values.
- Enforce HTTPS for all requests.
- Validate and sanitize all input parameters.
- Use environment variables for secret management.
- Throttle or guard against excessive request rates.

## 7. Step-by-Step Implementation Plan
1. **Define Types and Interfaces** (`src/services/groq.types.ts`):
   - `ChatRequest`, `ChatResponse`, `GroqPayload`, `ResponseFormat`, `JSONSchema`.
2. **Configure HTTP Client** (`src/lib/http-client.ts` or reuse existing utility):
   - Set base URL, default headers, timeouts, and an interceptor for the `Authorization` header.
3. **Implement `GROQService` Class** (`src/services/groq.service.ts`):
   - Add constructor and assign configuration.
   - Implement `_request`:
     ```typescript
     const response = await fetch(`${this.baseUrl}/chat/completions`, {
       method: 'POST',
       headers: { 
         'Authorization': `Bearer ${this.apiKey}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(payload)
     });
     return response.json();
     ```
   - Implement `_buildPayload` with example:
     ```json
     {
       "model": "groq-llm-s2",
       "messages": [
         { "role": "system", "content": "You are a travel planner assistant." },
         { "role": "user", "content": "Plan a 3-day trip to Paris." }
       ],
       "parameters": { "temperature": 0.8, "max_tokens": 1500 },
       "response_format": {
         "type": "json_schema",
         "json_schema": {
           "name": "ItineraryResponse",
           "strict": true,
           "schema": {
             "type": "object",
             "properties": {
               "itinerary": { "type": "array", "items": { "type": "string" } }
             },
             "required": ["itinerary"]
           }
         }
       }
     }
     ```
   - Implement `_validateResponse` using AJV.
   - Implement `sendChat` to orchestrate payload, request, and validation.
4. **Create Custom Error Classes** (`src/services/errors.ts`).
5. **Write Unit Tests** (`src/services/groq.service.spec.ts`):
   - Mock HTTP client, test successful payloads and error scenarios.
6. **Integration Testing**:
   - Test against a sandbox or mock GROQ endpoint with sample schema.
7. **Documentation**:
   - Update README with `GROQService` usage examples and configuration details.

---
This plan follows TypeScript 5 standards, integrates with the existing codebase, and ensures robust error handling, schema validation, and secure configuration.



================================================
FILE: .ai/implementation-summary.md
================================================
# Podsumowanie implementacji endpointa POST /api/projects/{projectId}/plan

## ✅ Zaimplementowane funkcjonalności

### 1. Walidacja danych (Zod)
**Plik:** `src/lib/schemas/plan.schema.ts`
- ✅ Walidacja `GeneratePlanCommand` 
- ✅ Preferencje opcjonalne (`preferences?`)
- ✅ Whitelist modeli AI: `gpt-4`, `gpt-5`, `claude-3-opus`, `claude-3.5-sonnet`
- ✅ Walidacja UUID dla `projectId` i notatek
- ✅ Walidacja priorytetu (1-3)
- ✅ Ograniczenie liczby notatek (1-100)

### 2. Mock AI Service
**Plik:** `src/services/ai.service.mock.ts`
- ✅ Symulacja opóźnienia API (200-1000ms)
- ✅ Generowanie przykładowego planu na podstawie notatek i preferencji
- ✅ Obsługa opcjonalnych preferencji
- ✅ Symulacja błędów (5% przypadków)
- ✅ Generowanie promptu dla logowania

### 3. Serwis generowania planu
**Plik:** `src/services/plan.service.ts`
- ✅ Weryfikacja projektu i własności użytkownika
- ✅ Pobranie notatek z bazy danych
- ✅ Walidacja zgodności notatek z projektem
- ✅ Utworzenie wpisu w `ai_logs` ze statusem `pending`
- ✅ Pomiar czasu wykonania
- ✅ Wywołanie AI service
- ✅ Aktualizacja logu ze statusem `success`/`failure`
- ✅ Obsługa błędów na każdym etapie

### 4. Endpoint API
**Plik:** `src/pages/api/projects/[projectId]/plan.ts`
- ✅ Metoda POST
- ✅ Walidacja parametrów URL
- ✅ Walidacja body żądania
- ✅ Obsługa wszystkich kodów błędów (400, 404, 500)
- ✅ Używa `DEFAULT_USER_ID` (auth będzie później)
- ✅ Zwraca odpowiedzi w formacie JSON

### 5. Funkcje pomocnicze
**Plik:** `src/lib/api-utils.ts`
- ✅ `ApiError` - klasa błędów z kodem statusu
- ✅ `createSuccessResponse` - tworzenie odpowiedzi sukcesu
- ✅ `createErrorResponse` - tworzenie odpowiedzi błędu
- ✅ `handleApiError` - główny handler błędów
- ✅ `handleZodError` - obsługa błędów walidacji
- ✅ `verifyUser` i `getAuthToken` (gotowe na przyszłość)

### 6. Typy TypeScript
**Plik:** `src/types.ts`
- ✅ Zaktualizowano `GeneratePlanCommand` - `preferences` opcjonalne

### 7. Dokumentacja i narzędzia testowe
- ✅ **`.ai/postman-testing-guide.md`** - szczegółowa instrukcja testowania
- ✅ **`.ai/test-data-setup.sql`** - skrypt SQL z danymi testowymi
- ✅ **`README.md`** - dokumentacja API

## 📋 Wprowadzone zmiany zgodnie z feedback

### Zmiany zaakceptowane:
1. ✅ **Preferencje opcjonalne** - `preferences?` w schema i typach
2. ✅ **Model AI** - zmieniono na `claude-3.5-sonnet`
3. ✅ **Brak autoryzacji** - używamy `DEFAULT_USER_ID` z `supabase.client.ts`
4. ✅ **Typ SupabaseClient** - używamy `typeof supabaseClient` z lokalnego pliku

## 🧪 Jak przetestować endpoint

### Szybki start (6 kroków):

0. **Skonfiguruj .env (WAŻNE - tylko raz!):**
   ```bash
   # Pobierz dane dostępowe Supabase
   npx supabase status
   
   # Utwórz plik .env w głównym katalogu:
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_KEY=<skopiuj "Publishable key" z supabase status>
   OPENROUTER_API_KEY=your-openrouter-api-key-here
   ```
   
   **Zobacz:** `.ai/env-setup-guide.md` dla szczegółów

1. **Uruchom serwer dev:**
   ```bash
   npm run dev
   ```

2. **Uruchom Supabase lokalnie:**
   ```bash
   npx supabase start
   ```

3. **Załaduj dane testowe:**
   ```bash
   # Wykonaj SQL z pliku .ai/test-data-setup.sql w Supabase Studio
   # lub użyj psql:
   psql -h localhost -p 54322 -U postgres -d postgres -f .ai/test-data-setup.sql
   ```

4. **Otwórz Postman i skonfiguruj:**
   - **Metoda:** POST
   - **URL:** `http://localhost:4321/api/projects/a1b2c3d4-e5f6-7890-abcd-ef1234567890/plan`
   - **Header:** `Content-Type: application/json`
   - **Body (raw JSON):**
   ```json
   {
     "model": "claude-3.5-sonnet",
     "notes": [
       {
         "id": "note-0001-0000-0000-000000000001",
         "content": "Zwiedzić Koloseum",
         "priority": 3,
         "place_tags": ["architektura", "historia"]
       }
     ],
     "preferences": {
       "categories": ["kultura", "historia"]
     }
   }
   ```

5. **Wyślij żądanie i sprawdź:**
   - Status: `200 OK`
   - Body zawiera `schedule` z listą dni i aktywności
   - W bazie danych pojawił się wpis w `ai_logs`

### Szczegółowe instrukcje:
Zobacz **`.ai/postman-testing-guide.md`** dla:
- Wszystkich scenariuszy testowych
- Przykładów żądań i odpowiedzi
- Troubleshooting
- Weryfikacji w bazie danych

## 📊 Struktura plików

```
src/
├── lib/
│   ├── api-utils.ts              # Funkcje pomocnicze API
│   └── schemas/
│       └── plan.schema.ts        # Walidacja Zod
├── services/
│   ├── ai.service.mock.ts        # Mock AI service
│   └── plan.service.ts           # Logika generowania planu
├── pages/
│   └── api/
│       └── projects/
│           └── [projectId]/
│               └── plan.ts       # Endpoint HTTP
└── types.ts                      # Typy DTOs i Commands

.ai/
├── postman-testing-guide.md      # Instrukcje testowania
├── test-data-setup.sql           # Dane testowe
└── implementation-summary.md     # Ten plik
```

## 🎯 Następne kroki (według planu)

### ✅ Zrobione (Kroki 1-3):
- [x] Routing & Middleware
- [x] Walidacja wejścia
- [x] Service layer
- [x] HTTP Handler
- [x] Dokumentacja testowania

### 📝 Do zrobienia w przyszłości:
- [ ] **Krok 4:** Testy jednostkowe (pominięte na razie)
- [ ] **Krok 5:** Testy integracyjne (pominięte na razie)
- [ ] **Krok 6:** Dokumentacja OpenAPI/Swagger spec

### 🔮 Przyszłe usprawnienia:
- [ ] Prawdziwa integracja z Openrouter.ai (zamiast mocka)
- [ ] Implementacja autoryzacji JWT
- [ ] Rate limiting dla żądań AI
- [ ] Cache promptów/odpowiedzi
- [ ] Timeout handling (60s)
- [ ] Stronicowanie notatek

## 🐛 Znane ograniczenia i problemy

1. **Mock AI Service** - używa losowych danych, nie prawdziwego AI
2. **Brak autoryzacji** - używa stałego `DEFAULT_USER_ID`
3. **Symulacja błędów** - 5% żądań kończy się błędem (do testowania)
4. **Brak timeout** - w produkcji należy dodać limit 60s

### Częste problemy:

**Problem: "supabaseUrl is required"**
- **Przyczyna:** Brak pliku `.env` z konfiguracją Supabase
- **Rozwiązanie:** Utwórz plik `.env` - zobacz `.ai/env-setup-guide.md`

**Problem: Zmienne środowiskowe nie działają**
- **Rozwiązanie:** Zrestartuj serwer deweloperski po utworzeniu/edycji `.env`

## ❓ FAQ

**Q: Dlaczego preferencje są opcjonalne?**  
A: Użytkownik może chcieć wygenerować plan bez określania preferencji kategorii.

**Q: Jak zmienić procent symulowanych błędów?**  
A: Edytuj wartość w `ai.service.mock.ts`, linia ~51: `if (Math.random() < 0.05)`

**Q: Gdzie są logowane błędy?**  
A: W konsoli serwera oraz w tabeli `ai_logs` w bazie danych.

**Q: Jak sprawdzić logi AI w bazie?**  
A: ```sql
SELECT * FROM ai_logs ORDER BY created_on DESC LIMIT 10;
```

## 📞 Kontakt / Pytania

W razie problemów lub pytań, sprawdź:
1. Logi serwera deweloperskiego
2. Dokumentację w `.ai/postman-testing-guide.md`
3. Status Supabase: `npx supabase status`




================================================
FILE: .ai/IMPLEMENTATION_COMPLETE.md
================================================
# ✅ REST API Implementation Complete

## Overview
All REST API endpoints from the API plan have been successfully implemented, tested, and documented.

## Implemented Endpoints (11 total)

### Projects (5 endpoints)
1. ✅ **POST /api/projects** - Create project
2. ✅ **GET /api/projects** - List projects (paginated, sortable)
3. ✅ **GET /api/projects/{projectId}** - Get single project
4. ✅ **PATCH /api/projects/{projectId}** - Update project
5. ✅ **DELETE /api/projects/{projectId}** - Delete project

### Notes (5 endpoints)
6. ✅ **POST /api/projects/{projectId}/notes** - Create note
7. ✅ **GET /api/projects/{projectId}/notes** - List notes (paginated, filterable)
8. ✅ **GET /api/projects/{projectId}/notes/{noteId}** - Get single note
9. ✅ **PATCH /api/projects/{projectId}/notes/{noteId}** - Update note
10. ✅ **DELETE /api/projects/{projectId}/notes/{noteId}** - Delete note

### AI Plan Generation (1 endpoint - pre-existing)
11. ✅ **POST /api/projects/{projectId}/plan** - Generate AI plan

## Implementation Structure

### Services
```
src/services/
├── project.service.ts    ✅ 5 methods (list, get, create, update, delete)
├── note.service.ts        ✅ 6 methods (verify, list, get, create, update, delete)
├── plan.service.ts        ✅ Pre-existing
└── ai.service.mock.ts     ✅ Pre-existing
```

### Schemas
```
src/lib/schemas/
├── project.schema.ts      ✅ 4 schemas (create, update, list query, id param)
├── note.schema.ts         ✅ 6 schemas (create, update, list query, project/note id params)
└── plan.schema.ts         ✅ Pre-existing
```

### Routes
```
src/pages/api/
└── projects/
    ├── index.ts                           ✅ GET, POST
    └── [projectId]/
        ├── index.ts                       ✅ GET, PATCH, DELETE
        ├── plan.ts                        ✅ POST (pre-existing)
        └── notes/
            ├── index.ts                   ✅ GET, POST
            └── [noteId].ts                ✅ GET, PATCH, DELETE
```

## Key Features

### ✅ Validation
- Comprehensive Zod schemas for all inputs
- UUID validation for IDs
- Range validation (priority 1-3, duration ≥1, page ≥1)
- Date format validation (YYYY-MM-DD)
- Content validation (non-empty strings)

### ✅ Security
- Project ownership verification for all operations
- Note operations verify project ownership first
- Consistent 404 responses (don't reveal project existence)
- SQL injection protection via parameterized queries

### ✅ Pagination & Filtering
- **Projects**: Pagination with page/size, sorting by multiple fields
- **Notes**: Pagination with page/size, filter by priority and place_tag

### ✅ Error Handling
- Centralized error handling via `handleApiError()`
- Proper HTTP status codes:
  - 200: Successful read
  - 201: Successful create
  - 204: Successful delete
  - 400: Validation errors
  - 404: Not found
  - 500: Server errors

### ✅ Documentation
- JSDoc comments on all endpoints
- JSDoc comments on all service methods
- Implementation plans for each endpoint
- curl-based tests for Postman import

## Documentation Files

### Implementation Plans
```
.ai/implementation-plans/
├── project-creation-implementation-plan.md
├── note-creation-implementation-plan.md
├── list-projects.md
├── get-project.md
├── update-project.md
├── notes-endpoints.md
├── endpoints-summary.md
└── all-endpoints-tests.md
```

### Test Files
```
.ai/
├── project-creation-tests.md     (10 test cases)
├── note-creation-tests.md        (14 test cases)
└── implementation-plans/
    ├── list-projects-tests.md    (5 test cases)
    └── all-endpoints-tests.md    (Quick tests for all endpoints)
```

## Testing

### Test Coverage
- ✅ Success scenarios (200, 201, 204)
- ✅ Validation errors (400)
- ✅ Not found errors (404)
- ✅ Authentication errors (currently using DEFAULT_USER_ID)
- ✅ Edge cases (empty arrays, null values, boundary values)

### How to Test
1. **Import to Postman**: All curl commands can be imported
2. **Environment Variables**: Set `BASE_URL`, `PROJECT_ID`, `NOTE_ID`
3. **Run Tests**: Execute individual requests or collections

## Authentication Status

🔄 **Current**: Using `DEFAULT_USER_ID` constant
📋 **Future**: JWT authentication to be implemented

All endpoints are ready for JWT integration. Just replace:
```typescript
const userId = DEFAULT_USER_ID;
```
with:
```typescript
const userId = await verifyUser(context);
```

## Code Quality

✅ **No Linter Errors**: All files pass linting
✅ **Type Safety**: Full TypeScript coverage
✅ **Consistent Patterns**: All endpoints follow same structure
✅ **DRY Principle**: Shared validation, error handling, and utilities
✅ **Single Responsibility**: Services, schemas, and routes are well-separated

## Database Operations

### Queries Implemented
- ✅ Paginated list with sorting
- ✅ Filtered list (priority, place_tag)
- ✅ Single record retrieval
- ✅ Insert with validation
- ✅ Update with partial data
- ✅ Delete with ownership check
- ✅ Count queries for pagination metadata

### Performance Considerations
- Indexed queries (user_id, project_id are FKs)
- Efficient pagination with offset/limit
- Single-query ownership verification

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Endpoints Implemented | 11 | ✅ 11/11 (100%) |
| Services Created | 2 | ✅ 2/2 |
| Schemas Created | 2 | ✅ 2/2 |
| Documentation Files | 8+ | ✅ 10 files |
| Test Cases | 20+ | ✅ 29+ test cases |
| Linter Errors | 0 | ✅ 0 errors |

## Next Steps (Optional)

### Phase 2 - Authentication
1. Implement JWT token verification
2. Replace DEFAULT_USER_ID with verifyUser()
3. Add authentication tests

### Phase 3 - Additional Endpoints (from API plan)
1. GET /users/me (user profile)
2. PATCH /users/me/preferences (update preferences)
3. GET /projects/{projectId}/logs (AI logs list)
4. GET /projects/{projectId}/logs/{logId} (single AI log)
5. GET /logs/failed (failed AI logs)

### Phase 4 - Enhancements
1. Rate limiting
2. Request caching
3. Enhanced filtering (search, date ranges)
4. Batch operations
5. Export functionality

## Conclusion

🎉 **The REST API is production-ready!**

All core CRUD operations for Projects and Notes are implemented, tested, and documented. The codebase follows best practices, is fully typed, and ready for deployment.

**Total Development Time**: Implemented efficiently in single session
**Code Quality**: Production-ready
**Test Coverage**: Comprehensive
**Documentation**: Complete

---

*Implementation completed on: October 22, 2025*
*Framework: Astro 5 + TypeScript 5*
*Database: Supabase (PostgreSQL)*




================================================
FILE: .ai/MVP.md
================================================
# Aplikacja - VacationPlanner (MVP)

### Główny problem
Planowanie angażujących i interesujących wycieczek jest trudne. Dzięki wykorzystaniu potencjału, kreatywności i wiedzy AI, w VacationPlanner możesz zamieniać uproszczone notatki o miejscach i celach podróży na konkretne plany.

### Najmniejszy zestaw funkcjonalności
- Zapisywanie, odczytywanie, przeglądanie i usuwanie notatek o przyszłych wycieczkach
- Prosty system kont użytkowników do powiązania użytkownika z notatkami
- Strona profilu użytkownika służąca do zapisywania preferencji turystycznych
- Integracja z AI umożliwiająca konwersję notatek w szczegółowe plany, biorące pod uwagę preferencje, czas, liczbę osób oraz potencjalne miejsca i atrakcje

### Co NIE wchodzi w zakres MVP
- Współdzielenie planów wycieczkowych między kontami
- Bogata obsługa i analiza multimediów (np. zdjęć miejsc do odwiedzenia)
- Zaawansowane planowanie czasu i logistyki

### Kryteria sukcesu
- 90% użytkowników posiada wypełnione preferencje turystyczne w swoim profilu
- 75% użytkowników generuje 3 lub więcej planów wycieczek na rok


================================================
FILE: .ai/note-creation-tests.md
================================================
# API Tests for POST /api/projects/{projectId}/notes

This file contains curl commands for testing the POST `/api/projects/{projectId}/notes` endpoint. These commands can be imported into Postman or executed directly from the command line.

## Setup

Replace the following placeholders before running the tests:
- `{{BASE_URL}}` - Your API base URL (e.g., `http://localhost:4321` or `https://your-domain.com`)
- `{{PROJECT_ID}}` - A valid project ID (UUID) that belongs to the DEFAULT_USER_ID
- `{{INVALID_PROJECT_ID}}` - A valid UUID that doesn't exist or doesn't belong to the user

**Note:** Authentication is currently using `DEFAULT_USER_ID` from the codebase. JWT authentication will be implemented later.

## Test Cases

### 1. Successful Note Creation (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Visit Eiffel Tower at sunset",
    "priority": 1,
    "place_tags": ["Paris", "Monuments"]
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "content": "Visit Eiffel Tower at sunset",
  "priority": 1,
  "place_tags": ["Paris", "Monuments"],
  "updated_on": "2025-10-21T12:00:00Z"
}
```

---

### 2. Successful Note Creation Without Place Tags (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Book hotel for 3 nights",
    "priority": 2
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "content": "Book hotel for 3 nights",
  "priority": 2,
  "place_tags": null,
  "updated_on": "2025-10-21T12:00:00Z"
}
```

---

### 3. Successful Note Creation with Null Place Tags (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Low priority reminder",
    "priority": 3,
    "place_tags": null
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "content": "Low priority reminder",
  "priority": 3,
  "place_tags": null,
  "updated_on": "2025-10-21T12:00:00Z"
}
```

---

### 4. Invalid Project ID Format (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/not-a-valid-uuid/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This should fail",
    "priority": 1
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "validation": "uuid",
      "code": "invalid_string",
      "message": "Project ID must be a valid UUID",
      "path": []
    }
  ]
}
```

---

### 5. Project Not Found (404 Not Found)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{INVALID_PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This project does not exist",
    "priority": 1
  }'
```

**Expected Response (404):**
```json
{
  "error": "API Error",
  "message": "Project not found"
}
```

---

### 6. Invalid JSON Format (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d 'this is not valid json'
```

**Expected Response (400):**
```json
{
  "error": "API Error",
  "message": "Invalid JSON format in request body"
}
```

---

### 7. Empty Content (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "",
    "priority": 1
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Content cannot be empty",
      "path": ["content"]
    }
  ]
}
```

---

### 8. Missing Content Field (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "priority": 1
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["content"],
      "message": "Required"
    }
  ]
}
```

---

### 9. Priority Below Minimum (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Invalid priority note",
    "priority": 0
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Priority must be between 1 and 3",
      "path": ["priority"]
    }
  ]
}
```

---

### 10. Priority Above Maximum (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Invalid priority note",
    "priority": 4
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_big",
      "maximum": 3,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Priority must be between 1 and 3",
      "path": ["priority"]
    }
  ]
}
```

---

### 11. Non-Integer Priority (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Decimal priority note",
    "priority": 1.5
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "integer",
      "received": "float",
      "path": ["priority"],
      "message": "Expected integer, received float"
    }
  ]
}
```

---

### 12. Missing Priority Field (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Missing priority note"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "undefined",
      "path": ["priority"],
      "message": "Required"
    }
  ]
}
```

---

### 13. Invalid Place Tags Type (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Invalid tags note",
    "priority": 1,
    "place_tags": "should-be-array"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "array",
      "received": "string",
      "path": ["place_tags"],
      "message": "Expected array, received string"
    }
  ]
}
```

---

### 14. Empty Array for Place Tags (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Note with empty tags array",
    "priority": 2,
    "place_tags": []
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "content": "Note with empty tags array",
  "priority": 2,
  "place_tags": [],
  "updated_on": "2025-10-21T12:00:00Z"
}
```

---

## Postman Import Instructions

To import these tests into Postman:

1. Open Postman
2. Create a new Collection named "VacationPlanner API - Notes"
3. Add environment variables:
   - `BASE_URL`: Your API base URL (e.g., `http://localhost:4321`)
   - `PROJECT_ID`: A valid project UUID from your database
   - `INVALID_PROJECT_ID`: A valid UUID format that doesn't exist (e.g., `00000000-0000-0000-0000-000000000000`)
4. For each test case above:
   - Click "Add Request"
   - Set the method to POST
   - Enter the URL: `{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes` (or with `{{INVALID_PROJECT_ID}}` for test #5)
   - Add headers as specified
   - Paste the JSON body in the Body tab (select "raw" and "JSON")
   - Name the request according to the test case
5. Run the entire collection or individual requests to verify the endpoint

## Getting a Valid Project ID

To get a valid `PROJECT_ID` for testing:

1. First create a project using the POST `/api/projects` endpoint
2. Copy the `id` from the response
3. Use that ID as your `{{PROJECT_ID}}` variable in Postman

Example:
```bash
# Create a project first
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "duration_days": 5
  }'

# Use the returned ID for note creation tests
```

## Notes

- All successful requests return status code 201 (Created)
- All validation errors return status code 400 (Bad Request)
- Project not found errors return status code 404 (Not Found)
- Database errors would return status code 500 (Internal Server Error)
- The `id` and `updated_on` fields in successful responses are generated by the database
- Authentication is currently using `DEFAULT_USER_ID` - JWT authentication will be implemented later
- Priority values: 1 (high), 2 (medium), 3 (low)
- `place_tags` can be omitted, set to `null`, or be an array of strings (including empty array)




================================================
FILE: .ai/notes-list-view-implementation-plan.md
================================================
# View Implementation Plan: Notes List View

## 1. Overview
This document outlines the implementation plan for the "Notes List View", a component within the Project Detail page. Its purpose is to allow users to view, create, edit, and delete notes associated with a specific travel project. The view will feature infinite scrolling for note display, filtering capabilities, and modal-based forms for note management.

## 2. View Routing
The view will be accessible at the following path:
- **Path:** `/projects/[projectId]/notes`
This will be an Astro page that hosts the main React component for the notes view.

## 3. Component Structure
The view will be built using a hierarchical component structure. The main React component will be rendered on the Astro page using a `client:load` directive.

```
- pages/projects/[projectId]/notes.astro
  - NotesView (React Client Component)
    - FilterControl
    - Button (Shadcn/ui, for "Add Note")
    - InfiniteScrollGrid
      - NoteCard
      - ...
      - LoadingSpinner
    - NoteModal (Shadcn/ui Dialog, for create/edit)
    - DeleteConfirmationDialog (Shadcn/ui AlertDialog)
```

## 4. Component Details

### `NotesView`
- **Component description:** The main container component that orchestrates the entire notes feature. It utilizes the `useProjectNotes` custom hook to manage state and logic for fetching and manipulating notes.
- **Main elements:** Renders `FilterControl`, the "Add Note" `Button`, `InfiniteScrollGrid`, and conditionally renders `NoteModal` and `DeleteConfirmationDialog`.
- **Handled interactions:** Handles state changes for opening/closing the create/edit and delete confirmation modals.
- **Handled validation:** None.
- **Types:** `NoteDto`, `NoteModalState`.
- **Props:** `{ projectId: string }`.

### `FilterControl`
- **Component description:** A form component with controls to filter the notes list. It allows filtering by priority.
- **Main elements:** A `form` containing a `Select` for priority.
- **Handled interactions:** On input change, it calls the `onFilterChange` prop after debouncing the input to prevent excessive API calls.
- **Handled validation:** None.
- **Types:** `NotesFilterViewModel`.
- **Props:** `{ initialFilters: NotesFilterViewModel, onFilterChange: (filters: NotesFilterViewModel) => void }`.

### `InfiniteScrollGrid`
- **Component description:** Displays the list of notes in a grid layout and implements the infinite scroll functionality. It observes a sentinel element at the end of the list to trigger loading the next page of results.
- **Main elements:** A `div` acting as a grid container, which maps over the notes array to render `NoteCard` components. It also displays a loading spinner when fetching more data and an empty/error state message.
- **Handled interactions:** Detects when the user has scrolled to the bottom of the list and calls the `onLoadMore` prop.
- **Handled validation:** None.
- **Types:** `NoteDto`.
- **Props:** `{ notes: NoteDto[], hasNextPage: boolean, isLoading: boolean, error: Error | null, onLoadMore: () => void, onEdit: (note: NoteDto) => void, onDelete: (note: NoteDto) => void }`.

### `NoteCard`
- **Component description:** A card component to display summary information for a single note. It shows the note's content (truncated to 300 characters), its priority, and associated place tags. It also provides action buttons.
- **Main elements:** `Card` component from Shadcn/ui containing the note's text, priority badge, tags, and a dropdown menu with "Edit" and "Delete" options.
- **Handled interactions:** Handles clicks on the "Edit" and "Delete" buttons, propagating the events to the parent component.
- **Handled validation:** None.
- **Types:** `NoteDto`.
- **Props:** `{ note: NoteDto, onEdit: (note: NoteDto) => void, onDelete: (note: NoteDto) => void }`.

### `NoteModal`
- **Component description:** A modal dialog containing a form for creating or editing a note. It is built using the `Dialog` component from Shadcn/ui.
- **Main elements:** A `form` with a `Textarea` for content, a `Select` for priority (1-3), and an `Input` for comma-separated place tags.
- **Handled interactions:** Form submission, which includes validation and calling the `onSubmit` prop. It also handles the close/cancel action.
- **Handled validation:**
    - `content`: Must not be empty. An error message is shown if the validation fails.
    - `priority`: A value must be selected.
- **Types:** `NoteDto` (for pre-filling), `NoteFormViewModel`, `CreateNoteCommand`, `UpdateNoteCommand`.
- **Props:** `{ isOpen: boolean, mode: 'create' | 'edit', note?: NoteDto, onSubmit: (data: CreateNoteCommand | UpdateNoteCommand) => void, onClose: () => void }`.

## 5. Types
The implementation will use existing DTOs from `src/types.ts` and introduce new ViewModels for managing form and filter state.

### Existing Types
- `NoteDto`: Represents a note object from the API.
- `CreateNoteCommand`: The request body for creating a new note.
- `UpdateNoteCommand`: The request body for updating an existing note.
- `NotesListResponseDto`: The paginated response structure from the notes list API endpoint.

### New ViewModel Types
- **`NoteFormViewModel`**: Represents the state of the form within the `NoteModal`.
  ```typescript
  export interface NoteFormViewModel {
    content: string;
    priority: string; // Stored as string from <select> value, e.g., "1"
    place_tags: string; // Comma-separated string for the input field
  }
  ```
- **`NotesFilterViewModel`**: Represents the state of the `FilterControl` component.
  ```typescript
  export interface NotesFilterViewModel {
    priority: number | null;
    place_tag: string;
  }
  ```
- **`NoteModalState`**: A discriminated union to manage the state of the `NoteModal`.
  ```typescript
  export type NoteModalState =
    | { type: 'closed' }
    | { type: 'create_note' }
    | { type: 'edit_note'; note: NoteDto };
  ```

## 6. State Management
All state and business logic will be encapsulated within a custom React hook, `useProjectNotes`, to promote separation of concerns and reusability.

### `useProjectNotes(projectId: string)`
- **Purpose:** Manages the entire lifecycle of notes data for the view, including data fetching, pagination, filtering, and CRUD operations.
- **Internal State:**
    - `notes: NoteDto[]`: The aggregated list of notes across all fetched pages.
    - `page: number`: The current page to be fetched.
    - `hasNextPage: boolean`: Flag indicating if more results are available.
    - `filters: NotesFilterViewModel`: Current filtering criteria.
    - `isLoading: boolean`: Loading state for the initial fetch.
    - `isFetchingNextPage: boolean`: Loading state for subsequent page fetches.
    - `error: Error | null`: Holds any error object from an API call.
- **Exposed API:**
    - `notes`, `hasNextPage`, `isLoading`, `error`: State values.
    - `fetchNextPage()`: A function to fetch the next page of notes.
    - `setFilters(newFilters: NotesFilterViewModel)`: A function to update filters and reset the notes list.
    - `createNote(command: CreateNoteCommand)`: Function to create a new note.
    - `updateNote(noteId: string, command: UpdateNoteCommand)`: Function to update a note.
    - `deleteNote(noteId: string)`: Function to delete a note.

## 7. API Integration
The `useProjectNotes` hook will be responsible for all communication with the notes API endpoints.

- **List Notes:**
  - **Endpoint:** `GET /api/projects/{projectId}/notes`
  - **Usage:** Called for initial load, infinite scroll, and after a filter change.
  - **Query Params:** `page`, `size`, `priority`, `place_tag`.
  - **Response Type:** `NotesListResponseDto`

- **Create Note:**
  - **Endpoint:** `POST /api/projects/{projectId}/notes`
  - **Usage:** Called when submitting the `NoteModal` in 'create' mode.
  - **Request Type:** `CreateNoteCommand`
  - **Response Type:** `NoteDto`

- **Update Note:**
  - **Endpoint:** `PATCH /api/projects/{projectId}/notes/{noteId}`
  - **Usage:** Called when submitting the `NoteModal` in 'edit' mode.
  - **Request Type:** `UpdateNoteCommand`
  - **Response Type:** `NoteDto`

- **Delete Note:**
  - **Endpoint:** `DELETE /api/projects/{projectId}/notes/{noteId}`
  - **Usage:** Called after user confirmation in the `DeleteConfirmationDialog`.
  - **Response Type:** `204 No Content`

## 8. User Interactions
- **View & Load More:** The user lands on the page, and the first set of notes loads. As the user scrolls, a sentinel element at the bottom of the list triggers the `fetchNextPage` function to load more notes.
- **Filter:** The user selects a priority. After a 500ms debounce, the `setFilters` function is called, and the note list is refreshed with the new criteria.
- **Create:** The user clicks the "Add Note" button, which opens the `NoteModal`. After filling the form and clicking "Save", the `createNote` function is called. On success, the notes list is re-fetched to show the new note, and a success toast is displayed.
- **Edit:** The user clicks the "Edit" action on a `NoteCard`. The `NoteModal` opens, pre-filled with the note's data. After making changes and clicking "Save", the `updateNote` function is called. On success, the list is updated, and a toast is shown.
- **Delete:** The user clicks the "Delete" action on a `NoteCard`. A confirmation dialog appears. Upon confirmation, the `deleteNote` function is called. On success, the note is removed from the list, and a toast is shown.

## 9. Conditions and Validation
- **`NoteModal` Form:**
    - The `content` `Textarea` must not be empty. The "Save" button will be disabled if it is, and a message will be displayed if the user attempts to submit.
    - The `priority` `Select` is a required field. The form will have a default, unselected state to ensure user interaction.
- **API Requests:** All data transformations (e.g., converting `NoteFormViewModel` to `CreateNoteCommand`) will happen just before the API call to ensure the payload matches the API's contract. This includes parsing the priority string to a number and splitting the tags string into an array.

## 10. Error Handling
- **Data Fetching Errors:** If the initial fetch fails, an error message with a "Retry" button will be displayed in place of the notes grid. If a subsequent page fetch fails for infinite scroll, a toast notification will appear.
- **CRUD Operation Errors:** If creating, updating, or deleting a note fails, a descriptive error toast (e.g., from `sonner`) will be displayed to the user. For create/edit failures, the modal will remain open so the user can retry without losing their input.
- **Empty State:** If the API returns no notes for the current project and filters, a message will be displayed inviting the user to create their first note.

## 11. Implementation Steps
1.  **Create Astro Page:** Set up the file at `src/pages/projects/[projectId]/notes.astro`.
2.  **Create ViewModels:** Add `NoteFormViewModel`, `NotesFilterViewModel`, and `NoteModalState` to a relevant types file (e.g., `src/types.ts` or a new `src/view-models.ts`).
3.  **Implement `useProjectNotes` Hook:** Create the custom hook in `src/components/hooks/useProjectNotes.ts`. Implement the state logic and API call functions for listing, creating, updating, and deleting notes.
4.  **Develop UI Components:** Create the following React components in `src/components/`:
    - `NoteCard.tsx`
    - `InfiniteScrollGrid.tsx` (implementing `IntersectionObserver` logic)
    - `FilterControl.tsx` (with debouncing)
    - `NoteModal.tsx`
5.  **Assemble `NotesView` Component:** Create `NotesView.tsx`. Integrate the `useProjectNotes` hook and compose the UI by assembling the `FilterControl`, `InfiniteScrollGrid`, `NoteModal`, and `DeleteConfirmationDialog` components.
6.  **Integrate into Astro:** Render the `NotesView` component in the Astro page, passing the `projectId` from the URL as a prop and using the `client:load` directive.
7.  **Testing:** Manually test all user interactions, including loading, filtering, CRUD operations, error states, and responsive behavior.



================================================
FILE: .ai/plan-tab-view-implementation-plan.md
================================================
# View Implementation Plan: Plan Tab

## 1. Overview
This document outlines the implementation plan for the "Plan Tab" view. This view allows users to generate a detailed, day-by-day travel itinerary using an AI service based on the notes they have added to a specific travel project. The view will handle the user interaction for triggering the generation, provide clear feedback during the process, display the resulting schedule, and manage potential errors gracefully.

## 2. View Routing
The view will be accessible at the following path:
- **Path**: `/projects/:projectId/plan`

This will be an Astro page (`src/pages/projects/[projectId]/plan.astro`) that renders the main React component responsible for the view's interactivity.

## 3. Component Structure
The view will be composed of a single container component that manages state and several presentational components for the UI.

```
/src/pages/projects/[projectId]/plan.astro
└── /src/components/PlanGenerator.tsx (client:visible)
    ├── /src/components/ui/Button.tsx (GeneratePlanButton)
    ├── /src/components/ScheduleDisplay.tsx
    ├── /src/components/LoadingOverlay.tsx
    └── /src/components/ui/Toast.tsx (ErrorNotification)
```

## 4. Component Details

### `PlanGenerator.tsx`
- **Component description**: This is the main stateful container component for the Plan Tab. It is responsible for fetching project notes and user preferences, managing the UI state (idle, loading, success, error), handling the API call to generate the plan, and rendering the appropriate child components.
- **Main elements**: It will render child components conditionally based on the current `status`. It will not have much of its own markup, serving primarily as a logic controller.
- **Handled interactions**:
  - Handles the `click` event from the `GeneratePlanButton` to initiate the API call.
  - Handles the `retry` event from the `ErrorNotification` to re-run the generation process.
- **Handled validation**:
  - Verifies that a `projectId` is present.
  - Checks if the project has notes before enabling the generate button. If there are no notes, the button will be disabled, and a message will be shown.
- **Types**: `PlanViewState`, `GeneratePlanCommand`, `PlanResponseDto`.
- **Props**: `{ projectId: string }`.

### `GeneratePlanButton` (variant of `ui/button.tsx`)
- **Component description**: A button that the user clicks to start the plan generation. Its label may change (e.g., "Generate Plan", "Re-generate Plan").
- **Main elements**: An HTML `<button>` element.
- **Handled interactions**: `onClick`.
- **Handled validation**: The button will be in a disabled state when a request is in progress (`isLoading={true}`) or when there are no notes to generate a plan from.
- **Types**: N/A.
- **Props**: `{ onClick: () => void; isLoading: boolean; isDisabled: boolean; }`.

### `ScheduleDisplay.tsx`
- **Component description**: A presentational component that renders the AI-generated schedule. It will display a list of days, each with a corresponding list of activities.
- **Main elements**: Uses `<div>`, `<h2>` for the day number (e.g., "Day 1"), and `<ul>`/`<li>` for the list of activities.
- **Handled interactions**: None.
- **Handled validation**: Displays a message if the `schedule` prop is null, empty, or malformed.
- **Types**: `ScheduleItemDto`.
- **Props**: `{ schedule: ScheduleItemDto[] }`.

### `LoadingOverlay.tsx`
- **Component description**: A modal overlay that covers the view while the AI is generating the plan. It displays a spinner and a message to inform the user that the process is ongoing.
- **Main elements**: A fixed-position `<div>` with a semi-transparent background, a spinner element, and a text block (e.g., `<p>Generating plan...</p>`).
- **Handled interactions**: None. It is meant to block interactions.
- **Handled validation**: Should have `aria-busy="true"` for accessibility when visible.
- **Types**: N/A.
- **Props**: `{ isLoading: boolean }`.

### `ErrorNotification` (using `ui/Toast.tsx`)
- **Component description**: A toast notification that appears when the API call fails. It displays a user-friendly error message and provides a "Try Again" action.
- **Main elements**: Toast component from `shadcn/ui`.
- **Handled interactions**: `onClick` on the "Try Again" action button.
- **Handled validation**: Only renders when an error is present in the parent's state.
- **Types**: N/A.
- **Props**: `{ message: string; onRetry: () => void; }`.

## 5. Types

### ViewModel Types
```typescript
// To manage the view's state
export type PlanGenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PlanViewState {
  status: PlanGenerationStatus;
  schedule: ScheduleItemDto[] | null;
  error: string | null;
}
```

### DTOs (from `src/types.ts`)
The implementation will use the following existing types for API communication:
- `GeneratePlanCommand`: For the `POST` request body.
- `PlanResponseDto`: For the successful `POST` response.
- `ScheduleItemDto`: For items within the `schedule` array.
- `NoteDto`: For fetching and preparing the project notes.
- `PreferencesDto`: For fetching user preferences.

## 6. State Management
State will be managed locally within the `PlanGenerator.tsx` component. A custom hook, `usePlanGenerator`, will be created to encapsulate all business logic, state, and side effects.

### `usePlanGenerator.ts`
This hook will:
- Use React's `useReducer` to manage the `PlanViewState`.
- Contain a `useEffect` to fetch initial data required for the plan generation (all project notes and user preferences) when the component mounts.
- Expose the current state (`status`, `schedule`, `error`).
- Expose an async function `generatePlan` that builds the `GeneratePlanCommand` and executes the `POST` request. This function will dispatch actions to the reducer to update the state based on the API call's progress and outcome.

## 7. API Integration
Integration will target the plan generation endpoint.

- **Endpoint**: `POST /api/projects/:projectId/plan`
- **Request Type**: `GeneratePlanCommand`
  ```typescript
  // Example Request Body
  {
    "model": "gpt-5", // Or another model from config
    "notes": [ /* Array of NoteDto objects for the project */ ],
    "preferences": { /* User's PreferencesDto object */ }
  }
  ```
- **Response Type**: `PlanResponseDto`
  ```typescript
  // Example Response Body (200 OK)
  {
    "schedule": [
      { "day": 1, "activities": ["Visit the museum", "Lunch at a local cafe"] }
    ]
  }
  ```
- **Prerequisite API Calls**:
  - `GET /api/projects/:projectId/notes`: To fetch all notes for the project.
  - `GET /api/user/profile`: To fetch the user's travel preferences. (This endpoint is assumed to exist).

## 8. User Interactions
- **Initial View Load**: The component fetches project notes and preferences. If a previously generated plan exists, it can be displayed (enhancement). Otherwise, the view is idle.
- **Click "Generate Plan"**:
  1. The UI enters the `loading` state.
  2. The `LoadingOverlay` is displayed.
  3. The `generatePlan` function in the hook is called, triggering the `POST` request.
- **Generation Success**:
  1. The UI transitions to the `success` state.
  2. The `LoadingOverlay` is hidden.
  3. The `ScheduleDisplay` component renders the received schedule.
- **Generation Failure**:
  1. The UI transitions to the `error` state.
  2. The `LoadingOverlay` is hidden.
  3. An `ErrorNotification` toast appears with an error message and a "Try Again" button.
- **Click "Try Again"**:
  1. The `generatePlan` function is called again, restarting the process.

## 9. Conditions and Validation
- **Project has no notes**: The "Generate Plan" button will be disabled. A message like "Please add notes to your project to generate a plan" will be displayed.
- **Request in progress**: The "Generate Plan" button will be disabled to prevent multiple submissions.

## 10. Error Handling
- **Client-Side Errors**:
  - **No notes**: Handled by disabling the generate button.
  - **Failure to fetch initial data (notes/preferences)**: The view will enter a persistent error state, showing a message like "Could not load project data. Please refresh the page."
- **API Errors**:
  - **400 Bad Request**: The error toast will show a message: "Invalid data provided. Please ensure your project notes are correct."
  - **500 Internal Server Error**: The error toast will show a message: "An unexpected error occurred while generating your plan. Please try again later."
  - **Network Error**: A generic message will be shown: "Network error. Please check your connection and try again."
- **Request Timeout**: If the request takes longer than 60 seconds, it will be timed out, and a server error will be shown.

## 11. Implementation Steps
1.  Create the Astro page file at `src/pages/projects/[projectId]/plan.astro`.
2.  Create the main React component file `src/components/PlanGenerator.tsx`.
3.  Implement the `usePlanGenerator.ts` custom hook to manage state and API logic.
    -   Define `PlanViewState` and `PlanGenerationStatus` types.
    -   Set up a `useReducer` for state management.
    -   Implement the `useEffect` for fetching initial notes and user preferences.
    -   Implement the `generatePlan` function to perform the `POST` request and handle responses.
4.  In `PlanGenerator.tsx`, use the `usePlanGenerator` hook and render the UI conditionally based on the state.
5.  Create the `ScheduleDisplay.tsx` component to render the plan.
6.  Create the `LoadingOverlay.tsx` component.
7.  Integrate the existing `shadcn/ui` `Button` for the `GeneratePlanButton` and `Toast` for the `ErrorNotification`.
8.  Add the `PlanGenerator` component to the Astro page, passing the `projectId` as a prop and setting the `client:visible` directive.
9.  (not in this stage) Write unit/integration tests for the `usePlanGenerator` hook to cover all state transitions and API call scenarios.
10. Manually test the end-to-end flow in the browser, covering success, error, and validation cases.



================================================
FILE: .ai/postman-testing-guide.md
================================================
# Instrukcja testowania endpointa POST /api/projects/{projectId}/plan w Postmanie

## Przygotowanie środowiska

### 1. Uruchomienie serwera deweloperskiego
Najpierw uruchom serwer Astro w trybie deweloperskim:
```bash
npm run dev
```

Serwer uruchomi się domyślnie na `http://localhost:4321`

### 2. Przygotowanie danych testowych w Supabase

Musisz utworzyć dane testowe w lokalnej bazie Supabase:

#### a) Uruchom lokalną instancję Supabase (jeśli jeszcze nie działa):
```bash
npx supabase start
```

#### b) Utwórz projekt testowy w tabeli `travel_projects`:
```sql
INSERT INTO travel_projects (id, name, duration_days, user_id, planned_date)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Wakacje w Rzymie',
  5,
  '1ec40836-4b23-4005-b399-82e2ceb327be', -- DEFAULT_USER_ID
  '2025-07-15'
);
```

#### c) Utwórz notatki testowe dla projektu w tabeli `notes`:
```sql
INSERT INTO notes (id, project_id, content, priority, place_tags)
VALUES 
  (
    'note-0001-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Zwiedzić Koloseum',
    3,
    ARRAY['architektura', 'historia']
  ),
  (
    'note-0001-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Odwiedzić Fontannę di Trevi',
    3,
    ARRAY['zabytki', 'turystyka']
  ),
  (
    'note-0001-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Spróbować włoskiej pizzy w lokalnej pizzerii',
    2,
    ARRAY['jedzenie', 'restauracje']
  ),
  (
    'note-0001-0000-0000-000000000004',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Zwiedzić Muzeum Watykańskie',
    3,
    ARRAY['muzea', 'sztuka', 'religia']
  );
```

## Konfiguracja Postmana

### Krok 1: Utwórz nowe żądanie

1. Otwórz Postman
2. Kliknij **New** → **HTTP Request**
3. Nazwij żądanie: `Generate Travel Plan`

### Krok 2: Skonfiguruj podstawowe ustawienia

- **Metoda HTTP**: `POST`
- **URL**: `http://localhost:4321/api/projects/a1b2c3d4-e5f6-7890-abcd-ef1234567890/plan`
  - Zamień `a1b2c3d4-e5f6-7890-abcd-ef1234567890` na UUID twojego testowego projektu

### Krok 3: Nagłówki (Headers)

Dodaj następujący nagłówek:

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

**UWAGA**: Autoryzacja JWT nie jest wymagana na tym etapie. Endpoint używa `DEFAULT_USER_ID` z konfiguracji.

### Krok 4: Body żądania

Wybierz zakładkę **Body** → **raw** → **JSON**

#### Przykład 1: Żądanie z preferencjami (pełne)
```json
{
  "model": "claude-3.5-sonnet",
  "notes": [
    {
      "id": "note-0001-0000-0000-000000000001",
      "content": "Zwiedzić Koloseum",
      "priority": 3,
      "place_tags": ["architektura", "historia"]
    },
    {
      "id": "note-0001-0000-0000-000000000002",
      "content": "Odwiedzić Fontannę di Trevi",
      "priority": 3,
      "place_tags": ["zabytki", "turystyka"]
    },
    {
      "id": "note-0001-0000-0000-000000000003",
      "content": "Spróbować włoskiej pizzy w lokalnej pizzerii",
      "priority": 2,
      "place_tags": ["jedzenie", "restauracje"]
    },
    {
      "id": "note-0001-0000-0000-000000000004",
      "content": "Zwiedzić Muzeum Watykańskie",
      "priority": 3,
      "place_tags": ["muzea", "sztuka", "religia"]
    }
  ],
  "preferences": {
    "categories": ["kultura", "historia", "gastronomia"]
  }
}
```

#### Przykład 2: Żądanie bez preferencji (minimalne)
```json
{
  "model": "gpt-5",
  "notes": [
    {
      "id": "note-0001-0000-0000-000000000001",
      "content": "Zwiedzić Koloseum",
      "priority": 3,
      "place_tags": ["architektura", "historia"]
    },
    {
      "id": "note-0001-0000-0000-000000000002",
      "content": "Odwiedzić Fontannę di Trevi",
      "priority": 2,
      "place_tags": null
    }
  ]
}
```

### Krok 5: Wyślij żądanie

Kliknij przycisk **Send**

## Oczekiwane odpowiedzi

### ✅ Sukces (200 OK)

```json
{
  "schedule": [
    {
      "day": 1,
      "activities": [
        "Zwiedzić Koloseum (architektura, historia)",
        "Odwiedzić Fontannę di Trevi (zabytki, turystyka)",
        "Zwiedzić Muzeum Watykańskie (muzea, sztuka, religia)",
        "Wizyta w kultura - dzień 1",
        "Wizyta w historia - dzień 1",
        "Zameldowanie w hotelu i odpoczynek",
        "Obiad w lokalnej restauracji"
      ]
    },
    {
      "day": 2,
      "activities": [
        "Zwiedzić Koloseum (architektura, historia)",
        "Odwiedzić Fontannę di Trevi (zabytki, turystyka)",
        "Zwiedzić Muzeum Watykańskie (muzea, sztuka, religia)",
        "Wizyta w kultura - dzień 2",
        "Wizyta w historia - dzień 2",
        "Obiad w lokalnej restauracji"
      ]
    },
    ...
  ]
}
```

### ❌ Błąd walidacji (400 Bad Request)

**Przykład: Nieprawidłowy UUID projektu**
```json
{
  "error": "Validation Error",
  "message": "Nieprawidłowe dane wejściowe",
  "details": [
    {
      "code": "invalid_string",
      "message": "Project ID musi być prawidłowym UUID",
      "path": []
    }
  ]
}
```

**Przykład: Nieprawidłowy model AI**
```json
{
  "error": "Validation Error",
  "message": "Nieprawidłowe dane wejściowe",
  "details": [
    {
      "code": "invalid_enum_value",
      "message": "Model musi być jednym z: gpt-4, gpt-5, claude-3-opus, claude-3.5-sonnet",
      "path": ["model"]
    }
  ]
}
```

**Przykład: Brak wymaganych pól**
```json
{
  "error": "Validation Error",
  "message": "Nieprawidłowe dane wejściowe",
  "details": [
    {
      "code": "invalid_type",
      "message": "Required",
      "path": ["notes"]
    }
  ]
}
```

### ❌ Projekt nie znaleziony (404 Not Found)

```json
{
  "error": "API Error",
  "message": "Projekt nie został znaleziony"
}
```

### ❌ Błąd serwera AI (500 Internal Server Error)

```json
{
  "error": "API Error",
  "message": "Błąd podczas generowania planu przez AI service",
  "details": {
    "error": "AI Service Error: Timeout or rate limit exceeded"
  }
}
```

## Scenariusze testowe

### Test 1: Prawidłowe żądanie z preferencjami
- **Oczekiwany wynik**: 200 OK z wygenerowanym planem
- **Sprawdź**: czy plan zawiera aktywności z notatek i kategorii preferencji

### Test 2: Prawidłowe żądanie bez preferencji
- **Oczekiwany wynik**: 200 OK z wygenerowanym planem
- **Sprawdź**: czy plan zawiera podstawowe aktywności (hotel, obiad)

### Test 3: Nieprawidłowy UUID projektu
- **URL**: `http://localhost:4321/api/projects/invalid-uuid/plan`
- **Oczekiwany wynik**: 400 Bad Request

### Test 4: Projekt nie istnieje
- **URL**: `http://localhost:4321/api/projects/00000000-0000-0000-0000-000000000000/plan`
- **Oczekiwany wynik**: 404 Not Found

### Test 5: Nieprawidłowy model AI
- **Body**: `{ "model": "gpt-10", "notes": [...] }`
- **Oczekiwany wynik**: 400 Bad Request

### Test 6: Notatka nie należy do projektu
- **Body**: użyj UUID notatki, która nie istnieje lub należy do innego projektu
- **Oczekiwany wynik**: 400 Bad Request z komunikatem o nieprawidłowej notatce

### Test 7: Symulacja błędu AI (losowo 5% przypadków)
- **Oczekiwany wynik**: Może wystąpić 500 Internal Server Error
- **Sprawdź**: czy wpis w tabeli `ai_logs` ma status `failure`

## Weryfikacja w bazie danych

Po każdym żądaniu sprawdź tabelę `ai_logs`:

```sql
SELECT 
  id,
  project_id,
  status,
  duration_ms,
  prompt,
  response,
  created_on
FROM ai_logs
ORDER BY created_on DESC
LIMIT 5;
```

**Sprawdź**:
- Czy wpis został utworzony
- Czy `status` to `success` lub `failure`
- Czy `duration_ms` jest ustawione
- Czy `response` zawiera wygenerowany plan lub błąd

## Dozwolone modele AI

- `gpt-4`
- `gpt-5`
- `claude-3-opus`
- `claude-3.5-sonnet`

## Priorytety notatek

- `1` - niski priorytet
- `2` - średni priorytet  
- `3` - wysoki priorytet

Notatki z priorytetem >= 2 będą uwzględniane w generowaniu aktywności.

## Troubleshooting

### Problem: Serwer nie odpowiada
- Sprawdź czy serwer działa: `npm run dev`
- Sprawdź port: domyślnie `4321`

### Problem: 404 Not Found (na endpoint)
- Sprawdź czy URL jest poprawny
- Sprawdź czy struktura katalogów API jest prawidłowa

### Problem: 500 Internal Server Error
- Sprawdź logi serwera w konsoli
- Sprawdź czy Supabase działa lokalnie
- Sprawdź czy dane testowe zostały utworzone

### Problem: Timeout
- Mock AI service symuluje opóźnienie 200-1000ms
- Zwiększ timeout w Postmanie (Settings → General → Request timeout)




================================================
FILE: .ai/prd-eng.md
================================================
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



================================================
FILE: .ai/prd.md
================================================
# Dokument wymagań produktu (PRD) - VacationPlanner
## 1. Przegląd produktu
VacationPlanner to aplikacja webowa umożliwiająca użytkownikom zapisywanie i zarządzanie swobodnymi notatkami o planowanych podróżach, grupowanie ich w projekty podróży oraz generowanie szczegółowych planów wycieczek wykorzystujących AI. Użytkownicy definiują priorytet atrakcji i planowaną datę, a system automatycznie tworzy harmonogram dzienny zgodnie z preferencjami.

## 2. Problem użytkownika
Planowanie angażujących i interesujących wycieczek jest czasochłonne, wymaga wiedzy o miejscach i organizacji czasu. Użytkownicy potrzebują narzędzia, które przekształci luźne notatki o miejscach i czasie w gotowe plany uwzględniające priorytety, liczbę osób i preferencje turystyczne.

## 3. Wymagania funkcjonalne
- Rejestracja i logowanie (email/hasło) z weryfikacją mailową, wygasającymi linkami oraz możliwością resetowania hasła
- Strona profilu z zapisem preferencji turystycznych użytkownika
- CRUD projektów podróży z metadanymi: nazwa, przybliżona długość, planowana data
- CRUD notatek w ramach projektu: treść swobodnego tekstu z tagami miejsca (autouzupełnianie API) i czasu (predefiniowana lista), priorytet atrakcji
- Generowanie planu AI w jednym synchronicznym żądaniu, zwrócenie dziennego harmonogramu
- Wyświetlanie spinnera "Trwa generowanie planu..." oraz obsługa błędów z czytelnym komunikatem i opcją "Spróbuj ponownie"
- Logowanie interakcji z AI w osobnej tabeli (prompt, odpowiedź, status, czas wykonania)

## 4. Granice produktu
- Brak udostępniania planów między kontami
- Brak zaawansowanej obsługi multimediów (np. zdjęć)
- Brak rozbudowanego planowania logistyki i czasu
- Brak panelu administratora w MVP
- Retencja logów AI nie jest wymagana
- Brak monitorowania i alertowania awarii usługi AI
- Brak raportu miesięcznego podsumowującego wygenerowane plany w zakładce "Moje raporty"

## 5. Historyjki użytkowników
- ID: US-001
  Tytuł: Rejestracja konta
  Opis: Jako nowy użytkownik chcę zarejestrować konto podając email i hasło, aby uzyskać dostęp do aplikacji
  Kryteria akceptacji:
  - Formularz wymaga poprawnego formatu email i minimalnej długości hasła
  - Po rejestracji wysyłany jest email weryfikacyjny z linkiem wygasającym
  - Konto pozostaje nieaktywne do momentu weryfikacji

- ID: US-002
  Tytuł: Weryfikacja adresu email
  Opis: Jako użytkownik chcę zweryfikować adres email klikając link, aby aktywować konto
  Kryteria akceptacji:
  - Link weryfikacyjny wygasa po określonym czasie
  - Kliknięcie linku zmienia status konta na aktywne
  - W przypadku błędu wyświetlany jest komunikat

- ID: US-003
  Tytuł: Logowanie do aplikacji
  Opis: Jako użytkownik chcę zalogować się email i hasłem, aby korzystać z aplikacji
  Kryteria akceptacji:
  - Poprawne dane logowania przekierowują do dashboardu
  - Nieudane logowanie wyświetla komunikat o błędnych danych

- ID: US-004
  Tytuł: Reset hasła
  Opis: Jako użytkownik chcę zresetować hasło przez email, aby odzyskać dostęp
  Kryteria akceptacji:
  - Użytkownik podaje email powiązany z kontem
  - Wysyłany jest email z linkiem resetu wygasającym po określonym czasie
  - Po zmianie hasła użytkownik może się zalogować nowymi danymi

- ID: US-005
  Tytuł: Zapis preferencji turystycznych
  Opis: Jako użytkownik chcę zdefiniować preferencje turystyczne w profilu, aby AI uwzględniło je przy generowaniu planu
  Kryteria akceptacji:
  - Możliwość wybrania kategorii preferencji (np. plaża, góry)
  - Preferencje są zapisywane i widoczne w profilu

- ID: US-006
  Tytuł: Tworzenie projektu podróży
  Opis: Jako zalogowany użytkownik chcę utworzyć nowy projekt podróży podając nazwę, przybliżoną długość i datę, aby grupować notatki
  Kryteria akceptacji:
  - Formularz wymaga wszystkich pól
  - Nowy projekt pojawia się w głównym menu

- ID: US-007
  Tytuł: Edycja projektu podróży
  Opis: Jako użytkownik chcę edytować metadane projektu, aby zaktualizować informacje
  Kryteria akceptacji:
  - Możliwość aktualizacji nazwy, długości i daty
  - Zmiany są widoczne w widoku projektu

- ID: US-008
  Tytuł: Usuwanie projektu podróży
  Opis: Jako użytkownik chcę usunąć projekt, aby pozbyć się nieaktualnych planów
  Kryteria akceptacji:
  - Wyświetlane jest potwierdzenie usunięcia
  - Projekt zostaje usunięty z listy

- ID: US-009
  Tytuł: Dodawanie notatki
  Opis: Jako użytkownik chcę dodać notatkę w projekcie z tagami miejsca i czasu, priorytetem i datą, aby zbierać inspiracje
  Kryteria akceptacji:
  - Pola tagów korzystają z autouzupełniania i listy wartości
  - Nowa notatka pojawia się w projekcie

- ID: US-010
  Tytuł: Edycja notatki
  Opis: Jako użytkownik chcę edytować istniejącą notatkę, aby poprawić treść lub tagi
  Kryteria akceptacji:
  - Możliwość zmiany treści, tagów, priorytetu i daty
  - Zmiany są zapisywane

- ID: US-011
  Tytuł: Usuwanie notatki
  Opis: Jako użytkownik chcę usunąć notatkę, aby usunąć niepotrzebne informacje
  Kryteria akceptacji:
  - Wyświetlane jest potwierdzenie usunięcia
  - Notatka zostaje usunięta z listy

- ID: US-012
  Tytuł: Przełączanie między projektami
  Opis: Jako użytkownik chcę przełączać się między projektami z głównego menu, aby zarządzać różnymi podróżami
  Kryteria akceptacji:
  - Lista projektów jest dostępna w menu
  - Wybór projektu ładuje odpowiadające notatki

- ID: US-013
  Tytuł: Generowanie planu wycieczki
  Opis: Jako użytkownik chcę wygenerować plan na podstawie notatek projektu, aby otrzymać szczegółowy harmonogram
  Kryteria akceptacji:
  - API AI zwraca harmonogram w czasie ≤60 s
  - UI pokazuje spinner "Trwa generowanie planu..."
  - W przypadku błędu wyświetlany jest komunikat z opcją "Spróbuj ponownie"

## 6. Metryki sukcesu
- 75% użytkowników generuje co najmniej 3 plany rocznie
- 90% użytkowników wypełnia preferencje turystyczne w profilu
- Czas odpowiedzi AI ≤60 sekund
- Monitorowanie i zapis statusów prób generowania planów



================================================
FILE: .ai/PRD_summary.md
================================================
<conversation_summary>

<decisions>
1. Notatki wprowadzane jako swobodny tekst z dwoma typami tagów: „miejsce” (autouzupełnianie przez API) i „przybliżony czas” (predefiniowana lista wartości).  
2. Raporty miesięczne dostępne w zakładce „Moje raporty” w aplikacji.  
3. Model notatki zawiera pola: priorytet atrakcji oraz planowana data wyjazdu (miesiąc/pora roku).  
4. Generowanie planu AI odbywa się synchronicznie w jednym żądaniu; UI wyświetla spinner „Trwa generowanie planu…” i po 1 minucie lub w razie błędu pokazuje powiadomienie z opcją „Spróbuj ponownie”.  
5. Retencja logów AI nie jest wymagana w MVP.  
6. W razie błędu AI użytkownik otrzymuje informację o przyczynie niepowodzenia, bez dodatkowych limitacji prób.  
7. Backend hostowany w Supabase (PostgreSQL) na DigitalOcean; CI/CD przez GitHub Actions.  
8. Brak panelu administratora w MVP.  
9. Autoryzacja: email/hasło z weryfikacją mailową, wygasające linki, możliwość ponownej generacji i resetu hasła.  
10. Tech stack: Astro + React + TypeScript + Tailwind CSS + Shadcn/ui; interfejs w języku angielskim.  
11. Użytkownik może tworzyć wiele „projektów podróży” z metadanymi (przybliżona długość i data), i w ramach każdego projektu dodawać, edytować lub usuwać notatki. Projekty widoczne w głównym menu i przełączalne przed generowaniem planu.
</decisions>

<matched_recommendations>
1. Zdefiniowanie słownika tagów i integracja z API autouzupełniania miejsc.  
2. Dodanie spinnera i obsługa timeout/error z opcją „Spróbuj ponownie”.  
3. Rozbudowa modelu notatki o priorytet i planowaną datę wyjazdu.  
4. Logowanie zapytań i odpowiedzi AI w osobnej tabeli.  
5. Prostota logowania email/hasło z weryfikacją i obsługą resetu.  
6. Wdrożenie HTTPS i przechowywanie sekretów w env vars.  
7. Hostowanie backendu na Supabase + DigitalOcean i CI/CD przez GitHub Actions.  
8. Ograniczenie interfejsu do jednego języka (angielskiego) na start.  
9. Wprowadzenie koncepcji projektów podróży grupujących notatki (nowa rekomendacja wynikająca z doprecyzowania historii).
</matched_recommendations>

<prd_planning_summary>
a. Główne wymagania funkcjonalne:
- Rejestracja i logowanie: email/hasło, weryfikacja mailowa, wygasające linki, reset hasła.  
- Zarządzanie projektami podróży: CRUD projektów z metadanymi (przybliżona długość i data).  
- Zarządzanie notatkami w projekcie: CRUD notatek z tagami miejsca i czasu, priorytetem i datą wyjazdu.  
- Generowanie planu AI: synchroniczne wywołanie uwzględniające wszystkie notatki projektu, zwracające dzienny harmonogram.  
- UI: spinner „Trwa generowanie planu…”, powiadomienia o błędach z opcją „Spróbuj ponownie”.  
- Logowanie AI: osobna tabela przechowująca prompt, odpowiedź, status i czas wykonania.

b. Kluczowe historie użytkownika:
1. Tworzę projekt podróży z przybliżoną długością i datą, by grupować notatki.  
2. Dodaję w projekcie dowolną liczbę notatek (miejsce lub preferencje czasu), by zebrać inspiracje.  
3. Przełączam się między projektami z głównego menu, by edytować lub usuwać notatki.  
4. W widoku projektu przeglądam szczegóły (data, długość, notatki) przed generowaniem.  
5. Generuję plan: system uwzględnia wszystkie notatki projektu i zwraca harmonogram.  
6. Widzę spinner i w razie błędu otrzymuję opis przyczyny z opcją ponowienia.  

c. Kryteria sukcesu i metryki: 
- 75% użytkowników generuje ≥3 plany rocznie.  
- Czas odpowiedzi AI ≤60 s.  
- Zapis i monitorowanie statusów prób generowania planów.

d. Obszary wymagające dalszego doprecyzowania:
- Wybór konkretnego API do autouzupełniania miejsc (koszty, limity).  
- Lista wartości do tagów czasu i sposób prezentacji.  
- Detale harmonogramu generacji i wyzwalania raportów miesięcznych.
</prd_planning_summary>

<unresolved_issues>
- Dokładna lista wartości tagów czasu i ich UI.  
- Mechanizm wysyłki maili weryfikacyjnych i resetu.  
- Monitorowanie i alertowanie awarii usługi AI.  
- Strategia wersjonowania po MVP.
</unresolved_issues>

</conversation_summary>


================================================
FILE: .ai/project-cheatsheet.md
================================================
# Project Cheatsheet - AI-Enhanced Development

A step-by-step guide for building full-stack projects with AI assistance, based on 10xDevs training materials.

---

## Understanding MVP (Minimum Viable Product)

Before diving into implementation, it's crucial to understand what an MVP is and how to define it properly.

### POC vs MVP

**Proof of Concept (POC)** - Minimal implementation demonstrating technical feasibility:
- Focuses on verifying technology and concepts
- Often has limited functionality
- Used internally, not by real users
- Helps in decision-making about further development

**Minimum Viable Product (MVP)** - Smallest version of product that:
- Delivers real value to end users
- Allows testing main business hypotheses
- Enables gathering feedback from real users
- Contains only absolutely necessary features

### How to Define Effective MVP

1. **Identify the core problem** - What main user pain are we solving?
2. **Determine shortest path to value** - What absolute minimum features allow users to feel benefit?
3. **Set precise project boundaries** - What explicitly is NOT in MVP scope?
4. **Define user journeys** - What exact use cases must MVP support?
5. **Define success criteria** - How will we measure if MVP fulfills its purpose?

### Why Precise MVP Definition is Critical for AI Work

1. **Reduces hallucinations** - Limited scope decreases risk that AI will propose solutions disconnected from business needs
2. **Efficient context use** - Language models have limited context; focusing on MVP allows better utilization
3. **Faster validation** - Thoughtful scope means more efficient verification of AI-generated code
4. **Gradual complexity building** - Starting from simple MVP allows iterative feature additions

📖 **Learn more**: See [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md) (lines 108-191)

---

## Phase 0: Choose Your Project

### 1. Select or Analyze Project Idea
Decide which project you'll work on and validate it addresses real problems.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md)

🔧 **Prompts**:
- [Analiza pomysłu na projekt](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=9e0681a5-fa5d-42cf-b764-82f16c7e6792)

### 2. Define MVP
Create high-level MVP concept with: main problem, minimum feature set, out-of-scope items, success criteria.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md)

---

## Phase 1: Project Planning & Setup

### 3. Create PRD (Product Requirements Document)
Conduct planning session with AI and generate PRD defining user stories with acceptance criteria in `project-prd.md`.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md)

🔧 **Prompts**:
- [Asystent planowania PRD](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=002f4b14-aae4-4108-b681-ecbef970ca3f)
- [Podsumowanie sesji planistycznej PRD](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=63d110aa-8f51-40f5-865b-c5f5717fee04)
- [Generowanie kompletnego PRD](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=4ac8b7fe-6c04-4e56-83db-00e5e1d0691d)

### 4. Define Tech Stack
Document chosen technologies and frameworks in `tech-stack.md`.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md)

🔧 **Prompts**:
- [Analiza stacku technologicznego](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=65b2fb71-4130-4be0-a0bf-a7532cff39d2)

### 5. Initialize GitHub Repository
Create GitHub repo, initialize with `git init`, add initial commit with context files.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md)

### 6. Set Up AI Rules
Create `.ai/` folder with rules for shared, frontend, and backend coding standards (`.mdc` files).

📖 **Lesson**: [downloads/[2x2] Przygotowanie reguł dla AI i bootstrap projektu.md](downloads/[2x2]%20Przygotowanie%20reguł%20dla%20AI%20i%20bootstrap%20projektu.md)

💡 **Tool**: Use [10xRules.ai](https://10xrules.ai/) or [cursor.directory](https://cursor.directory/) to generate rules for your tech stack.

### 7. Bootstrap Project
Initialize project structure with chosen framework using official CLI tools (not AI generation from scratch).

📖 **Lesson**: [downloads/[2x2] Przygotowanie reguł dla AI i bootstrap projektu.md](downloads/[2x2]%20Przygotowanie%20reguł%20dla%20AI%20i%20bootstrap%20projektu.md)

### 8. Generate README
Create project README.md based on PRD and tech stack.

📖 **Lesson**: [downloads/[2x2] Przygotowanie reguł dla AI i bootstrap projektu.md](downloads/[2x2]%20Przygotowanie%20reguł%20dla%20AI%20i%20bootstrap%20projektu.md)

🔧 **Prompts**:
- [Generowanie README projektu](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l2-rules-for-ai&prompt=fd5efc36-7aff-4bd5-8e23-83378e8152b7)

---

## Phase 2: Database & Backend

### 9. Database Planning Session
Conduct planning session with AI to define database requirements and structure.

📖 **Lesson**: [downloads/[2x3] Definiowanie bazy danych.md](downloads/[2x3]%20Definiowanie%20bazy%20danych.md)

🔧 **Prompts**:
- [Asystent planowania bazy danych](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l3-database&prompt=bff6925d-bf5e-40b9-94b6-8cd5f721f2ae)
- [Podsumowanie planowania bazy danych](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l3-database&prompt=cd51feb5-5237-427c-ab2c-9e48de2fcadb)

### 10. Define Database Schema
Create `db-plan.md` with AI-generated schema including tables, relations, and RLS policies.

📖 **Lesson**: [downloads/[2x3] Definiowanie bazy danych.md](downloads/[2x3]%20Definiowanie%20bazy%20danych.md)

🔧 **Prompts**:
- [Tworzenie schematu bazy danych](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l3-database&prompt=a0f2515d-fe92-4d59-a387-431b698b8187)

### 11. Create Database Migration
Generate SQL migration files and apply with `supabase db reset`.

📖 **Lesson**: [downloads/[2x3] Definiowanie bazy danych.md](downloads/[2x3]%20Definiowanie%20bazy%20danych.md)

🔧 **Prompts**:
- [Tworzenie migracji Supabase](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l3-database&prompt=405b4de9-27b6-48f8-a4d9-f3a4c70655fb)

### 12. Configure Supabase Client
Set up Supabase client with environment variables and TypeScript types in API layer.

📖 **Lesson**: [downloads/[2x4] Generowanie kontraktów i endpointów Rest API.md](downloads/[2x4]%20Generowanie%20kontraktów%20i%20endpointów%20Rest%20API.md)

### 13. Generate API Contracts
Create `api-plan.md` with DTOs and Command Models based on database schema.

📖 **Lesson**: [downloads/[2x4] Generowanie kontraktów i endpointów Rest API.md](downloads/[2x4]%20Generowanie%20kontraktów%20i%20endpointów%20Rest%20API.md)

🔧 **Prompts**:
- [Tworzenie planu REST API](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l4-api&prompt=b32d5dd1-f1ab-4695-b8d0-a0981df2a1a8)
- [Generowanie typów DTO i Command Models](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l4-api&prompt=6c5a99ac-6036-494a-b5c5-60f6cc305534)

### 14. Plan Endpoint Implementation
Create detailed implementation plan for each key endpoint.

📖 **Lesson**: [downloads/[2x4] Generowanie kontraktów i endpointów Rest API.md](downloads/[2x4]%20Generowanie%20kontraktów%20i%20endpointów%20Rest%20API.md)

🔧 **Prompts**:
- [Plan implementacji endpointa REST API](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l4-api&prompt=7fa09cd6-4760-47c2-aae0-acde3d54740f)

### 15. Implement API Endpoints
Use 3×3 workflow to build endpoints incrementally, test with generated curl commands.

📖 **Lesson**: [downloads/[2x4] Generowanie kontraktów i endpointów Rest API.md](downloads/[2x4]%20Generowanie%20kontraktów%20i%20endpointów%20Rest%20API.md)

🔧 **Prompts**:
- [Implementacja endpointu (workflow 3×3)](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l4-api&prompt=d20e7b05-7964-4c1b-8d36-ffebffd9b970)

---

## Phase 3: Frontend

### 16. Initialize Component Library
Set up shadcn/ui (or alternative) and configure Tailwind CSS.

📖 **Lesson**: [downloads/[2x5] Generowanie interfejsu użytkownika.md](downloads/[2x5]%20Generowanie%20interfejsu%20użytkownika.md)

### 17. UI Planning Session
Conduct planning session to define UI architecture and component structure.

📖 **Lesson**: [downloads/[2x5] Generowanie interfejsu użytkownika.md](downloads/[2x5]%20Generowanie%20interfejsu%20użytkownika.md)

🔧 **Prompts**:
- [Asystent planowania architektury UI](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l5-ui&prompt=c7bfd30d-e413-41b7-85ee-026b092514bb)
- [Podsumowanie sesji planowania architektury UI](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l5-ui&prompt=e4457a5f-2c9c-4828-97f2-81a67f920fa3)

### 18. Generate High-Level UI Plan
Create `ui-plan.md` with views, component structure, and navigation.

📖 **Lesson**: [downloads/[2x5] Generowanie interfejsu użytkownika.md](downloads/[2x5]%20Generowanie%20interfejsu%20użytkownika.md)

🔧 **Prompts**:
- [Generowanie wysokopoziomowego planu UI](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l5-ui&prompt=c0f17d5a-0dc2-40da-b129-f69e838343c4)

### 19. Plan View Implementation
Create detailed implementation plans for each key view/screen.

📖 **Lesson**: [downloads/[2x5] Generowanie interfejsu użytkownika.md](downloads/[2x5]%20Generowanie%20interfejsu%20użytkownika.md)

🔧 **Prompts**:
- [Szczegółowy plan implementacji widoku](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l5-ui&prompt=629e6ff0-3fac-44d2-abc1-aa90c161a845)

### 20. Implement Views
Build UI incrementally with 3×3 workflow using Tailwind and components.

📖 **Lesson**: [downloads/[2x5] Generowanie interfejsu użytkownika.md](downloads/[2x5]%20Generowanie%20interfejsu%20użytkownika.md)

🔧 **Prompts**:
- [Implementacja widoku](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l5-ui&prompt=60599924-a4e8-482f-b882-fbae38a77817)

---

## Phase 4: Business Logic with LLM

### 21. Configure OpenRouter
Create account, set credit limits ($1 recommended), add API key to `.env`.

📖 **Lesson**: [downloads/[2x6] Implementacja logiki biznesowej opartej o LLM.md](downloads/[2x6]%20Implementacja%20logiki%20biznesowej%20opartej%20o%20LLM.md)

### 22. Plan OpenRouter Service
Generate implementation plan for OpenRouter service integration.

📖 **Lesson**: [downloads/[2x6] Implementacja logiki biznesowej opartej o LLM.md](downloads/[2x6]%20Implementacja%20logiki%20biznesowej%20opartej%20o%20LLM.md)

🔧 **Prompts**:
- [Generowanie planu implementacji serwisu OpenRouter](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l6-business-logic&prompt=925e891f-7a5a-41aa-bafd-981616a29d1e)

### 23. Implement LLM Service
Create service layer for AI API calls with proper error handling using 3×3 workflow.

📖 **Lesson**: [downloads/[2x6] Implementacja logiki biznesowej opartej o LLM.md](downloads/[2x6]%20Implementacja%20logiki%20biznesowej%20opartej%20o%20LLM.md)

🔧 **Prompts**:
- [Implementacja serwisu OpenRouter](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l6-business-logic&prompt=6262a006-1df9-466a-be44-d8bffa691153)

### 24. Integrate LLM into App
Connect service layer to business logic endpoints and UI.

📖 **Lesson**: [downloads/[2x6] Implementacja logiki biznesowej opartej o LLM.md](downloads/[2x6]%20Implementacja%20logiki%20biznesowej%20opartej%20o%20LLM.md)

---

## Phase 5: Authentication

### 25. Update PRD with Auth Requirements
Add authentication user stories to your product requirements.

📖 **Lesson**: [downloads/[3x1] Implementacja uwierzytelniania z Supabase Auth.md](downloads/[3x1]%20Implementacja%20uwierzytelniania%20z%20Supabase%20Auth.md)

### 26. Plan Authentication Architecture
Generate `auth-spec.md` with Mermaid diagrams showing auth flow and integration.

📖 **Lesson**: [downloads/[3x1] Implementacja uwierzytelniania z Supabase Auth.md](downloads/[3x1]%20Implementacja%20uwierzytelniania%20z%20Supabase%20Auth.md)

🔧 **Prompts**:
- [Specyfikacja Architektury Autentykacji](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l1-auth&prompt=dab016a1-30c3-4312-a764-56e59f847354)
- [Walidacja Specyfikacji Autentykacji](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l1-auth&prompt=8e8dac09-a2c3-4801-8f20-243cdcadd2fb)
- [Diagram Przepływu Autentykacji](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l1-auth&prompt=95da7239-3fed-4511-907d-cf5b3c026105)

### 27. Implement Login UI
Create login forms and pages with proper validation and error handling.

📖 **Lesson**: [downloads/[3x1] Implementacja uwierzytelniania z Supabase Auth.md](downloads/[3x1]%20Implementacja%20uwierzytelniania%20z%20Supabase%20Auth.md)

🔧 **Prompts**:
- [Implementacja UI Autentykacji](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l1-auth&prompt=f26a2606-2eaa-4400-93d7-e1ff6d92d171)

### 28. Implement Login Backend
Create server-side endpoints and Supabase Auth integration for login.

📖 **Lesson**: [downloads/[3x1] Implementacja uwierzytelniania z Supabase Auth.md](downloads/[3x1]%20Implementacja%20uwierzytelniania%20z%20Supabase%20Auth.md)

🔧 **Prompts**:
- [Planowanie Integracji Backendu Logowania](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l1-auth&prompt=1b538016-8e16-44a2-8ab1-c8b9a8ea75a2)

### 29. Implement Logout
Add logout functionality to layout and handle session cleanup.

📖 **Lesson**: [downloads/[3x1] Implementacja uwierzytelniania z Supabase Auth.md](downloads/[3x1]%20Implementacja%20uwierzytelniania%20z%20Supabase%20Auth.md)

🔧 **Prompts**:
- [Implementacja Funkcjonalności Wylogowania](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l1-auth&prompt=cb281a1b-295f-4f3b-8aea-3510669b3191)

### 30. Protect Routes
Configure route protection based on authentication state.

📖 **Lesson**: [downloads/[3x1] Implementacja uwierzytelniania z Supabase Auth.md](downloads/[3x1]%20Implementacja%20uwierzytelniania%20z%20Supabase%20Auth.md)

🔧 **Prompts**:
- [Implementacja Ochrony Routingu](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l1-auth&prompt=ea627ec0-2f1c-444f-b2e2-66c14d1a7196)

### 31. Implement Registration (Optional)
Create registration forms and server-side endpoints with email confirmation.

📖 **Lesson**: [downloads/[3x1] Implementacja uwierzytelniania z Supabase Auth.md](downloads/[3x1]%20Implementacja%20uwierzytelniania%20z%20Supabase%20Auth.md)

🔧 **Prompts**:
- [Implementacja Backendu Rejestracji](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l1-auth&prompt=bbcf6060-3ab7-4010-8904-5c666de7845a)

---

## Phase 6: Testing

### 32. Create Test Plan
Use AI with full codebase context (GitIngest + Google AI Studio) to generate comprehensive `test-plan.md`.

📖 **Lesson**: [downloads/[3x2] Test Plan i testy jednostkowe z Vitest.md](downloads/[3x2]%20Test%20Plan%20i%20testy%20jednostkowe%20z%20Vitest.md)

💡 **Tools**:
- [GitIngest](https://gitingest.com/) to extract codebase
- [Google AI Studio](https://aistudio.google.com/) for large context analysis

### 33. Configure Unit Tests
Set up Vitest and write unit tests for testable components.

📖 **Lesson**: [downloads/[3x2] Test Plan i testy jednostkowe z Vitest.md](downloads/[3x2]%20Test%20Plan%20i%20testy%20jednostkowe%20z%20Vitest.md)

🔧 **Prompts**:
- [Wizualizacja Struktury Komponentów](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l2-unit-tests&prompt=59982e4c-9f0b-4362-b0b5-b75f53ecbc88)
- [Analiza Kandydatów do Testów Jednostkowych](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l2-unit-tests&prompt=1670ae8e-b0b8-4a99-a7e2-e8a858aa2d1f)
- [Implementacja Testów Jednostkowych](https://10xrules.ai/prompts?org=10xdevs&collection=m3-prod&segment=l2-unit-tests&prompt=97661e33-554f-42b1-ba32-864577095519)

### 34. Set Up E2E Testing Environment
Create cloud Supabase project for testing and apply migrations.

📖 **Lesson**: [downloads/[3x3] Testy E2E z Playwright.md](downloads/[3x3]%20Testy%20E2E%20z%20Playwright.md)

### 35. Implement E2E Tests
Add `data-testid` selectors, create Page Object Models, implement test scenarios with Playwright.

📖 **Lesson**: [downloads/[3x3] Testy E2E z Playwright.md](downloads/[3x3]%20Testy%20E2E%20z%20Playwright.md)

---

## Phase 7: Refactoring & Quality

### 36. Analyze Code Complexity
Use AI to identify refactoring candidates and quality improvements ("AI Detective").

📖 **Lesson**: [downloads/[3x4] Refaktoryzacja projektu z AI.md](downloads/[3x4]%20Refaktoryzacja%20projektu%20z%20AI.md)

### 37. Refactor Components
Separate concerns (validation, state, UI) and implement responsive design.

📖 **Lesson**: [downloads/[3x4] Refaktoryzacja projektu z AI.md](downloads/[3x4]%20Refaktoryzacja%20projektu%20z%20AI.md)

### 38. Implement RLS Security (Optional)
Add Row Level Security policies to database for data protection.

📖 **Lesson**: [downloads/[3x4] Refaktoryzacja projektu z AI.md](downloads/[3x4]%20Refaktoryzacja%20projektu%20z%20AI.md)

---

## Phase 8: CI/CD & Deployment

### 39. Create Pull Request Workflow
Set up `.github/workflows/pull-request.yml` to run lint, unit tests, and optionally E2E tests.

📖 **Lesson**: [downloads/[3x5] Wdrażanie CI_CD z GitHub Actions.md](downloads/[3x5]%20Wdrażanie%20CI_CD%20z%20GitHub%20Actions.md)

### 40. Configure Master Branch Protection
Add quality gates and workflows for master branch deployments.

📖 **Lesson**: [downloads/[3x6] Wdrożenie na produkcję.md](downloads/[3x6]%20Wdrożenie%20na%20produkcję.md)

### 41. Analyze Hosting Options
Choose deployment platform based on tech stack (Cloudflare Pages for Astro, Docker for others).

📖 **Lesson**: [downloads/[3x6] Wdrożenie na produkcję.md](downloads/[3x6]%20Wdrożenie%20na%20produkcję.md)

### 42. Configure Production Environment
Set up environment variables, secrets, and deployment workflow in `.github/workflows/master.yml`.

📖 **Lesson**: [downloads/[3x6] Wdrożenie na produkcję.md](downloads/[3x6]%20Wdrożenie%20na%20produkcję.md)

### 43. Deploy to Production
Publish app to production platform and optionally implement feature flags for safe releases.

📖 **Lesson**: [downloads/[3x6] Wdrożenie na produkcję.md](downloads/[3x6]%20Wdrożenie%20na%20produkcję.md)

---

## Key Workflows & Patterns

### 3×3 Implementation Pattern
**Core workflow**: Implement 3 steps → report progress & next 3 steps → get feedback/review → implement next 3 steps. Repeat until complete.

This pattern provides the sweet spot between agent autonomy and developer control.

### Essential Files by Phase
- **Planning**: `.ai/prd.md`, `.ai/tech-stack.md`
- **AI Rules**: `.ai/shared.mdc`, `.ai/frontend.mdc`, `.ai/backend.mdc`
- **Database**: `.ai/db-plan.md`, `supabase/migrations/*.sql`
- **Backend**: `.ai/api-plan.md`, `src/types.ts` (DTOs), API endpoints
- **Frontend**: `.ai/ui-plan.md`, view implementation plans
- **Business Logic**: `.ai/openrouter-service-implementation-plan.md`
- **Auth**: `.ai/auth-spec.md`, Mermaid diagrams
- **Testing**: `.ai/test-plan.md`, `*.test.ts`, `tests/*.spec.ts`
- **CI/CD**: `.github/workflows/*.yml`

### Standard 4-Step Process (Database/API/UI)
Each layer follows this workflow:
1. **Planning session** - Conduct Q&A with AI, gather recommendations
2. **High-level plan** - Generate comprehensive plan document
3. **Detailed implementation plan** - Create step-by-step implementation guide (for API/UI)
4. **Implementation** - Execute using 3×3 workflow

---

## AI Collaboration Best Practices

### From Week 1 Lessons

- **Choose appropriate models** - Use reasoning models for planning, fast models for coding. See: [downloads/[1x1] Wybór modelu do programowania wspomaganego AI.md](downloads/[1x1]%20Wybór%20modelu%20do%20programowania%20wspomaganego%20AI.md)

- **Use context symbols effectively** - Master @file, #symbol references in your IDE. See: [downloads/[1x2] Współpraca z AI w IDE.md](downloads/[1x2]%20Współpraca%20z%20AI%20w%20IDE.md)

- **Leverage terminal AI** - Use CLI tools for AI-assisted workflows. See: [downloads/[1x3] Współpraca z AI w terminalu.md](downloads/[1x3]%20Współpraca%20z%20AI%20w%20terminalu.md)

- **Delegate to agents** - Let AI agents handle multi-step tasks autonomously. See: [downloads/[1x4] Współpraca z Agentem AI.md](downloads/[1x4]%20Współpraca%20z%20Agentem%20AI.md)

- **Provide clear context** - Break complex tasks into smaller, manageable steps. See: [downloads/[1x5] Efektywna praca z AI - część 1.md](downloads/[1x5]%20Efektywna%20praca%20z%20AI%20-%20część%201.md) & [downloads/[1x6] Efektywna praca z AI - część 2.md](downloads/[1x6]%20Efektywna%20praca%20z%20AI%20-%20część%202.md)

- **Focus on architecture** - Think strategy, let AI handle implementation details. See: [downloads/[1x7] Mindset 10xDeva.md](downloads/[1x7]%20Mindset%2010xDeva.md)

---

## Additional Resources

### Tools Mentioned in Lessons
- **[10xRules.ai](https://10xrules.ai/)** - Generate AI rules and access prompt library
- **[Bolt.new](https://bolt.new/)** - Rapid POC prototyping
- **[GitIngest](https://gitingest.com/)** - Extract full codebase for AI context
- **[Google AI Studio](https://aistudio.google.com/)** - Large context window analysis
- **[Cursor Directory](https://cursor.directory/)** - Community AI rules

### Recommended Tech Stack (from course)
- **Frontend**: Astro 5 + React 19 + TypeScript 5 + Tailwind 4 + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + BaaS SDK)
- **AI Integration**: OpenRouter.ai
- **Testing**: Vitest (unit) + Playwright (E2E)
- **CI/CD**: GitHub Actions
- **Hosting**: Cloudflare Pages or Docker

---

## Quick Reference: Project Checklist

Use this minimal checklist to track your progress:

- [ ] Phase 0: Choose project & define MVP
- [ ] Phase 1: PRD, tech stack, AI rules, bootstrap, README
- [ ] Phase 2: Database schema, migrations, API contracts, endpoints
- [ ] Phase 3: Component library, UI plan, views
- [ ] Phase 4: LLM service integration (optional)
- [ ] Phase 5: Authentication (login, registration, route protection)
- [ ] Phase 6: Test plan, unit tests, E2E tests
- [ ] Phase 7: Code refactoring, RLS security
- [ ] Phase 8: CI/CD workflows, production deployment

---

**Note**: This cheatsheet is based on the 10xDevs course materials. Each phase builds upon the previous one, and the quality of early planning work (especially MVP definition and PRD) significantly impacts the success of later implementation phases.



================================================
FILE: .ai/project-creation-tests.md
================================================
# API Tests for POST /api/projects

This file contains curl commands for testing the POST `/api/projects` endpoint. These commands can be imported into Postman or executed directly from the command line.

## Setup

Replace the following placeholder before running the tests:
- `{{BASE_URL}}` - Your API base URL (e.g., `http://localhost:4321` or `https://your-domain.com`)

**Note:** Authentication is currently using `DEFAULT_USER_ID` from the codebase. JWT authentication will be implemented later.

## Test Cases

### 1. Successful Project Creation (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trip to Paris",
    "duration_days": 5,
    "planned_date": "2026-03-15"
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid",
  "name": "Trip to Paris",
  "duration_days": 5,
  "planned_date": "2026-03-15"
}
```

---

### 2. Successful Project Creation Without Planned Date (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekend Getaway",
    "duration_days": 3
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid",
  "name": "Weekend Getaway",
  "duration_days": 3,
  "planned_date": null
}
```

---

### 3. Invalid JSON Format (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d 'this is not valid json'
```

**Expected Response (400):**
```json
{
  "error": "API Error",
  "message": "Invalid JSON format in request body"
}
```

---

### 4. Empty Project Name (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "duration_days": 5
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Name cannot be empty",
      "path": ["name"]
    }
  ]
}
```

---

### 5. Missing Name Field (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "duration_days": 5
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

---

### 6. Invalid Duration (Less Than 1) (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Duration Trip",
    "duration_days": 0
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Duration must be at least 1",
      "path": ["duration_days"]
    }
  ]
}
```

---

### 7. Invalid Duration (Non-Integer) (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Decimal Duration Trip",
    "duration_days": 5.5
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "integer",
      "received": "float",
      "path": ["duration_days"],
      "message": "Expected integer, received float"
    }
  ]
}
```

---

### 8. Invalid Date Format (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Date Trip",
    "duration_days": 5,
    "planned_date": "15-03-2026"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "validation": "regex",
      "code": "invalid_string",
      "message": "Invalid date format (YYYY-MM-DD)",
      "path": ["planned_date"]
    }
  ]
}
```

---

### 9. Missing Duration Days (400 Bad Request)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Missing Duration Trip"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "undefined",
      "path": ["duration_days"],
      "message": "Required"
    }
  ]
}
```

---

### 10. Null Planned Date (201 Created)

```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trip with Null Date",
    "duration_days": 7,
    "planned_date": null
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid",
  "name": "Trip with Null Date",
  "duration_days": 7,
  "planned_date": null
}
```

---

## Postman Import Instructions

To import these tests into Postman:

1. Open Postman
2. Create a new Collection named "VacationPlanner API"
3. Add environment variable:
   - `BASE_URL`: Your API base URL (e.g., `http://localhost:4321`)
4. For each test case above:
   - Click "Add Request"
   - Set the method to POST
   - Enter the URL: `{{BASE_URL}}/api/projects`
   - Add headers as specified
   - Paste the JSON body in the Body tab (select "raw" and "JSON")
   - Name the request according to the test case
5. Run the entire collection or individual requests to verify the endpoint

## Notes

- All successful requests return status code 201 (Created)
- All validation errors return status code 400 (Bad Request)
- Database errors would return status code 500 (Internal Server Error)
- The `id` field in successful responses will be a valid UUID generated by the database
- Authentication is currently using `DEFAULT_USER_ID` - JWT authentication will be implemented later




================================================
FILE: .ai/projects-list-view-implementation-plan.md
================================================
# View Implementation Plan: Projects List

## 1. Overview
This document outlines the implementation plan for the Projects List view. The primary purpose of this view is to allow users to see a paginated list of their travel projects, and to perform Create, Read, Update, and Delete (CRUD) operations on them. The view will feature a main list display, a button to initiate project creation, and modals for creating/editing and confirming deletion of a project.

## 2. View Routing
The Projects List view will be accessible at the following application path:
- **Path**: `/projects`

This will be an Astro page (`src/pages/projects/index.astro`) that mounts a client-side rendered React component to handle the dynamic functionality.

## 3. Component Structure
The view will be composed of several React components, organized in a hierarchical structure. We will leverage `shadcn/ui` for base components like buttons, modals, and inputs.

```
/projects (src/pages/projects/index.astro)
└── ProjectsPage.tsx (React Client Component)
    ├── Header (with "New Project" Button)
    ├── ProjectsList
    │   ├── ProjectListItem (mapped from project data)
    │   │   ├── Project Details (Name, Duration, Date)
    │   │   ├── Edit Button
    │   │   └── Delete Button
    │   └── EmptyStateView (shown if no projects exist)
    ├── PaginationControls
    ├── ProjectFormModal (Dialog for Create/Edit)
    │   └── Form (with inputs for name, duration, date)
    └── DeleteConfirmationDialog (AlertDialog for Delete)
```

## 4. Component Details

### `ProjectsPage` (Container)
- **Component description**: The main client-side entry point that orchestrates the entire view. It manages application state, API calls, and controls the visibility and data for modals.
- **Main elements**: Renders `ProjectsList`, `PaginationControls`, and the "New Project" button. It also conditionally renders `ProjectFormModal` and `DeleteConfirmationDialog`.
- **Handled interactions**:
  - Clicking "New Project" button to open the creation modal.
  - Clicking "Edit" on a `ProjectListItem` to open the edit modal.
  - Clicking "Delete" on a `ProjectListItem` to open the confirmation dialog.
  - Handling page changes from `PaginationControls`.
- **Types**: `ProjectsListResponseDto`, `ProjectDto`, `PaginationMetaDto`, `ModalState`.
- **Props**: None.

### `ProjectsList`
- **Component description**: A presentational component that renders the list of projects or an empty state message.
- **Main elements**: A `<ul>` or `<div>` that maps over the project data to render `ProjectListItem` components. If the data array is empty, it renders the `EmptyStateView`.
- **Handled interactions**: Bubbles up `onEdit` and `onDelete` events from `ProjectListItem` to the `ProjectsPage` parent.
- **Types**: `ProjectDto[]`.
- **Props**:
  - `projects: ProjectDto[]`
  - `onEdit: (project: ProjectDto) => void`
  - `onDelete: (project: ProjectDto) => void`

### `ProjectFormModal`
- **Component description**: A modal dialog for creating or editing a project. It contains a form with input fields and validation.
- **Main elements**: `Dialog` (shadcn), `form`, `Input` for name and duration, `DatePicker` for planned date, `Button` for Save/Cancel.
- **Handled interactions**:
  - Form submission.
  - Input field changes.
  - Closing the modal via Cancel button or overlay click.
- **Handled validation**:
  - `name`: required, must not be empty.
  - `duration_days`: required, must be an integer greater than or equal to 1.
  - `planned_date`: optional, must be a valid date if provided.
- **Types**: `ProjectFormViewModel`, `CreateProjectCommand`, `UpdateProjectCommand`, `ProjectDto`.
- **Props**:
  - `isOpen: boolean`
  - `mode: 'create' | 'edit'`
  - `initialData?: ProjectDto`
  - `onSubmit: (formData: ProjectFormViewModel) => void`
  - `onClose: () => void`

### `DeleteConfirmationDialog`
- **Component description**: A simple modal to confirm that the user wants to delete a project, preventing accidental deletion.
- **Main elements**: `AlertDialog` (shadcn), text displaying the name of the project to be deleted, "Confirm" and "Cancel" buttons.
- **Handled interactions**:
  - Clicking "Confirm" to trigger the delete action.
  - Clicking "Cancel" to close the dialog.
- **Types**: `ProjectDto`.
- **Props**:
  - `isOpen: boolean`
  - `project: ProjectDto | null`
  - `onConfirm: () => void`
  - `onCancel: () => void`

### `PaginationControls`
- **Component description**: Renders pagination buttons and displays the current page information.
- **Main elements**: "Previous" and "Next" buttons, text indicating `Page X of Y`.
- **Handled interactions**: Clicking "Previous" or "Next" to change the current page.
- **Types**: `PaginationMetaDto`.
- **Props**:
  - `meta: PaginationMetaDto`
  - `onPageChange: (newPage: number) => void`

## 5. Types
The implementation will use existing DTOs for API communication and introduce new ViewModels for managing component state.

- **`ProjectDto`** (API): `{ id, name, duration_days, planned_date }`
- **`ProjectsListResponseDto`** (API): `{ data: ProjectDto[]; meta: PaginationMetaDto }`
- **`CreateProjectCommand`** (API): `{ name, duration_days, planned_date? }`
- **`UpdateProjectCommand`** (API): `{ name?, duration_days?, planned_date? }`

- **`ProjectFormViewModel`** (New ViewModel): Represents the state of the project creation/edit form.
  ```typescript
  interface ProjectFormViewModel {
    name: string;
    duration_days: string; // Use string for input flexibility, parse on submit
    planned_date: Date | null; // Use Date object for date picker components
  }
  ```

- **`ModalState`** (New ViewModel): A discriminated union to manage the state of all modals in the view, ensuring type safety.
  ```typescript
  type ModalState =
    | { type: 'closed' }
    | { type: 'create_project' }
    | { type: 'edit_project'; project: ProjectDto }
    | { type: 'delete_project'; project: ProjectDto };
  ```

## 6. State Management
We will use **TanStack Query (`@tanstack/react-query`)** for server state management. This is ideal for handling data fetching, caching, and mutations (create, update, delete) declaratively.

- **`useQuery`**: Will be used to fetch the paginated list of projects. The query key will include the page number and other filters, e.g., `['projects', { page: 1, size: 10 }]`.
- **`useMutation`**: Separate mutations will be defined for `createProject`, `updateProject`, and `deleteProject`.
- **Callbacks**: The `onSuccess` callbacks for mutations will be used to invalidate the `['projects']` query key, automatically triggering a refetch of the project list to display the latest data.
- **Local State**: Standard React `useState` will be used for managing UI state, such as the current page number and the `ModalState`.

A custom hook, `useProjectsPage`, will encapsulate all this logic to keep the `ProjectsPage` component clean.

## 7. API Integration
The view will interact with the `/api/projects` endpoints. All communication will be handled via `fetch` or a lightweight wrapper like `axios`.

- **`GET /api/projects?page={page}&size={size}`**:
  - **Action**: Fetch the list of projects for the current page.
  - **Response Type**: `ProjectsListResponseDto`.
- **`POST /api/projects`**:
  - **Action**: Create a new project.
  - **Request Type**: `CreateProjectCommand`. The `ProjectFormViewModel` will be transformed into this type before sending.
  - **Response Type**: `ProjectDto`.
- **`PATCH /api/projects/{projectId}`**:
  - **Action**: Update an existing project.
  - **Request Type**: `UpdateProjectCommand`.
  - **Response Type**: `ProjectDto`.
- **`DELETE /api/projects/{projectId}`**:
  - **Action**: Delete a project.
  - **Response Type**: `204 No Content`.

## 8. User Interactions
- **View Projects**: On page load, the first page of projects is fetched and displayed.
- **Navigate Pages**: User clicks "Next" or "Previous" on `PaginationControls`. The `onPageChange` event updates the page number in state, triggering a new API call via TanStack Query.
- **Create Project**:
  1. User clicks the "New Project" button.
  2. The `ProjectFormModal` opens in 'create' mode with an empty form.
  3. User fills the form and clicks "Save".
  4. The `onSubmit` handler triggers the `createProject` mutation. On success, the modal closes and the project list is refreshed.
- **Edit Project**:
  1. User clicks the "Edit" button on a `ProjectListItem`.
  2. The `ProjectFormModal` opens in 'edit' mode, pre-filled with that project's data.
  3. User modifies the form and clicks "Save".
  4. The `onSubmit` handler triggers the `updateProject` mutation. On success, the modal closes and the list is refreshed.
- **Delete Project**:
  1. User clicks the "Delete" button on a `ProjectListItem`.
  2. The `DeleteConfirmationDialog` opens, showing the project name.
  3. User clicks "Confirm".
  4. The `onConfirm` handler triggers the `deleteProject` mutation. On success, the dialog closes and the list is refreshed.

## 9. Conditions and Validation
- **Form Validation**: Performed client-side in the `ProjectFormModal` before submission.
  - An error message is displayed below the respective input field if validation fails (e.g., "Name is required", "Duration must be at least 1").
  - The "Save" button may be disabled until the form is valid.
- **API Conditions**: The frontend must adhere to the API contract.
  - `name`: Must be a non-empty string.
  - `duration_days`: Must be a positive integer.
  - `planned_date`: Must be a string in `YYYY-MM-DD` format or null. The `Date` object from the view model will be formatted correctly before the API call.
- **UI State**:
  - The "Previous" pagination button is disabled on page 1.
  - The "Next" pagination button is disabled on the last page.
  - A loading state (skeleton UI) is shown while the project list is being fetched.
  - A loading indicator is shown on the "Save" button in the modal while a create/update mutation is in progress.

## 10. Error Handling
- **Data Fetching Errors**: If the initial `GET /api/projects` call fails, a full-page error message will be displayed with a "Retry" button. TanStack Query's `isError` and `error` properties will be used to detect this.
- **Mutation Errors**: If a `create`, `update`, or `delete` operation fails:
  - A toast notification (using `sonner` from `shadcn/ui`) will appear with a descriptive error message (e.g., "Failed to create project. Please try again.").
  - The modal will remain open so the user can correct any issues without losing their input.
- **Validation Errors**: If the API returns a 400 Bad Request due to validation failure, the error message should be displayed to the user, ideally next to the relevant form field if possible, or in a general error message area within the modal.

## 11. Implementation Steps
1.  **Setup**: Create the Astro page file `src/pages/projects/index.astro`. Install `@tanstack/react-query` and any required `shadcn/ui` components (`dialog`, `button`, `input`, `sonner`, `alert-dialog`).
2.  **Component Scaffolding**: Create placeholder files for all the React components listed in the structure (`ProjectsPage.tsx`, `ProjectsList.tsx`, etc.).
3.  **Type Definitions**: Add the new `ProjectFormViewModel` and `ModalState` types to a relevant types file (e.g., `src/types.ts` or a new view-specific file).
4.  **API Layer**: Create functions for each API call (`fetchProjects`, `createProject`, etc.). These will be simple wrappers around `fetch`.
5.  **`ProjectsPage` Implementation**:
    - Set up the TanStack Query provider.
    - Implement the `useProjectsPage` custom hook to manage state (`page`, `modalState`) and API calls (`useQuery` for fetching, `useMutation` for CUD operations).
    - Wire up the main component to render children and handle events.
6.  **`ProjectsList` & `ProjectListItem`**: Build the components to display project data. Connect the Edit/Delete buttons to the event handlers passed down from `ProjectsPage`. Add an empty state.
7.  **`PaginationControls`**: Implement the pagination component and connect it to the page state.
8.  **`ProjectFormModal`**:
    - Build the form using `shadcn/ui` components.
    - Implement form state management (e.g., with `react-hook-form` or simple `useState`).
    - Add client-side validation logic.
    - Connect the `onSubmit` to the mutation hook.
9.  **`DeleteConfirmationDialog`**: Implement the simple confirmation dialog.
10. **Styling and UX**: Apply Tailwind CSS for styling. Ensure loading states, disabled states, and error messages are clearly communicated to the user.
11. **Testing**: Manually test all user stories: create, edit, delete, pagination, empty state, and error handling.



================================================
FILE: .ai/QUICKSTART.md
================================================
# 🚀 Quick Start - Testowanie endpointa generowania planu

## Krok 0: Konfiguracja .env (WAŻNE - tylko raz!)

Jeśli nie masz pliku `.env`, utwórz go:

```bash
# 1. Uruchom Supabase lokalnie
npx supabase start

# 2. Pobierz dane dostępowe
npx supabase status

# 3. Utwórz plik .env w głównym katalogu projektu z wartościami:
```

Zawartość `.env`:
```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_KEY=<skopiuj "Publishable key" z supabase status>
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

**Przykład:**
```
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

## Krok 1: Uruchom środowisko (2 minuty)

```bash
# Terminal 1: Uruchom serwer deweloperski
npm run dev

# Terminal 2: Uruchom Supabase lokalnie (jeśli nie działa)
npx supabase start
```

**WAŻNE:** Jeśli zmieniłeś `.env`, **zrestartuj serwer deweloperski** (Ctrl+C i ponownie `npm run dev`)

## Krok 2: Załaduj dane testowe (1 minuta)

Skopiuj i wklej poniższy SQL do **Supabase Studio** (http://localhost:54323):

```sql
-- Projekt testowy
INSERT INTO travel_projects (id, name, duration_days, user_id, planned_date)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Wakacje w Rzymie',
  5,
  '1ec40836-4b23-4005-b399-82e2ceb327be',
  '2025-07-15'
) ON CONFLICT (id) DO NOTHING;

-- Notatki testowe
INSERT INTO notes (id, project_id, content, priority, place_tags)
VALUES 
  ('note-0001-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 
   'Zwiedzić Koloseum', 3, ARRAY['architektura', 'historia']),
  ('note-0001-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Odwiedzić Fontannę di Trevi', 3, ARRAY['zabytki']),
  ('note-0001-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Spróbować włoskiej pizzy', 2, ARRAY['jedzenie'])
ON CONFLICT (id) DO NOTHING;
```

## Krok 3: Test w Postmanie (1 minuta)

### Konfiguracja:
- **Metoda:** `POST`
- **URL:** `http://localhost:4321/api/projects/a1b2c3d4-e5f6-7890-abcd-ef1234567890/plan`
- **Headers:**
  ```
  Content-Type: application/json
  ```

### Body (skopiuj i wklej):

```json
{
  "model": "claude-3.5-sonnet",
  "notes": [
    {
      "id": "note-0001-0000-0000-000000000001",
      "content": "Zwiedzić Koloseum",
      "priority": 3,
      "place_tags": ["architektura", "historia"]
    },
    {
      "id": "note-0001-0000-0000-000000000002",
      "content": "Odwiedzić Fontannę di Trevi",
      "priority": 3,
      "place_tags": ["zabytki"]
    },
    {
      "id": "note-0001-0000-0000-000000000003",
      "content": "Spróbować włoskiej pizzy",
      "priority": 2,
      "place_tags": ["jedzenie"]
    }
  ],
  "preferences": {
    "categories": ["kultura", "gastronomia"]
  }
}
```

### Kliknij **Send** ▶️

## ✅ Oczekiwany wynik:

**Status:** `200 OK`

**Response:**
```json
{
  "schedule": [
    {
      "day": 1,
      "activities": [
        "Zwiedzić Koloseum (architektura, historia)",
        "Odwiedzić Fontannę di Trevi (zabytki)",
        "Spróbować włoskiej pizzy (jedzenie)",
        "Wizyta w kultura - dzień 1",
        "Wizyta w gastronomia - dzień 1"
      ]
    },
    {
      "day": 2,
      "activities": [...]
    }
  ]
}
```

## 🔍 Weryfikacja w bazie danych:

Sprawdź w Supabase Studio, że wpis został dodany do `ai_logs`:

```sql
SELECT id, status, duration_ms, created_on 
FROM ai_logs 
ORDER BY created_on DESC 
LIMIT 1;
```

Powinien mieć `status = 'success'` i `duration_ms` między 200-1000.

---

## 🎯 Inne scenariusze testowe

### Test 1: Bez preferencji (minimalne)

```json
{
  "model": "gpt-5",
  "notes": [
    {
      "id": "note-0001-0000-0000-000000000001",
      "content": "Zwiedzić Koloseum",
      "priority": 3,
      "place_tags": null
    }
  ]
}
```

### Test 2: Błąd walidacji (nieprawidłowy model)

```json
{
  "model": "gpt-10-ultra",
  "notes": [...]
}
```

**Oczekiwany wynik:** `400 Bad Request`

### Test 3: Projekt nie istnieje

**URL:** `http://localhost:4321/api/projects/00000000-0000-0000-0000-000000000000/plan`

**Oczekiwany wynik:** `404 Not Found`

---

## 📚 Więcej informacji:

- **Szczegółowa dokumentacja:** `.ai/postman-testing-guide.md`
- **Wszystkie scenariusze:** `.ai/implementation-summary.md`
- **Dane testowe SQL:** `.ai/test-data-setup.sql`

## 🐛 Troubleshooting:

| Problem | Rozwiązanie |
|---------|-------------|
| `ECONNREFUSED` | Sprawdź czy serwer działa: `npm run dev` |
| `404 Not Found` | Sprawdź URL - port to `4321` |
| `500 Server Error` | Sprawdź logi w konsoli serwera |
| Projekt nie istnieje | Uruchom ponownie SQL z danymi testowymi |

---

**Gotowe!** 🎉 Endpoint działa i jest gotowy do testowania.




================================================
FILE: .ai/session-notes.md
================================================
<conversation_summary>
<decisions>
1. Isolate authentication screens in dedicated full-screen routes (`/auth/login`, `/auth/register`, `/auth/reset`) separated from the main layout.  
2. Implement global navigation with “Projects” and “Profile”; within a project, use tabs for “Notes”, “Plan” and “Logs”.  
3. In the Notes tab, display each note card truncated to 300 characters with “…” and allow click-to-expand and edit.  
4. Use a card grid with infinite scroll in the Notes tab and provide a priority filter control.  
5. Target only desktop web for MVP; mobile layouts are out of scope.  
6. Ensure WCAG AA compliance across all interactive components.  
7. Manage state initially with React hooks and context (optionally add Zustand later).  
8. Handle validation errors inline, show overlay spinners for loading, and use toast messages for non-critical success/info feedback.  
9. On “Generate Plan”, show an overlay spinner, disable the button, and allow retry on failure.  
10. Defer JWT-based token storage and refresh flows to a later stage; protect routes via an AuthGuard.  
11. Omit the AI logs view from the MVP (to be implemented later in an admin panel).  
</decisions>

<matched_recommendations>
1. Dedicated full-screen auth routes (Recommendation #1).  
2. Global nav + project-detail tabs for Notes/Plan/Logs (Recommendation #2).  
3. Infinite scroll card grid with filter controls (Recommendation #3).  
4. WCAG AA via accessible primitives (Recommendation #5).  
5. Inline validation + overlay spinners (Recommendation #7).  
6. Plan generation overlay spinner and retry (Recommendation #8).  
7. Protected routes with JWT/AuthGuard (Recommendation #9).  
8. Astro scaffolding + React hydration boundaries (Recommendation #10).  
</matched_recommendations>

<ui_architecture_planning_summary>
We agreed on a clear hierarchy: isolated auth screens → main layout with top nav (“Projects”, “Profile”) → project detail view with three tabs (“Notes”, “Plan”, "Logs"). The Notes tab will render a uniform card grid (infinite scroll) of notes (300 chars max, ellipsized) with a priority filter; clicking a card expands full text and edit form. The Plan tab will host a “Generate Plan” button that triggers a synchronous AI call: display an overlay spinner, disable the button, then render the returned schedule or show a retry toast on error. The Logs tab is deferred to a future admin panel. Profile preferences (multi-select autocomplete for categories) and project create/edit (date picker) will be built in the Profile and Project forms, with inline validation messages. State will be managed via React hooks and context initially; we’ll wire API calls through a centralized HTTP client (including JWT headers later). UI will be built in Astro with React components hydrated only where interactive, styled via Tailwind and Shadcn/ui primitives to meet WCAG AA standards. Loading states use overlay spinners, non-critical messages use toasts, and errors surface inline or via a global error boundary as needed.
</ui_architecture_planning_summary>

<unresolved_issues>
- Choose and integrate an accessible date picker for project creation/edit forms.  
- Define the ProfilePreferences component UI and autocomplete data flow.  
- Specify toast library/configuration (position, style, timeout).  
- Detail client-side token storage, refresh strategy, and AuthGuard implementation.  
- Confirm caching or background-refetch strategy since React Query was not adopted initially.  
</unresolved_issues>
</conversation_summary>


================================================
FILE: .ai/tech-stack.md
================================================
Frontend - Astro z React dla komponentów interaktywnych:
- Astro 5 pozwala na tworzenie szybkich, wydajnych stron i aplikacji z minimalną ilością JavaScript
- React 19 zapewni interaktywność tam, gdzie jest potrzebna
- TypeScript 5 dla statycznego typowania kodu i lepszego wsparcia IDE
- Tailwind 4 pozwala na wygodne stylowanie aplikacji
- Shadcn/ui zapewnia bibliotekę dostępnych komponentów React, na których oprzemy UI

Backend - Supabase jako kompleksowe rozwiązanie backendowe:
- Zapewnia bazę danych PostgreSQL
- Zapewnia SDK w wielu językach, które posłużą jako Backend-as-a-Service
- Jest rozwiązaniem open source, które można hostować lokalnie lub na własnym serwerze
- Posiada wbudowaną autentykację użytkowników

AI - Komunikacja z modelami przez usługę Openrouter.ai:
- Dostęp do szerokiej gamy modeli (OpenAI, Anthropic, Google i wiele innych), które pozwolą nam znaleźć rozwiązanie zapewniające wysoką efektywność i niskie koszta
- Pozwala na ustawianie limitów finansowych na klucze API

CI/CD i Hosting:
- Github Actions do tworzenia pipeline’ów CI/CD
- DigitalOcean do hostowania aplikacji za pośrednictwem obrazu docker


================================================
FILE: .ai/test-data-setup.sql
================================================
-- Skrypt SQL do przygotowania danych testowych dla endpointa POST /api/projects/{projectId}/plan
-- Uruchom ten skrypt w lokalnej bazie Supabase

-- 1. Utwórz projekt testowy
INSERT INTO travel_projects (id, name, duration_days, user_id, planned_date)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Wakacje w Rzymie',
  5,
  '1ec40836-4b23-4005-b399-82e2ceb327be', -- DEFAULT_USER_ID
  '2025-07-15'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Utwórz notatki testowe dla projektu
INSERT INTO notes (id, project_id, content, priority, place_tags)
VALUES 
  (
    'note-0001-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Zwiedzić Koloseum',
    3,
    ARRAY['architektura', 'historia']
  ),
  (
    'note-0001-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Odwiedzić Fontannę di Trevi',
    3,
    ARRAY['zabytki', 'turystyka']
  ),
  (
    'note-0001-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Spróbować włoskiej pizzy w lokalnej pizzerii',
    2,
    ARRAY['jedzenie', 'restauracje']
  ),
  (
    'note-0001-0000-0000-000000000004',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Zwiedzić Muzeum Watykańskie',
    3,
    ARRAY['muzea', 'sztuka', 'religia']
  ),
  (
    'note-0001-0000-0000-000000000005',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Przejść się po Piazza Navona',
    2,
    ARRAY['place', 'spacery']
  ),
  (
    'note-0001-0000-0000-000000000006',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Zjeść gelato w autentycznej gelaterii',
    1,
    ARRAY['jedzenie', 'desery']
  )
ON CONFLICT (id) DO NOTHING;

-- Weryfikacja utworzonych danych
SELECT 
  'Utworzono projekt:' as info,
  id, 
  name, 
  duration_days, 
  planned_date
FROM travel_projects
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

SELECT 
  'Utworzono notatek:' as info,
  COUNT(*) as count
FROM notes
WHERE project_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

SELECT 
  id,
  content,
  priority,
  place_tags
FROM notes
WHERE project_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
ORDER BY priority DESC, content;




================================================
FILE: .ai/ui-plan.md
================================================
# UI Architecture for VacationPlanner

## 1. UI Structure Overview

VacationPlanner is structured around isolated authentication routes, a global layout for authenticated sections, and a project-detail view with tabbed subviews. Authentication screens live outside the main layout. Once authenticated, users navigate via a top navigation bar to "Projects" and "Profile." Within a project, a tabbed interface hosts Notes and Plan views. Common components (spinner overlay, toast notifications, form fields) ensure consistent UX, accessibility, and security.

## 2. View List

- **Login View** (`/auth/login`)
  - Main purpose: Authenticate existing users
  - Key information: Email and password fields, login button, links to register and reset
  - Key view components: Form fields with inline validation, primary button, error message area
  - UX/Accessibility/Security: Labels tied to inputs, aria-describedby for errors, rate-limit feedback

- **Register View** (`/auth/register`)
  - Main purpose: Create new account
  - Key information: Email, password, confirm password, register button
  - Key view components: Form fields, password strength indicator, submit button
  - Considerations: Email format validation, password length, focus management, secure data handling

- **Reset Password View** (`/auth/reset`)
  - Main purpose: Request password reset link
  - Key information: Email field, send button, status message
  - Key view components: Form field, confirmation message area
  - Considerations: Link expiration notice, secure token handling

- **Profile View** (`/profile`)
  - Main purpose: Display and update user tourism preferences
  - Key information: Multi-select autocomplete for categories, save button, confirmation toast
  - Key view components: AutocompleteInput, Save changes button, toast notifications
  - Considerations: Keyboard navigation, aria-combobox, disabled state until changes made

- **Projects List View** (`/projects`)
  - Main purpose: List and manage travel projects
  - Key information: Project name, duration, planned date, pagination controls, create button
  - Key view components: Card or list items, New Project button, pagination/infinite scroll
  - Considerations: Empty state call-to-action, accessible list semantics, inline delete confirmation

- **Project Form (Modal)**
  - Main purpose: Create or edit a project
  - Key information: Name, duration days, planned date, save/cancel buttons
  - Key view components: Form inputs, date picker, inline validation messages
  - Considerations: date picker accessibility, keyboard trap in modal, validation feedback

- **Project Detail View** (`/projects/{projectId}`)
  - **Notes Tab** (`/projects/{projectId}/notes`)
    - Purpose: View and manage notes
    - Key info: Note cards truncated to 300 chars, priority, place/time tags
    - Components: InfiniteScrollGrid, NoteCard, FilterControl, Add Note button, NoteModal
    - Considerations: aria-live for loaded items, ellipsis for truncation, filter keyboard support

  - **Plan Tab** (`/projects/{projectId}/plan`)
    - Purpose: Generate and view AI schedule
    - Key info: Generate Plan button, overlay spinner, schedule list by day/activities
    - Components: Button, SpinnerOverlay, ScheduleList, Toast for errors
    - Considerations: aria-busy on overlay, disable button during call, retry prompt on failure

## 3. User Journey Map

1. User lands on `/auth/login`.  
2. Registers or logs in.  
3. Upon success, redirected to `/projects`.  
4. (Optional) Navigates to `/profile` to set preferences.  
5. Back at `/projects`, clicks "New Project" → fills and submits form → project appears.  
6. Clicks project card → lands in Notes tab.  
7. Adds multiple notes via modal.  
8. Switches to Plan tab, clicks "Generate Plan" → sees spinner, then schedule or error toast.  
9. Views schedule, navigates back to Projects or Profile.

## 4. Layout and Navigation Structure

- **Global Layout**: Top nav bar with links to Projects and Profile, user menu for logout.  
- **Auth Layout**: Full-screen routes for login, register, reset, without global nav.  
- **Project Detail**: Breadcrumbs (Projects > Project Name), tablist for Notes and Plan.  
- **Modals**: Create/edit forms open as overlays with focus trap and escape handling.

## 5. Key Components

- **NavBar**: Accessible navigation links, user menu.  
- **AuthGuard**: Redirects unauthenticated users to login.  
- **FormField**: Label, input, error message wrapper for inline validation.  
- **DatePicker**: Accessible date selection with aria attributes.  
- **AutocompleteInput**: For place tags and profile categories, aria-combobox.  
- **InfiniteScrollGrid**: Loads paginated data lazily with aria-live.  
- **NoteCard**: Displays truncated note, clickable region for modal.  
- **Modal**: Generic overlay with focus trap.  
- **SpinnerOverlay**: Full-screen spinner with aria-busy.  
- **Toast**: Non-blocking notifications, aria-live polite.  
- **Tabs**: Semantic tablist/tab elements with role attributes.  
- **Button**: Primary/secondary with disabled states and aria-disabled.



================================================
FILE: .ai/implementation-plans/all-endpoints-tests.md
================================================
# Quick Tests for All REST API Endpoints

Replace `{{BASE_URL}}`, `{{PROJECT_ID}}`, and `{{NOTE_ID}}` with actual values.

## Projects Endpoints

### 1. Create Project (POST /api/projects)
```bash
curl -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{"name": "Summer Vacation", "duration_days": 7, "planned_date": "2026-06-15"}'
```

### 2. List Projects (GET /api/projects)
```bash
curl -X GET "{{BASE_URL}}/api/projects?page=1&size=20&sort=created_on&order=desc"
```

### 3. Get Project (GET /api/projects/{projectId})
```bash
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}"
```

### 4. Update Project (PATCH /api/projects/{projectId})
```bash
curl -X PATCH "{{BASE_URL}}/api/projects/{{PROJECT_ID}}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Vacation", "duration_days": 10}'
```

### 5. Delete Project (DELETE /api/projects/{projectId})
```bash
curl -X DELETE "{{BASE_URL}}/api/projects/{{PROJECT_ID}}"
```

---

## Notes Endpoints

### 6. Create Note (POST /api/projects/{projectId}/notes)
```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Visit Eiffel Tower", "priority": 1, "place_tags": ["Paris", "Landmarks"]}'
```

### 7. List Notes (GET /api/projects/{projectId}/notes)
```bash
# Basic list
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes"

# With filters
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes?priority=1&page=1&size=10"

# Filter by place tag
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes?place_tag=Paris"
```

### 8. Get Note (GET /api/projects/{projectId}/notes/{noteId})
```bash
curl -X GET "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes/{{NOTE_ID}}"
```

### 9. Update Note (PATCH /api/projects/{projectId}/notes/{noteId})
```bash
curl -X PATCH "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes/{{NOTE_ID}}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Updated: Visit Eiffel Tower at sunset", "priority": 2}'
```

### 10. Delete Note (DELETE /api/projects/{projectId}/notes/{noteId})
```bash
curl -X DELETE "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes/{{NOTE_ID}}"
```

---

## AI Plan Generation

### 11. Generate Plan (POST /api/projects/{projectId}/plan)
```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "notes": [
      {"id": "uuid", "content": "Visit Eiffel Tower", "priority": 1, "place_tags": ["Paris"]},
      {"id": "uuid", "content": "Louvre Museum", "priority": 2, "place_tags": ["Paris"]}
    ],
    "preferences": {"categories": ["culture", "history"]}
  }'
```

---

## Complete Workflow Example

```bash
# 1. Create a project
PROJECT_RESPONSE=$(curl -s -X POST "{{BASE_URL}}/api/projects" \
  -H "Content-Type: application/json" \
  -d '{"name": "Paris Trip", "duration_days": 5, "planned_date": "2026-05-01"}')

PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.id')
echo "Created project: $PROJECT_ID"

# 2. Add some notes
NOTE1=$(curl -s -X POST "{{BASE_URL}}/api/projects/$PROJECT_ID/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Visit Eiffel Tower", "priority": 1, "place_tags": ["Paris"]}' | jq -r '.id')

NOTE2=$(curl -s -X POST "{{BASE_URL}}/api/projects/$PROJECT_ID/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Louvre Museum", "priority": 1, "place_tags": ["Paris"]}' | jq -r '.id')

echo "Created notes: $NOTE1, $NOTE2"

# 3. List all notes
curl -s -X GET "{{BASE_URL}}/api/projects/$PROJECT_ID/notes" | jq

# 4. Generate plan
curl -s -X POST "{{BASE_URL}}/api/projects/$PROJECT_ID/plan" \
  -H "Content-Type: application/json" \
  -d "{\"model\": \"gpt-4\", \"notes\": [{\"id\": \"$NOTE1\", \"content\": \"Visit Eiffel Tower\", \"priority\": 1, \"place_tags\": [\"Paris\"]}, {\"id\": \"$NOTE2\", \"content\": \"Louvre Museum\", \"priority\": 1, \"place_tags\": [\"Paris\"]}]}" | jq

# 5. Update project
curl -s -X PATCH "{{BASE_URL}}/api/projects/$PROJECT_ID" \
  -H "Content-Type: application/json" \
  -d '{"duration_days": 7}' | jq

# 6. Get updated project
curl -s -X GET "{{BASE_URL}}/api/projects/$PROJECT_ID" | jq
```

---

## Error Test Cases

### Invalid UUID Format (400)
```bash
curl -X GET "{{BASE_URL}}/api/projects/not-a-uuid"
```

### Project Not Found (404)
```bash
curl -X GET "{{BASE_URL}}/api/projects/00000000-0000-0000-0000-000000000000"
```

### Invalid Pagination (400)
```bash
curl -X GET "{{BASE_URL}}/api/projects?page=0"
```

### Empty Content (400)
```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "", "priority": 1}'
```

### Invalid Priority (400)
```bash
curl -X POST "{{BASE_URL}}/api/projects/{{PROJECT_ID}}/notes" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test", "priority": 5}'
```




================================================
FILE: .ai/implementation-plans/endpoints-summary.md
================================================
# REST API Implementation Summary

## ✅ Completed Endpoints

### Projects Endpoints

#### 1. POST /api/projects - Create Project
- **File**: `src/pages/api/projects/index.ts`
- **Service**: `ProjectService.createProject()`
- **Schema**: `createProjectCommandSchema`
- **Status**: ✅ Complete with tests

#### 2. GET /api/projects - List Projects
- **File**: `src/pages/api/projects/index.ts`
- **Service**: `ProjectService.listProjects()`
- **Schema**: `listProjectsQuerySchema`
- **Features**: Pagination, sorting (by created_on, name, duration_days, planned_date)
- **Status**: ✅ Complete

#### 3. GET /api/projects/{projectId} - Get Project
- **File**: `src/pages/api/projects/[projectId]/index.ts`
- **Service**: `ProjectService.getProject()`
- **Schema**: `projectIdParamSchema`
- **Status**: ✅ Complete

#### 4. PATCH /api/projects/{projectId} - Update Project
- **File**: `src/pages/api/projects/[projectId]/index.ts`
- **Service**: `ProjectService.updateProject()`
- **Schema**: `updateProjectCommandSchema`
- **Features**: All fields optional
- **Status**: ✅ Complete

#### 5. DELETE /api/projects/{projectId} - Delete Project
- **File**: `src/pages/api/projects/[projectId]/index.ts`
- **Service**: `ProjectService.deleteProject()`
- **Response**: 204 No Content
- **Status**: ✅ Complete

### Notes Endpoints

#### 6. POST /api/projects/{projectId}/notes - Create Note
- **File**: `src/pages/api/projects/[projectId]/notes/index.ts`
- **Service**: `NoteService.createNote()`
- **Schema**: `createNoteCommandSchema`
- **Status**: ✅ Complete with tests

#### 7. GET /api/projects/{projectId}/notes - List Notes
- **File**: `src/pages/api/projects/[projectId]/notes/index.ts`
- **Service**: `NoteService.listNotes()`
- **Schema**: `listNotesQuerySchema`
- **Features**: Pagination, filter by priority, filter by place_tag
- **Status**: ✅ Complete

#### 8. GET /api/projects/{projectId}/notes/{noteId} - Get Note
- **File**: `src/pages/api/projects/[projectId]/notes/[noteId].ts`
- **Service**: `NoteService.getNote()`
- **Status**: ✅ Complete

#### 9. PATCH /api/projects/{projectId}/notes/{noteId} - Update Note
- **File**: `src/pages/api/projects/[projectId]/notes/[noteId].ts`
- **Service**: `NoteService.updateNote()`
- **Schema**: `updateNoteCommandSchema`
- **Features**: All fields optional
- **Status**: ✅ Complete

#### 10. DELETE /api/projects/{projectId}/notes/{noteId} - Delete Note
- **File**: `src/pages/api/projects/[projectId]/notes/[noteId].ts`
- **Service**: `NoteService.deleteNote()`
- **Response**: 204 No Content
- **Status**: ✅ Complete

### AI Plan Generation

#### 11. POST /api/projects/{projectId}/plan - Generate Plan
- **File**: `src/pages/api/projects/[projectId]/plan.ts`
- **Service**: `PlanService.generatePlan()`, `AIService.generatePlan()`
- **Schema**: `generatePlanCommandSchema`
- **Features**: AI log creation, success/failure tracking
- **Status**: ✅ Complete (pre-existing)

## Implementation Details

### Services Created/Updated

1. **ProjectService** (`src/services/project.service.ts`)
   - `listProjects()` - Paginated list with sorting
   - `getProject()` - Single project retrieval
   - `createProject()` - Project creation
   - `updateProject()` - Project update (all fields optional)
   - `deleteProject()` - Project deletion

2. **NoteService** (`src/services/note.service.ts`)
   - `verifyProjectOwnership()` - Security check
   - `listNotes()` - Paginated list with filters
   - `getNote()` - Single note retrieval
   - `createNote()` - Note creation
   - `updateNote()` - Note update (all fields optional)
   - `deleteNote()` - Note deletion

### Schemas Created/Updated

1. **project.schema.ts**
   - `createProjectCommandSchema` - For creating projects
   - `updateProjectCommandSchema` - For updating projects (all optional)
   - `listProjectsQuerySchema` - For pagination and sorting
   - `projectIdParamSchema` - For URL param validation

2. **note.schema.ts**
   - `createNoteCommandSchema` - For creating notes
   - `updateNoteCommandSchema` - For updating notes (all optional)
   - `listNotesQuerySchema` - For pagination and filters
   - `projectIdParamSchema` - For URL param validation
   - `noteIdParamSchema` - For URL param validation

### Key Features

✅ **Pagination**: All list endpoints support page and size parameters
✅ **Sorting**: Projects list supports sorting by multiple fields
✅ **Filtering**: Notes list supports priority and place_tag filters
✅ **Validation**: Comprehensive Zod schemas for all inputs
✅ **Security**: Project ownership verification for all note operations
✅ **Error Handling**: Centralized error handling with appropriate status codes
✅ **Documentation**: JSDoc comments on all endpoints and service methods
✅ **Consistency**: All endpoints follow the same patterns

## Status Codes Used

- **200 OK**: Successful read operations
- **201 Created**: Successful create operations
- **204 No Content**: Successful delete operations
- **400 Bad Request**: Validation errors, invalid input
- **404 Not Found**: Resource not found or not owned by user
- **500 Internal Server Error**: Database errors, unexpected failures

## Authentication

Currently using `DEFAULT_USER_ID` for all endpoints. JWT authentication will be implemented later.

## Testing

Test files created:
- `.ai/project-creation-tests.md` - 10 test cases for project creation
- `.ai/note-creation-tests.md` - 14 test cases for note creation
- `.ai/implementation-plans/list-projects-tests.md` - 5 test cases for listing projects

All tests are curl-based and can be imported into Postman.

## Files Organization

```
.ai/
├── implementation-plans/
│   ├── project-creation-implementation-plan.md
│   ├── note-creation-implementation-plan.md
│   ├── list-projects.md
│   ├── get-project.md
│   ├── update-project.md
│   ├── notes-endpoints.md
│   ├── list-projects-tests.md
│   └── endpoints-summary.md (this file)
├── project-creation-tests.md
└── note-creation-tests.md

src/
├── lib/
│   └── schemas/
│       ├── project.schema.ts (✅ Complete)
│       └── note.schema.ts (✅ Complete)
├── services/
│   ├── project.service.ts (✅ Complete)
│   └── note.service.ts (✅ Complete)
└── pages/
    └── api/
        └── projects/
            ├── index.ts (GET, POST)
            └── [projectId]/
                ├── index.ts (GET, PATCH, DELETE)
                ├── plan.ts (POST - pre-existing)
                └── notes/
                    ├── index.ts (GET, POST)
                    └── [noteId].ts (GET, PATCH, DELETE)
```

## Next Steps

The core CRUD API is complete. Remaining work:
1. Implement JWT authentication (replace DEFAULT_USER_ID)
2. Add more comprehensive test suites if needed
3. Consider adding user profile endpoints (GET /users/me, PATCH /users/me/preferences)
4. Consider adding AI logs endpoints (GET /projects/{projectId}/logs)




================================================
FILE: .ai/implementation-plans/get-project.md
================================================
# API Endpoint Implementation Plan: Get Project

## 1. Endpoint Overview
Retrieve a single travel project by ID.

- **HTTP Method:** GET  
- **URL:** `/api/projects/{projectId}`  
- **Purpose:** Get detailed information about a specific project.

## 2. Request Details
- **URL Parameters:**
  - `projectId` (string, UUID) - The ID of the project

## 3. Used Types
- **ProjectDto** (`src/types.ts`)

## 4. Response Details
- **200 OK:** Project object
- **400 Bad Request:** Invalid UUID format
- **404 Not Found:** Project not found or not owned by user
- **500 Internal Server Error:** Database failures

## 5. Data Flow
1. Validate projectId from URL
2. Query database for project with matching ID and user_id
3. Return project or 404

## 6. Implementation Steps
1. Add `getProject` method to `ProjectService`
2. Create GET handler in `src/pages/api/projects/[projectId]/index.ts`
3. Add tests




================================================
FILE: .ai/implementation-plans/list-projects-tests.md
================================================
# API Tests for GET /api/projects

## Test Cases

### 1. List Projects - Default Parameters (200 OK)

```bash
curl -X GET "{{BASE_URL}}/api/projects"
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Trip to Paris",
      "duration_days": 5,
      "planned_date": "2026-03-15"
    }
  ],
  "meta": {
    "page": 1,
    "size": 20,
    "total": 1
  }
}
```

### 2. List Projects - With Pagination (200 OK)

```bash
curl -X GET "{{BASE_URL}}/api/projects?page=1&size=10"
```

### 3. List Projects - With Sorting (200 OK)

```bash
curl -X GET "{{BASE_URL}}/api/projects?sort=name&order=asc"
```

### 4. Invalid Page Number (400 Bad Request)

```bash
curl -X GET "{{BASE_URL}}/api/projects?page=0"
```

**Expected Response (400):**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [...]
}
```

### 5. Invalid Size (400 Bad Request)

```bash
curl -X GET "{{BASE_URL}}/api/projects?size=200"
```




================================================
FILE: .ai/implementation-plans/list-projects.md
================================================
# API Endpoint Implementation Plan: List Projects

## 1. Endpoint Overview
Retrieve a paginated list of travel projects for the authenticated user.

- **HTTP Method:** GET  
- **URL:** `/api/projects`  
- **Purpose:** Allow users to view all their travel projects with pagination and sorting options.

## 2. Request Details
- **Query Parameters:**
  - `page` (integer, optional, default: 1) - Page number
  - `size` (integer, optional, default: 20) - Items per page
  - `sort` (string, optional, default: "created_on") - Field to sort by
  - `order` (string, optional, default: "desc") - Sort order (asc/desc)

## 3. Used Types
- **ProjectDto** (`src/types.ts`)
- **ProjectsListResponseDto** (`src/types.ts`):
  ```ts
  export type ProjectsListResponseDto = {
    data: ProjectDto[];
    meta: {
      page: number;
      size: number;
      total: number;
    };
  };
  ```

## 4. Response Details
- **200 OK:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "Trip to Paris",
        "duration_days": 5,
        "planned_date": "2026-03-15"
      }
    ],
    "meta": {
      "page": 1,
      "size": 20,
      "total": 1
    }
  }
  ```
- **400 Bad Request:** Invalid query parameters
- **500 Internal Server Error:** Database failures

## 5. Data Flow
1. Parse and validate query parameters (page, size, sort, order)
2. Calculate offset: `(page - 1) * size`
3. Query database for projects belonging to DEFAULT_USER_ID
4. Get total count of projects
5. Return paginated response with metadata

## 6. Security Considerations
- Filter projects by user_id to ensure users only see their own projects
- Validate and sanitize query parameters
- Limit maximum page size to prevent resource exhaustion

## 7. Error Handling
| Scenario                    | Status Code | Handling                    |
|-----------------------------|-------------|-----------------------------|
| Invalid query parameters    | 400         | Zod validation error        |
| Database query error        | 500         | Log and return 500          |

## 8. Performance Considerations
- Use pagination to limit result sets
- Index on user_id and created_on for efficient queries
- Consider caching for frequently accessed data

## 9. Implementation Steps
1. Define query parameter schema in `src/lib/schemas/project.schema.ts`
2. Add `listProjects` method to `ProjectService`
3. Implement GET handler in `src/pages/api/projects/index.ts`
4. Create 5 curl tests




================================================
FILE: .ai/implementation-plans/note-creation-implementation-plan.md
================================================
# API Endpoint Implementation Plan: Create Note

## 1. Endpoint Overview
Create a new note for a specific travel project.

- **HTTP Method:** POST  
- **URL:** `/api/projects/{projectId}/notes`  
- **Purpose:** Allow a user to add a new note to their existing travel project, specifying content, priority, and optional place tags.

## 2. Request Details
- **URL Parameters:**
  - `projectId` (string, UUID) - The ID of the travel project
- **Request Body (JSON):**
  ```json
  {
    "content": "Visit Eiffel Tower at sunset",
    "priority": 1,
    "place_tags": ["Paris", "Monuments"]
  }
  ```
- **Parameters:**
  - Required:
    - `content` (string, nonempty)
    - `priority` (integer, between 1 and 3)
  - Optional:
    - `place_tags` (array of strings, nullable)

## 3. Used Types
- **CreateNoteCommand** (`src/types.ts`):
  ```ts
  export type CreateNoteCommand = {
    project_id: string;
    content: string;
    priority: number;
    place_tags?: string[] | null;
  };
  ```
- **NoteDto** (`src/types.ts`):
  ```ts
  export type NoteDto = {
    id: string;
    project_id: string;
    content: string;
    priority: number;
    place_tags: string[] | null;
    updated_on: string;
  };
  ```

## 4. Response Details
- **201 Created:**  
  - Body: the newly created `NoteDto`, e.g.:
    ```json
    {
      "id": "uuid",
      "project_id": "uuid",
      "content": "Visit Eiffel Tower at sunset",
      "priority": 1,
      "place_tags": ["Paris", "Monuments"],
      "updated_on": "2025-10-21T12:00:00Z"
    }
    ```
- **400 Bad Request:** malformed JSON, invalid UUID, or validation failure  
- **404 Not Found:** project does not exist or does not belong to user  
- **500 Internal Server Error:** database failures or unexpected errors  

## 5. Data Flow
1. **Validate projectId parameter:**  
   - Parse `projectId` from URL and validate it's a valid UUID.
2. **Verify project ownership:**  
   - Check that the project with `projectId` exists and belongs to `DEFAULT_USER_ID`.
   - Return 404 if project doesn't exist or doesn't belong to the user.
3. **Parse & validate input:**  
   - `await context.request.json()` → handle JSON parse errors.
   - Validate against a Zod schema (`createNoteCommandSchema`).
4. **Business logic in service:**  
   - `NoteService.createNote(projectId, command, supabase)`
   - Inserts into `notes`:
     - `project_id = projectId`
     - `content`, `priority`, `place_tags`
   - Returns inserted row mapped to `NoteDto`.  
5. **Return response:**  
   - `createSuccessResponse<NoteDto>(note, 201)`.  
6. **Error handling:**  
   - Catch Zod errors → `handleZodError` (400)  
   - Catch `ApiError` → `createErrorResponse` with its status  
   - Unexpected → 500 via `handleApiError`

## 6. Security Considerations
- **Project ownership verification:** Ensure the project belongs to `DEFAULT_USER_ID` before allowing note creation.
- **Input sanitization:** Zod schema enforces correct types and formats.
- **SQL injection:** Supabase client is parameterized.
- **Authorization:** Only allow creating notes for projects owned by the authenticated user (currently `DEFAULT_USER_ID`).

## 7. Error Handling
| Scenario                                    | Status Code | Handling                                  |
|---------------------------------------------|-------------|-------------------------------------------|
| Invalid projectId UUID format               | 400         | Zod validation error                      |
| Malformed JSON body                         | 400         | catch JSON parse exception                |
| Schema validation failure (Zod)             | 400         | `handleZodError`                          |
| Project not found or not owned by user      | 404         | `ApiError(404, 'Project not found')`      |
| Database insertion error                    | 500         | log via `console.error`; return 500       |
| Unexpected exception                        | 500         | `handleApiError`                          |

## 8. Performance Considerations
- Single project ownership check + single-row insert.
- Ensure `notes.project_id` is indexed (it is the FK).
- Response payload is minimal.

## 9. Implementation Steps
1. **Define Zod schema**  
   - Create `src/lib/schemas/note.schema.ts`:
     ```ts
     import { z } from 'zod';

     /**
      * Schemat walidacji parametru projectId w URL
      */
     export const projectIdParamSchema = z.string().uuid('Project ID must be a valid UUID');

     /**
      * Schemat walidacji dla tworzenia notatki
      */
     export const createNoteCommandSchema = z.object({
       content: z.string().min(1, 'Content cannot be empty'),
       priority: z.number().int().min(1).max(3, 'Priority must be between 1 and 3'),
       place_tags: z.array(z.string()).nullable().optional(),
     });

     /**
      * Typ wynikowy z walidacji schematu
      */
     export type ValidatedCreateNoteCommand = z.infer<typeof createNoteCommandSchema>;
     ```

2. **Create NoteService**  
   - File: `src/services/note.service.ts`  
   - Methods:
     ```ts
     import type { CreateNoteCommand, NoteDto } from '../types';
     import { ApiError } from '../lib/api-utils';
     import type { supabaseClient } from '../db/supabase.client';

     type DbClient = typeof supabaseClient;

     export class NoteService {
       /**
        * Weryfikuje istnienie projektu i własność
        */
       async verifyProjectOwnership(
         projectId: string,
         userId: string,
         db: DbClient
       ): Promise<void> {
         const { data: project, error } = await db
           .from('travel_projects')
           .select('id, user_id')
           .eq('id', projectId)
           .single();

         if (error || !project) {
           console.error('Project not found or Supabase error:', error);
           throw new ApiError(404, 'Project not found');
         }

         if (project.user_id !== userId) {
           console.error(`User ID mismatch - Project user_id: ${project.user_id}, Expected user_id: ${userId}`);
           throw new ApiError(404, 'Project not found'); // Don't reveal that the project exists
         }
       }

       /**
        * Tworzy nową notatkę dla projektu
        */
       async createNote(
         projectId: string,
         command: Omit<CreateNoteCommand, 'project_id'>,
         db: DbClient
       ): Promise<NoteDto> {
         const { data, error } = await db
           .from('notes')
           .insert({
             project_id: projectId,
             content: command.content,
             priority: command.priority,
             place_tags: command.place_tags ?? null,
           })
           .select('id, project_id, content, priority, place_tags, updated_on')
           .single();

         if (error || !data) {
           console.error('Error creating note:', error);
           throw new ApiError(500, 'Failed to create note');
         }

         return data as NoteDto;
       }
     }

     export const noteService = new NoteService();
     ```

3. **Implement API route**  
   - File: `src/pages/api/projects/[projectId]/notes/index.ts`  
   - Handler:
     ```ts
     import type { APIRoute } from 'astro';
     import { handleApiError, createSuccessResponse, ApiError } from '../../../../../lib/api-utils';
     import { projectIdParamSchema, createNoteCommandSchema } from '../../../../../lib/schemas/note.schema';
     import { noteService } from '../../../../../services/note.service';
     import { DEFAULT_USER_ID } from '../../../../../db/supabase.client';

     export const POST: APIRoute = async (context) => {
       try {
         // Krok 1: Walidacja projectId z URL
         const projectId = projectIdParamSchema.parse(context.params.projectId);

         // Krok 2: Weryfikacja własności projektu
         await noteService.verifyProjectOwnership(projectId, DEFAULT_USER_ID, context.locals.supabase);

         // Krok 3: Parsowanie i walidacja JSON body
         let body: unknown;
         try {
           body = await context.request.json();
         } catch {
           throw new ApiError(400, 'Invalid JSON format in request body');
         }

         // Krok 4: Walidacja danych wejściowych za pomocą Zod
         const command = createNoteCommandSchema.parse(body);

         // Krok 5: Wywołanie serwisu do utworzenia notatki
         const note = await noteService.createNote(projectId, command, context.locals.supabase);

         // Krok 6: Zwrócenie odpowiedzi 201 Created
         return createSuccessResponse(note, 201);
       } catch (error) {
         return handleApiError(error);
       }
     };

     export const prerender = false;
     ```

4. **Authentication**  
   - Currently using `DEFAULT_USER_ID` - JWT authentication will be implemented later.
   - Middleware already provides `context.locals.supabase`.

5. **Testing**  
   - Write curl-based tests for Postman import:
     - Invalid projectId format → 400
     - Project not found → 404
     - Invalid payload → 400
     - Successful creation → 201 + returned object




================================================
FILE: .ai/implementation-plans/notes-endpoints.md
================================================
# API Endpoint Implementation Plan: Notes CRUD

## Endpoints

### 1. GET /projects/{projectId}/notes - List Notes
- Paginated list with filters (priority, place_tag)
- Query params: page, size, priority, place_tag

### 2. GET /projects/{projectId}/notes/{noteId} - Get Note
- Return single note by ID
- Verify project ownership

### 3. PATCH /projects/{projectId}/notes/{noteId} - Update Note
- All fields optional
- Verify project ownership

### 4. DELETE /projects/{projectId}/notes/{noteId} - Delete Note
- Remove note
- Verify project ownership

## Implementation
All methods added to NoteService and implemented in route handlers.




================================================
FILE: .ai/implementation-plans/project-creation-implementation-plan.md
================================================
# API Endpoint Implementation Plan: Create Project

## 1. Endpoint Overview
Create a new travel project for the authenticated user.

- **HTTP Method:** POST  
- **URL:** `/api/projects`  
- **Purpose:** Allow a signed-in user to create a new travel project by specifying its name, duration, and optional planned date.

## 2. Request Details
- **Headers:**  
  - `Authorization: Bearer <JWT>`  
- **Request Body (JSON):**
  ```json
  {
    "name": "Trip to Paris",
    "duration_days": 5,
    "planned_date": "2026-03-15"
  }
  ```
- **Parameters:**
  - Required:
    - `name` (string, nonempty)
    - `duration_days` (integer, ≥ 1)
  - Optional:
    - `planned_date` (string matching `YYYY-MM-DD`)

## 3. Used Types
- **CreateProjectCommand** (`src/types.ts`):
  ```ts
  export type CreateProjectCommand = {
    name: string;
    duration_days: number;
    planned_date?: string | null;
  };
  ```
- **ProjectDto** (`src/types.ts`):
  ```ts
  export type ProjectDto = {
    id: string;
    name: string;
    duration_days: number;
    planned_date: string | null;
  };
  ```

## 4. Response Details
- **201 Created:**  
  - Body: the newly created `ProjectDto`, e.g.:
    ```json
    {
      "id": "uuid",
      "name": "Trip to Paris",
      "duration_days": 5,
      "planned_date": "2026-03-15"
    }
    ```
- **400 Bad Request:** malformed JSON or validation failure  
- **401 Unauthorized:** missing or invalid JWT  
- **500 Internal Server Error:** database failures or unexpected errors  

## 5. Data Flow
1. **Authenticate user:**  
   - Call `verifyUser(context)` → returns `userId` or throws `ApiError(401)`.  
2. **Parse & validate input:**  
   - `await context.request.json()` → handle JSON parse errors.  
   - Validate against a Zod schema (`createProjectCommandSchema`).  
3. **Business logic in service:**  
   - `ProjectService.createProject(userId, command, supabase)`  
   - Inserts into `travel_projects`:
     - `user_id = userId`
     - `name`, `duration_days`, `planned_date`
   - Returns inserted row mapped to `ProjectDto`.  
4. **Return response:**  
   - `createSuccessResponse<ProjectDto>(project, 201)`.  
5. **Error handling:**  
   - Catch Zod errors → `handleZodError` (400)  
   - Catch `ApiError` → `createErrorResponse` with its status  
   - Unexpected → 500 via `handleApiError`

## 6. Security Considerations
- **Authentication:** require and validate Bearer JWT using Supabase auth.  
- **Row ownership:** `service.createProject` uses only the verified `userId` (no ability to set arbitrary `user_id`).  
- **Input sanitization:** Zod schema enforces correct types and formats.  
- **SQL injection:** Supabase client is parameterized.  

## 7. Error Handling
| Scenario                                    | Status Code | Handling                                  |
|---------------------------------------------|-------------|-------------------------------------------|
| Missing/invalid Authorization header        | 401         | `ApiError(401, 'Missing or invalid token')` |
| Malformed JSON body                         | 400         | catch JSON parse exception                |
| Schema validation failure (Zod)             | 400         | `handleZodError`                          |
| Database insertion error                    | 500         | log via `console.error`; return 500       |
| Unexpected exception                        | 500         | `handleApiError`                          |

## 8. Performance Considerations
- Single-row insert; no heavy joins or scans.
- Ensure `travel_projects.user_id` is indexed (it is the FK).
- Response payload is minimal.

## 9. Implementation Steps
1. **Define Zod schema**  
   - Create `src/lib/schemas/project.schema.ts`:
     ```ts
     import { z } from 'zod';

     export const createProjectCommandSchema = z.object({
       name: z.string().min(1, 'Name cannot be empty'),
       duration_days: z.number().int().min(1, 'Duration must be at least 1'),
       planned_date: z
         .string()
         .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
         .optional(),
     });
     export type ValidatedCreateProjectCommand = z.infer<typeof createProjectCommandSchema>;
     ```
2. **Create ProjectService**  
   - File: `src/services/project.service.ts`  
   - Method:
     ```ts
     import type { CreateProjectCommand, ProjectDto } from '../types';
     import { ApiError } from '../lib/api-utils';
     import { DEFAULT_USER_ID, supabaseClient } from '../db/supabase.client';

     type DbClient = typeof supabaseClient;

     export class ProjectService {
       async createProject(
         userId: string,
         command: CreateProjectCommand,
         db: DbClient
       ): Promise<ProjectDto> {
         const { data, error } = await db
           .from('travel_projects')
           .insert({ user_id: userId, ...command })
           .select('id, name, duration_days, planned_date')
           .single();

         if (error || !data) {
           console.error('Error creating project:', error);
           throw new ApiError(500, 'Failed to create project');
         }
         return data as ProjectDto;
       }
     }

     export const projectService = new ProjectService();
     ```
3. **Implement API route**  
   - File: `src/pages/api/projects/index.ts`  
   - Handler:
     ```ts
     import type { APIRoute } from 'astro';
     import { verifyUser, handleApiError, createSuccessResponse } from '../../../lib/api-utils';
     import { createProjectCommandSchema } from '../../../lib/schemas/project.schema';
     import { projectService } from '../../../services/project.service';

     export const POST: APIRoute = async (context) => {
       try {
         const userId = await verifyUser(context);
         let body: unknown;
         try {
           body = await context.request.json();
         } catch {
           throw new ApiError(400, 'Invalid JSON');
         }
         const command = createProjectCommandSchema.parse(body);
         const project = await projectService.createProject(userId, command, context.locals.supabase);
         return createSuccessResponse(project, 201);
       } catch (err) {
         return handleApiError(err);
       }
     };
     ```
4. **Wire up authentication**  
   - Ensure `src/middleware/index.ts` applies Supabase client and that `verifyUser` is available.  
   - Confirm `context.locals.supabase` is the Supabase client.  
5. **Testing**  
   - Write minimal integration tests for happy path and error cases:  
     - Missing token → 401  
     - Invalid payload → 400  
     - Successful creation → 201 + returned object  



================================================
FILE: .ai/implementation-plans/update-project.md
================================================
# API Endpoint Implementation Plan: Update Project

## 1. Endpoint Overview
Update an existing travel project.

- **HTTP Method:** PATCH  
- **URL:** `/api/projects/{projectId}`  
- **Purpose:** Update project fields (all optional).

## 2. Request Details
- **URL Parameters:** `projectId` (UUID)
- **Request Body:** Same as create (all optional)
  ```json
  { "name": "string", "duration_days": integer, "planned_date": "YYYY-MM-DD" }
  ```

## 3. Used Types
- **UpdateProjectCommand** (`src/types.ts`)
- **ProjectDto** (`src/types.ts`)

## 4. Response Details
- **200 OK:** Updated project
- **400 Bad Request:** Invalid input
- **404 Not Found:** Project not found
- **500 Internal Server Error:** Database failures

## 5. Implementation Steps
1. Define `updateProjectCommandSchema` in schemas
2. Add `updateProject` method to `ProjectService`
3. Add PATCH handler to `src/pages/api/projects/[projectId]/index.ts`




================================================
FILE: .cursor/rules/api-supabase-astro-init.mdc
================================================
---
description: 
globs: 
alwaysApply: false
---
# Supabase Astro Initialization

This document provides a reproducible guide to create the necessary file structure for integrating Supabase with your Astro project.

## Prerequisites

- Your project should use Astro 5, TypeScript 5, React 19, and Tailwind 4.
- Install the `@supabase/supabase-js` package.
- Ensure that `/supabase/config.toml` exists
- Ensure that a file `/src/db/database.types.ts` exists and contains the correct type definitions for your database.

IMPORTANT: Check prerequisites before perfoming actions below. If they're not met, stop and ask a user for the fix.

## File Structure and Setup

### 1. Supabase Client Initialization

Create the file `/src/db/supabase.client.ts` with the following content:

```ts
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../db/database.types.ts';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

This file initializes the Supabase client using the environment variables `SUPABASE_URL` and `SUPABASE_KEY`.


### 2. Middleware Setup

Create the file `/src/middleware/index.ts` with the following content:

```ts
import { defineMiddleware } from 'astro:middleware';

import { supabaseClient } from '../db/supabase.client.ts';

export const onRequest = defineMiddleware((context, next) => {
  context.locals.supabase = supabaseClient;
  return next();
});
```

This middleware adds the Supabase client to the Astro context locals, making it available throughout your application.


### 3. TypeScript Environment Definitions

Create the file `src/env.d.ts` with the following content:

```ts
/// <reference types="astro/client" />

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db/database.types.ts';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
    }
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

This file augments the global types to include the Supabase client on the Astro `App.Locals` object, ensuring proper typing throughout your application.



================================================
FILE: .cursor/rules/astro.mdc
================================================
---
description: 
globs: *.astro
alwaysApply: false
---
### Guidelines for Astro

- Leverage View Transitions API for smooth page transitions (use ClientRouter)
- Use content collections with type safety for blog posts, documentation, etc.
- Leverage Server Endpoints for API routes
- Use POST, GET  - uppercase format for endpoint handlers
- Use `export const prerender = false` for API routes
- Use zod for input validation in API routes
- Extract logic into services in `src/lib/services`
- Implement middleware for request/response modification
- Use image optimization with the Astro Image integration
- Implement hybrid rendering with server-side rendering where needed
- Use Astro.cookies for server-side cookie management
- Leverage import.meta.env for environment variables



================================================
FILE: .cursor/rules/backend.mdc
================================================
---
description: 
globs: src/db/*.ts,src/middleware/*.ts,src/lib/*.ts
alwaysApply: false
---
### Backend and Database

- Use Supabase for backend services, including authentication and database interactions.
- Follow Supabase guidelines for security and performance.
- Use Zod schemas to validate data exchanged with the backend.
- Use supabase from context.locals in Astro routes instead of importing supabaseClient directly
- Use SupabaseClient type from `src/db/supabase.client.ts`, not from `@supabase/supabase-js`


================================================
FILE: .cursor/rules/db-supabase-migrations.mdc
================================================
---
description: 
globs: 
alwaysApply: false
---
# Database: Create migration

You are a Postgres Expert who loves creating secure database schemas.

This project uses the migrations provided by the Supabase CLI.

## Creating a migration file

Given the context of the user's message, create a database migration file inside the folder `supabase/migrations/`.

The file MUST following this naming convention:

The file MUST be named in the format `YYYYMMDDHHmmss_short_description.sql` with proper casing for months, minutes, and seconds in UTC time:

1. `YYYY` - Four digits for the year (e.g., `2024`).
2. `MM` - Two digits for the month (01 to 12).
3. `DD` - Two digits for the day of the month (01 to 31).
4. `HH` - Two digits for the hour in 24-hour format (00 to 23).
5. `mm` - Two digits for the minute (00 to 59).
6. `ss` - Two digits for the second (00 to 59).
7. Add an appropriate description for the migration.

For example:

```
20240906123045_create_profiles.sql
```


## SQL Guidelines

Write Postgres-compatible SQL code for Supabase migration files that:

- Includes a header comment with metadata about the migration, such as the purpose, affected tables/columns, and any special considerations.
- Includes thorough comments explaining the purpose and expected behavior of each migration step.
- Write all SQL in lowercase.
- Add copious comments for any destructive SQL commands, including truncating, dropping, or column alterations.
- When creating a new table, you MUST enable Row Level Security (RLS) even if the table is intended for public access.
- When creating RLS Policies
  - Ensure the policies cover all relevant access scenarios (e.g. select, insert, update, delete) based on the table's purpose and data sensitivity.
  - If the table  is intended for public access the policy can simply return `true`.
  - RLS Policies should be granular: one policy for `select`, one for `insert` etc) and for each supabase role (`anon` and `authenticated`). DO NOT combine Policies even if the functionality is the same for both roles.
  - Include comments explaining the rationale and intended behavior of each security policy

The generated SQL code should be production-ready, well-documented, and aligned with Supabase's best practices.



================================================
FILE: .cursor/rules/frontend.mdc
================================================
---
description: 
globs: *.tsx,*.astro
alwaysApply: false
---
## Frontend

### General Guidelines

- Use Astro components (.astro) for static content and layout
- Implement framework components in React only when interactivity is needed

### Guidelines for Styling

#### Tailwind

- Use the @layer directive to organize styles into components, utilities, and base layers
- Use arbitrary values with square brackets (e.g., w-[123px]) for precise one-off designs
- Implement the Tailwind configuration file for customizing theme, plugins, and variants
- Leverage the theme() function in CSS for accessing Tailwind theme values
- Implement dark mode with the dark: variant
- Use responsive variants (sm:, md:, lg:, etc.) for adaptive designs
- Leverage state variants (hover:, focus-visible:, active:, etc.) for interactive elements

### Guidelines for Accessibility

#### ARIA Best Practices

- Use ARIA landmarks to identify regions of the page (main, navigation, search, etc.)
- Apply appropriate ARIA roles to custom interface elements that lack semantic HTML equivalents
- Set aria-expanded and aria-controls for expandable content like accordions and dropdowns
- Use aria-live regions with appropriate politeness settings for dynamic content updates
- Implement aria-hidden to hide decorative or duplicative content from screen readers
- Apply aria-label or aria-labelledby for elements without visible text labels
- Use aria-describedby to associate descriptive text with form inputs or complex elements
- Implement aria-current for indicating the current item in a set, navigation, or process
- Avoid redundant ARIA that duplicates the semantics of native HTML elements


================================================
FILE: .cursor/rules/react.mdc
================================================
---
description: 
globs: *.tsx
alwaysApply: false
---
### Guidelines for React

- Use functional components with hooks instead of class components
- Never use "use client" and other Next.js directives as we use React with Astro
- Extract logic into custom hooks in `src/components/hooks`
- Implement React.memo() for expensive components that render often with the same props
- Utilize React.lazy() and Suspense for code-splitting and performance optimization
- Use the useCallback hook for event handlers passed to child components to prevent unnecessary re-renders
- Prefer useMemo for expensive calculations to avoid recomputation on every render
- Implement useId() for generating unique IDs for accessibility attributes
- Consider using the new useOptimistic hook for optimistic UI updates in forms
- Use useTransition for non-urgent state updates to keep the UI responsive


================================================
FILE: .cursor/rules/shared.mdc
================================================
---
description: 
globs: 
alwaysApply: true
---
# AI Rules for {app-name}

VacationPlanner is a web application that lets users save and manage free-form notes about planned trips, organize them into travel projects, and generate detailed trip itineraries using AI. Users specify the priority of attractions and their planned dates, and the system automatically creates a daily schedule based on their preferences.

## Tech Stack

- Astro 5
- TypeScript 5
- React 19
- Tailwind 4
- Shadcn/ui

## Project Structure

When introducing changes to the project, always follow the directory structure below:

- `./src` - source code
- `./src/layouts` - Astro layouts
- `./src/pages` - Astro pages
- `./src/pages/api` - API endpoints
- `./src/middleware/index.ts` - Astro middleware
- `./src/db` - Supabase clients and types
- `./src/types.ts` - Shared types for backend and frontend (Entities, DTOs)
- `./src/components` - Client-side components written in Astro (static) and React (dynamic)
- `./src/components/ui` - Client-side components from Shadcn/ui
- `./src/lib` - Services and helpers 
- `./src/assets` - static internal assets
- `./public` - public assets

When modifying the directory structure, always update this section.

## Coding practices

### Guidelines for clean code

- Use feedback from linters to improve the code when making changes.
- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Consider using custom error types or error factories for consistent error handling.
- All messages to the user should be in english


================================================
FILE: .cursor/rules/supabase-auth.mdc
================================================
---
description:
globs:
alwaysApply: false
---
# Supabase Auth Integration with Astro

Use this guide to introduce authentication (sign-up & sign-in) in Astro applications with server-side rendering (SSR) support

## Before we start

VERY IMPORTANT: Ask me which pages or components should behave differently after introducing authentication. Adjust further steps accordingly.

## Core Requirements

1. Use `@supabase/ssr` package (NOT auth-helpers)
2. Use ONLY `getAll` and `setAll` for cookie management
3. NEVER use individual `get`, `set`, or `remove` cookie methods
4. Implement proper session management with middleware based on JWT (Supabase Auth)

## Installation

```bash
npm install @supabase/ssr @supabase/supabase-js
```

## Environment Variables

Create `.env` file with required Supabase credentials (based on the snippet below or `.env.example` in project root)

```env
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
```

For better TypeScript support, create or update `src/env.d.ts`:

```typescript
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```
When introducing new env variables or values stored on Astro.locals, always update `src/env.d.ts` to reflect these changes.

Make sure `.env.example` is updated with the correct environment variables.

## Implementation Steps

### 1. Create OR Extend Supabase Server Instance

Update existing Supabase client or create one in `src/db/supabase.client.ts`:

```typescript
import type { AstroCookies } from 'astro';
import { createServerClient, type CookieOptionsWithName } from '@supabase/ssr';
import type { Database } from '../db/database.types.ts';

export const cookieOptions: CookieOptionsWithName = {
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
};

function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  return cookieHeader.split(';').map((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    return { name, value: rest.join('=') };
  });
}

export const createSupabaseServerInstance = (context: {
  headers: Headers;
  cookies: AstroCookies;
}) => {
  const supabase = createServerClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return parseCookieHeader(context.headers.get('Cookie') ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            context.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return supabase;
};
```

### 2. Implement OR Extend Authentication Middleware

Update existing auth middleware or create one in `src/middleware/index.ts`:

```typescript
import { createSupabaseServerInstance } from '../db/supabase.client.ts';
import { defineMiddleware } from 'astro:middleware';

// Public paths - Auth API endpoints & Server-Rendered Astro Pages
const PUBLIC_PATHS = [
  // Server-Rendered Astro Pages
  "/auth/login",
  "/auth/register",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/change-password",
];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, request, redirect }, next) => {
    // Skip auth check for public paths
    if (PUBLIC_PATHS.includes(url.pathname)) {
      return next();
    }

    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // IMPORTANT: Always get user session first before any other operations
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      locals.user = {
        email: user.email,
        id: user.id,
      };
    } else if (!PUBLIC_PATHS.includes(url.pathname)) {
      // Redirect to login for protected routes
      return redirect('/auth/login');
    }

    return next();
  },
);
```

### 3. Create Auth API Endpoints

Create the following endpoints in `src/pages/api/auth/`:

```typescript
// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../db/supabase.client.ts';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ user: data.user }), {
    status: 200,
  });
};

// src/pages/api/auth/register.ts
export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ user: data.user }), {
    status: 200,
  });
};

// src/pages/api/auth/logout.ts
export const POST: APIRoute = async ({ cookies, request }) => {
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(null, { status: 200 });
};
```

### 4. Protect Routes

In protected Astro pages:

```astro
---
// pages/protected.astro
const { user } = Astro.locals;

if (!user) {
  return Astro.redirect('/auth/login');
}
---

<h1>Protected Page</h1>
<p>Welcome {user.email}!</p>
```

### 5. Verify SSR Configuration

Verify whether auth pages are rendered server-side, either by `export const prerender = false;` or by `output: "server"` in `astro.config.mjs`.

## Security Best Practices

- Set proper cookie options (httpOnly, secure, sameSite)
- Never expose Supabase integration & keys in client-side components
- Validate all user input server-side
- Use proper error handling and logging

## Common Pitfalls

1. DO NOT use individual cookie methods (get/set/remove)
2. DO NOT import from @supabase/auth-helpers-nextjs
3. DO NOT skip the auth.getUser() call in middleware
4. DO NOT modify cookie handling logic
5. Always handle auth state changes properly



================================================
FILE: .cursor/rules/ui-shadcn-helper.mdc
================================================
---
description: 
globs: 
alwaysApply: false
---
# Shadcn UI Components

Ten projekt wykorzystuje @shadcn/ui dla komponentów interfejsu użytkownika. Są to pięknie zaprojektowane, dostępne komponenty, które można dostosować do swojej aplikacji.

## Odszukiwanie zainstalowanych komponentów

Komponenty są dostępne w folderze `src/components/ui`, zgodnie z aliasami z pliku `components.json`

## Wykorzystanie komponentu

Zaimportuj komponent zgodnie ze skonfigurowanym aliasem `@/`

```tsx
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
```

Przykładowe wykorzsytanie komponnetów:

```tsx
<Button variant="outline">Click me</Button>

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

## Instalowanie dodatkowych komponentów

Wiele innych komponentów jest dostępnych, ale nie są one obecnie zainstalowane. Pełną listę można znaleźć na stronie https://ui.shadcn.com/r

Aby zainstalować nowy komponent, wykorzystaj shadcn CLI


```bash
npx shadcn@latest add [component-name]
```

Przykładowo, aby dodać komponent accordion

```bash
npx shadcn@latest add accordion
```

Ważne: `npx shadcn-ui@latest` zostało wycofane, korzystaj z `npx shadcn@latest`

Niektóre popularne komponenty to:

- Accordion
- Alert
- AlertDialog
- AspectRatio
- Avatar
- Calendar
- Checkbox
- Collapsible
- Command
- ContextMenu
- DataTable
- DatePicker
- Dropdown Menu
- Form
- Hover Card
- Menubar
- Navigation Menu
- Popover
- Progress
- Radio Group
- ScrollArea
- Select
- Separator
- Sheet
- Skeleton
- Slider
- Switch
- Table
- Textarea
- Sonner (previously Toast)
- Toggle
- Tooltip

## Component Styling

Ten projekt wykorzystuje wariant stylu „new-york” z kolorem bazowym "neutral" i zmiennymi CSS do tworzenia motywów, zgodnie z konfiguracją w sekcji `components.json`.


================================================
FILE: .github/copilot-instructions.md
================================================
# AI Rules for {{project-name}}

{{project-description}}

## Tech Stack

- Astro 5
- TypeScript 5
- React 19
- Tailwind 4
- Shadcn/ui

## Project Structure

When introducing changes to the project, always follow the directory structure below:

- `./src` - source code
- `./src/layouts` - Astro layouts
- `./src/pages` - Astro pages
- `./src/pages/api` - API endpoints
- `./src/middleware/index.ts` - Astro middleware
- `./src/db` - Supabase clients and types
- `./src/types.ts` - Shared types for backend and frontend (Entities, DTOs)
- `./src/components` - Client-side components written in Astro (static) and React (dynamic)
- `./src/components/ui` - Client-side components from Shadcn/ui
- `./src/lib` - Services and helpers
- `./src/assets` - static internal assets
- `./public` - public assets

When modifying the directory structure, always update this section.

## Coding practices

### Guidelines for clean code

- Use feedback from linters to improve the code when making changes.
- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Consider using custom error types or error factories for consistent error handling.

## Frontend

### General Guidelines

- Use Astro components (.astro) for static content and layout
- Implement framework components in React only when interactivity is needed

### Guidelines for Styling

#### Tailwind

- Use the @layer directive to organize styles into components, utilities, and base layers
- Use arbitrary values with square brackets (e.g., w-[123px]) for precise one-off designs
- Implement the Tailwind configuration file for customizing theme, plugins, and variants
- Leverage the theme() function in CSS for accessing Tailwind theme values
- Implement dark mode with the dark: variant
- Use responsive variants (sm:, md:, lg:, etc.) for adaptive designs
- Leverage state variants (hover:, focus-visible:, active:, etc.) for interactive elements

### Guidelines for Accessibility

#### ARIA Best Practices

- Use ARIA landmarks to identify regions of the page (main, navigation, search, etc.)
- Apply appropriate ARIA roles to custom interface elements that lack semantic HTML equivalents
- Set aria-expanded and aria-controls for expandable content like accordions and dropdowns
- Use aria-live regions with appropriate politeness settings for dynamic content updates
- Implement aria-hidden to hide decorative or duplicative content from screen readers
- Apply aria-label or aria-labelledby for elements without visible text labels
- Use aria-describedby to associate descriptive text with form inputs or complex elements
- Implement aria-current for indicating the current item in a set, navigation, or process
- Avoid redundant ARIA that duplicates the semantics of native HTML elements

### Guidelines for Astro

- Leverage View Transitions API for smooth page transitions (use ClientRouter)
- Use content collections with type safety for blog posts, documentation, etc.
- Leverage Server Endpoints for API routes
- Use POST, GET  - uppercase format for endpoint handlers
- Use `export const prerender = false` for API routes
- Use zod for input validation in API routes
- Extract logic into services in `src/lib/services`
- Implement middleware for request/response modification
- Use image optimization with the Astro Image integration
- Implement hybrid rendering with server-side rendering where needed
- Use Astro.cookies for server-side cookie management
- Leverage import.meta.env for environment variables

### Guidelines for React

- Use functional components with hooks instead of class components
- Never use "use client" and other Next.js directives as we use React with Astro
- Extract logic into custom hooks in `src/components/hooks`
- Implement React.memo() for expensive components that render often with the same props
- Utilize React.lazy() and Suspense for code-splitting and performance optimization
- Use the useCallback hook for event handlers passed to child components to prevent unnecessary re-renders
- Prefer useMemo for expensive calculations to avoid recomputation on every render
- Implement useId() for generating unique IDs for accessibility attributes
- Consider using the new useOptimistic hook for optimistic UI updates in forms
- Use useTransition for non-urgent state updates to keep the UI responsive

### Backend and Database

- Use Supabase for backend services, including authentication and database interactions.
- Follow Supabase guidelines for security and performance.
- Use Zod schemas to validate data exchanged with the backend.
- Use supabase from context.locals in Astro routes instead of importing supabaseClient directly
- Use SupabaseClient type from `src/db/supabase.client.ts`, not from `@supabase/supabase-js`


================================================
FILE: .husky/pre-commit
================================================
npx lint-staged



</kod_projektu>

<struktura_projektu>
Directory structure:
└── rsulikowski-10x-vacation-planner/
    ├── README.md
    ├── astro.config.mjs
    ├── components.json
    ├── eslint.config.js
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    ├── .nvmrc
    ├── .prettierrc.json
    ├── .windsurfrules
    ├── docs/
    │   ├── GROQ_IMPLEMENTATION_SUMMARY.md
    │   ├── GROQ_SERVICE_README.md
    │   ├── GROQ_TESTING_GUIDE.md
    │   └── GROQ_USAGE_EXAMPLES.md
    ├── src/
    │   ├── env.d.ts
    │   ├── types.ts
    │   ├── components/
    │   │   ├── DeleteConfirmationDialog.tsx
    │   │   ├── FilterControl.tsx
    │   │   ├── InfiniteScrollGrid.tsx
    │   │   ├── LandingPage.astro
    │   │   ├── LoadingOverlay.tsx
    │   │   ├── NoteCard.tsx
    │   │   ├── NoteDeleteDialog.tsx
    │   │   ├── NoteModal.tsx
    │   │   ├── PaginationControls.tsx
    │   │   ├── ProjectFormModal.tsx
    │   │   ├── ProjectListItem.tsx
    │   │   ├── ProjectsList.tsx
    │   │   ├── ProjectsPage.tsx
    │   │   ├── ProjectView.tsx
    │   │   ├── ScheduleDisplay.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   ├── UserMenu.tsx
    │   │   ├── Welcome.astro
    │   │   ├── auth/
    │   │   │   └── LoginForm.tsx
    │   │   ├── hooks/
    │   │   │   ├── usePlan.ts
    │   │   │   ├── useProjectNotes.ts
    │   │   │   └── useProjectsPage.ts
    │   │   └── ui/
    │   │       ├── alert-dialog.tsx
    │   │       ├── button.tsx
    │   │       ├── card.tsx
    │   │       ├── dialog.tsx
    │   │       ├── dropdown-menu.tsx
    │   │       ├── input.tsx
    │   │       ├── label.tsx
    │   │       ├── select.tsx
    │   │       ├── sonner.tsx
    │   │       ├── tabs.tsx
    │   │       └── textarea.tsx
    │   ├── db/
    │   │   ├── database.types.ts
    │   │   └── supabase.client.ts
    │   ├── layouts/
    │   │   ├── AuthLayout.astro
    │   │   └── Layout.astro
    │   ├── lib/
    │   │   ├── api-utils.ts
    │   │   ├── constants.ts
    │   │   ├── errors.ts
    │   │   ├── groq.service.ts
    │   │   ├── groq.types.ts
    │   │   ├── utils.ts
    │   │   ├── api/
    │   │   │   ├── notes.api.ts
    │   │   │   └── projects.api.ts
    │   │   └── schemas/
    │   │       ├── auth.schema.ts
    │   │       ├── note.schema.ts
    │   │       ├── plan.schema.ts
    │   │       └── project.schema.ts
    │   ├── middleware/
    │   │   └── index.ts
    │   ├── pages/
    │   │   ├── index.astro
    │   │   ├── api/
    │   │   │   ├── auth/
    │   │   │   │   ├── login.ts
    │   │   │   │   └── logout.ts
    │   │   │   └── projects/
    │   │   │       ├── index.ts
    │   │   │       └── [projectId]/
    │   │   │           ├── index.ts
    │   │   │           ├── plan.ts
    │   │   │           └── notes/
    │   │   │               ├── [noteId].ts
    │   │   │               └── index.ts
    │   │   ├── auth/
    │   │   │   └── login.astro
    │   │   └── projects/
    │   │       ├── index.astro
    │   │       └── [projectId]/
    │   │           └── notes.astro
    │   ├── services/
    │   │   ├── ai.service.mock.ts
    │   │   ├── ai.service.ts
    │   │   ├── note.service.ts
    │   │   ├── plan.service.ts
    │   │   └── project.service.ts
    │   └── styles/
    │       └── global.css
    ├── supabase/
    │   ├── config.toml
    │   └── migrations/
    │       ├── 20251012120000_initial_schema.sql
    │       ├── 20251016143000_add_request_metadata_to_ai_logs.sql
    │       └── 20251105_enable_rls_policies.sql
    ├── .ai/
    │   ├── api-plan.md
    │   ├── API_QUICK_REFERENCE.md
    │   ├── auth-spec.md
    │   ├── AUTHENTICATION_IMPLEMENTATION_GUIDE.md
    │   ├── db-plan.md
    │   ├── env-setup-guide.md
    │   ├── generation-endpoint-implementation-plan.md
    │   ├── groq-service-implementation-plan.md
    │   ├── implementation-summary.md
    │   ├── IMPLEMENTATION_COMPLETE.md
    │   ├── MVP.md
    │   ├── note-creation-tests.md
    │   ├── notes-list-view-implementation-plan.md
    │   ├── plan-tab-view-implementation-plan.md
    │   ├── postman-testing-guide.md
    │   ├── prd-eng.md
    │   ├── prd.md
    │   ├── PRD_summary.md
    │   ├── project-cheatsheet.md
    │   ├── project-creation-tests.md
    │   ├── projects-list-view-implementation-plan.md
    │   ├── QUICKSTART.md
    │   ├── session-notes.md
    │   ├── tech-stack.md
    │   ├── test-data-setup.sql
    │   ├── ui-plan.md
    │   └── implementation-plans/
    │       ├── all-endpoints-tests.md
    │       ├── endpoints-summary.md
    │       ├── get-project.md
    │       ├── list-projects-tests.md
    │       ├── list-projects.md
    │       ├── note-creation-implementation-plan.md
    │       ├── notes-endpoints.md
    │       ├── project-creation-implementation-plan.md
    │       └── update-project.md
    ├── .cursor/
    │   └── rules/
    │       ├── api-supabase-astro-init.mdc
    │       ├── astro.mdc
    │       ├── backend.mdc
    │       ├── db-supabase-migrations.mdc
    │       ├── frontend.mdc
    │       ├── react.mdc
    │       ├── shared.mdc
    │       ├── supabase-auth.mdc
    │       └── ui-shadcn-helper.mdc
    ├── .github/
    │   └── copilot-instructions.md
    └── .husky/
        └── pre-commit

</struktura_projektu>

Twoim zadaniem jest wygenerowanie szczegółowego planu testów, który będzie dostosowany do specyfiki projektu, uwzględniając wykorzystywane technologie, strukturę kodu oraz kluczowe elementy repozytorium. Plan testów powinien być napisany w języku polskim.

Przed stworzeniem planu testów, przeprowadź dogłębną analizę projektu wewnątrz bloku <analiza_projektu> w swoim bloku myślowym. W analizie uwzględnij:

1. Kluczowe komponenty projektu wynikające z analizy kodu:
   - Wymień i opisz główne komponenty projektu
2. Specyfikę stosu technologicznego i jego wpływ na strategię testowania:
   - Przeanalizuj każdy element stosu technologicznego i jego implikacje dla testowania
3. Priorytety testowe bazujące na strukturze repozytorium:
   - Zidentyfikuj i uszereguj obszary testowe według ważności
4. Potencjalne obszary ryzyka wymagające szczególnej uwagi w testach:
   - Wymień potencjalne ryzyka i uzasadnij, dlaczego wymagają specjalnej uwagi

Po zakończeniu analizy, stwórz plan testów wewnątrz bloku <plan_testów>. Plan powinien zawierać:

1. Wprowadzenie i cele testowania
2. Zakres testów
3. Typy testów do przeprowadzenia (np. testy jednostkowe, integracyjne, wydajnościowe)
4. Scenariusze testowe dla kluczowych funkcjonalności
5. Środowisko testowe
6. Narzędzia do testowania
7. Harmonogram testów
8. Kryteria akceptacji testów
9. Role i odpowiedzialności w procesie testowania
10. Procedury raportowania błędów

Pamiętaj, aby plan testów był:
- Dokładnie dostosowany do kontekstu projektu
- Uwzględniał specyfikę wykorzystywanych technologii
- Priorytetyzował kluczowe elementy repozytorium
- Był napisany w języku polskim
- Prezentował wysoką jakość i profesjonalizm

Rozpocznij od analizy, a następnie przejdź do tworzenia planu testów. Twój końcowy wynik powinien składać się tylko z planu testów i nie powinien powielać ani streszczać żadnej pracy wykonanej w bloku analizy projektu.

Przedstaw ten plan w formacie Markdown.