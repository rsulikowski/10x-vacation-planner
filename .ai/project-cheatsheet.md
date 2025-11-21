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

📖 **Learn more**: See [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](<downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md>) (lines 108-191)

---

## Phase 0: Choose Your Project

### 1. Select or Analyze Project Idea

Decide which project you'll work on and validate it addresses real problems.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](<downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md>)

🔧 **Prompts**:

- [Analiza pomysłu na projekt](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=9e0681a5-fa5d-42cf-b764-82f16c7e6792)

### 2. Define MVP

Create high-level MVP concept with: main problem, minimum feature set, out-of-scope items, success criteria.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](<downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md>)

---

## Phase 1: Project Planning & Setup

### 3. Create PRD (Product Requirements Document)

Conduct planning session with AI and generate PRD defining user stories with acceptance criteria in `project-prd.md`.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](<downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md>)

🔧 **Prompts**:

- [Asystent planowania PRD](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=002f4b14-aae4-4108-b681-ecbef970ca3f)
- [Podsumowanie sesji planistycznej PRD](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=63d110aa-8f51-40f5-865b-c5f5717fee04)
- [Generowanie kompletnego PRD](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=4ac8b7fe-6c04-4e56-83db-00e5e1d0691d)

### 4. Define Tech Stack

Document chosen technologies and frameworks in `tech-stack.md`.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](<downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md>)

🔧 **Prompts**:

- [Analiza stacku technologicznego](https://10xrules.ai/prompts?org=10xdevs&collection=m2-bootstrap&segment=l1-planning&prompt=65b2fb71-4130-4be0-a0bf-a7532cff39d2)

### 5. Initialize GitHub Repository

Create GitHub repo, initialize with `git init`, add initial commit with context files.

📖 **Lesson**: [downloads/[2x1] Planowanie projektu (Kontekst dla AI).md](<downloads/[2x1]%20Planowanie%20projektu%20(Kontekst%20dla%20AI).md>)

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
