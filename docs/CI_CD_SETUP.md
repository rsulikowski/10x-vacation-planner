# CI/CD Setup - GitHub Actions

## Przegląd

Pipeline CI/CD został zaprojektowany jako minimalny setup, który weryfikuje poprawność działania aplikacji przed wdrożeniem. Pipeline składa się z 5 jobów uruchamianych równolegle lub sekwencyjnie w zależności od zależności.

## Architektura Pipeline

```
┌─────────────┐
│   TRIGGER   │
│ (main push  │
│  or manual) │
└──────┬──────┘
       │
       ├─────────────────┬─────────────────┬─────────────────┐
       ▼                 ▼                 ▼
┌──────────┐      ┌─────────────┐  ┌──────────────┐
│   Lint   │      │ Unit Tests  │  │    Build     │
└─────┬────┘      └──────┬──────┘  └──────┬───────┘
      │                  │                 │
      └──────────────────┴─────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │   Summary   │
                  └─────────────┘
```

## Joby Pipeline

### 1. Lint (Równolegle)
- **Cel**: Weryfikacja jakości kodu
- **Działania**:
  - Uruchomienie ESLint
  - Sprawdzenie zgodności z regułami projektu
- **Node Version**: 22.14.0 (z .nvmrc)
- **Czas trwania**: ~1-2 min

### 2. Unit Tests (Równolegle)
- **Cel**: Uruchomienie testów jednostkowych i integracyjnych
- **Działania**:
  - Testy komponentów React (Vitest + React Testing Library)
  - Generowanie raportu coverage
  - Upload coverage jako artifact
- **Node Version**: 22.14.0 (z .nvmrc)
- **Czas trwania**: ~2-3 min

### 3. Build (Równolegle)
- **Cel**: Weryfikacja czy aplikacja buduje się poprawnie
- **Działania**:
  - Build produkcyjny Astro
  - Upload artefaktów build
- **Node Version**: 22.14.0 (z .nvmrc)
- **Environment**: NODE_ENV=production
- **Czas trwania**: ~2-4 min

### 4. Summary (Sekwencyjnie po wszystkich)
- **Cel**: Podsumowanie wyników wszystkich jobów
- **Działania**:
  - Sprawdzenie statusu wszystkich jobów
  - Wyświetlenie podsumowania
  - Zwrócenie błędu jeśli którykolwiek job się nie powiódł
- **Czas trwania**: ~10 sek

## Triggery

Pipeline może być uruchomiony na dwa sposoby:

### 1. Automatycznie - Push do main branch
```yaml
push:
  branches:
    - main
```

### 2. Manualnie - workflow_dispatch
Możesz uruchomić pipeline manualnie z GitHub UI:
1. Idź do zakładki "Actions" w repozytorium
2. Wybierz workflow "CI/CD Pipeline"
3. Kliknij "Run workflow"
4. Wybierz branch i kliknij "Run workflow"

## Wymagane GitHub Secrets

Aby pipeline działał poprawnie, należy skonfigurować następujące secrets w GitHub:

### Opcjonalne (dla przyszłych rozszerzeń):
- `SUPABASE_URL` - URL instancji Supabase (jeśli build wymaga)
- `SUPABASE_ANON_KEY` - Klucz publiczny Supabase (jeśli build wymaga)
- `GROQ_API_KEY` - Klucz API dla usługi AI (jeśli build wymaga)

**Uwaga**: Obecny minimalny setup nie wymaga żadnych secrets, ponieważ nie uruchamia testów E2E ani nie wymaga zmiennych środowiskowych do build.

### Jak dodać secrets:
1. Idź do Settings → Secrets and variables → Actions
2. Kliknij "New repository secret"
3. Dodaj nazwę i wartość
4. Kliknij "Add secret"

## Artefakty

Pipeline generuje następujące artefakty dostępne przez 7-30 dni:

### Coverage Report (30 dni)
- Raport pokrycia testów jednostkowych
- Format: HTML, JSON, Text
- Ścieżka: `coverage/`

### Build Output (7 dni)
- Zbudowana aplikacja produkcyjna
- Ścieżka: `dist/`

## Lokalne uruchomienie

Aby zreplikować pipeline lokalnie:

```bash
# 1. Lint
npm run lint

# 2. Unit Tests
npm run test:run
npm run test:coverage

# 3. Build
npm run build

# 4. E2E Tests (opcjonalnie, nie w minimalnym CI)
# npm run dev  # w oddzielnym terminalu
# npm run test:e2e
```

## Optymalizacje

### Obecne optymalizacje:
- ✅ Cache npm dependencies (`cache: 'npm'`)
- ✅ Równoległe uruchamianie niezależnych jobów (lint, test, build)
- ✅ Upload tylko niezbędnych artefaktów
- ✅ Node version per-job (zgodnie z .nvmrc: 22.14.0)
- ✅ Environment variables na poziomie job, nie global
- ✅ Użycie `npm ci` zamiast `npm install`
- ✅ Najnowsze wersje GitHub Actions (checkout@v5, setup-node@v6, upload-artifact@v5)

### Możliwe przyszłe optymalizacje:
- 🔄 Dodanie testów E2E (obecnie pominięte dla szybkości)
- 🔄 Matrix builds dla wielu wersji Node.js
- 🔄 Conditional runs (np. skip build jeśli tylko docs się zmieniły)
- 🔄 Composite actions dla powtarzalnych kroków (checkout + setup + install)

## Monitoring i Debugging

### Sprawdzanie statusu
- Status jobów widoczny w zakładce "Actions"
- Każdy job pokazuje logi w czasie rzeczywistym
- Czerwony X = błąd, zielony checkmark = sukces

### Debugging failed builds
1. Sprawdź logi konkretnego joba
2. Pobierz artefakty (screenshots, raporty)
3. Uruchom lokalnie te same komendy
4. Sprawdź czy wszystkie secrets są ustawione

## Czas wykonania

Szacowany całkowity czas pipeline:
- **Minimum**: ~2-3 min (przy szybkim build i bez błędów)
- **Średnio**: ~3-4 min (normalny przebieg)
- **Maksimum**: ~5-6 min (przy wolniejszym build lub retry)

## Integracja z Pull Requests

Obecnie pipeline jest skonfigurowany tylko dla `main` branch. Aby dodać sprawdzanie PR:

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
```

## Status Badge

Dodaj badge do README.md:

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/10x-vacation-planner/workflows/CI%2FCD%20Pipeline/badge.svg)
```

## Troubleshooting

### Problem: E2E testy timeoutują
**Rozwiązanie**: Zwiększ timeout w `playwright.config.ts` lub zmniejsz liczbę workerów w CI

### Problem: Brak zmiennych środowiskowych
**Rozwiązanie**: Sprawdź czy wszystkie wymagane secrets są dodane w GitHub Settings

### Problem: Build fails z błędem pamięci
**Rozwiązanie**: Dodaj `NODE_OPTIONS=--max-old-space-size=4096` do env w job build

### Problem: Flaky E2E tests
**Rozwiązanie**: 
- Playwright ma już `retries: 2` w CI
- Dodaj większe `waitForTimeout` w krytycznych miejscach
- Użyj `page.waitForLoadState('networkidle')`

## Kontakt i wsparcie

W razie problemów z CI/CD:
1. Sprawdź dokumentację GitHub Actions
2. Sprawdź logi w zakładce Actions
3. Sprawdź dokumentację narzędzi (Vitest, Playwright)

