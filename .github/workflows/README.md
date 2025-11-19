# GitHub Actions Workflows

Ten folder zawiera workflow CI/CD dla projektu 10x-vacation-planner.

## Dostępne Workflows

### 1. `ci.yml` - CI/CD Pipeline (Pełny)

**Triggery:**
- Push do branch `main`
- Manualne uruchomienie (workflow_dispatch)

**Joby:**
1. **Lint** - Sprawdzenie jakości kodu (ESLint)
2. **Unit Tests** - Testy jednostkowe (Vitest) z coverage
3. **Build** - Build produkcyjny (Astro)
4. **Summary** - Podsumowanie wyników

**Node Version:** 22.14.0 (zgodnie z .nvmrc)

**Czas wykonania:** ~3-4 min

**Artefakty:**
- Coverage report (30 dni)
- Build output (7 dni)

### 2. `quick-check.yml` - Quick Check (Szybkie Sprawdzenie)

**Triggery:**
- Pull Request do branch `main` lub `develop`

**Joby:**
1. **Quick Validation** - Lint + Unit Tests + Build (bez E2E)

**Czas wykonania:** ~3-4 min

**Kiedy używać:**
- Szybkie sprawdzenie podczas rozwoju
- Feedback na Pull Requests
- Pomija czasochłonne E2E testy

## Konfiguracja

### Wymagane GitHub Secrets

**Aktualnie brak wymaganych secrets** - minimalny setup działa bez dodatkowych zmiennych środowiskowych.

**Opcjonalne (dla przyszłych rozszerzeń):**
- `SUPABASE_URL` - URL instancji Supabase (jeśli build wymaga)
- `SUPABASE_ANON_KEY` - Klucz publiczny Supabase (jeśli build wymaga)
- `GROQ_API_KEY` - Klucz API dla usługi AI (jeśli build wymaga)
- `TEST_USER_EMAIL` - Email testowego użytkownika (dla E2E testów)
- `TEST_USER_PASSWORD` - Hasło testowego użytkownika (dla E2E testów)

Dodaj secrets w Settings → Secrets and variables → Actions

### Lokalne testowanie

Aby przetestować workflow lokalnie:

```bash
# Zainstaluj act (narzędzie do lokalnego uruchamiania GitHub Actions)
# https://github.com/nektos/act

# Uruchom workflow lokalnie
act push -W .github/workflows/ci.yml

# Lub z konkretnymi secrets
act push -W .github/workflows/ci.yml --secret-file .env.test
```

## Monitoring

### Sprawdzanie statusu
1. Idź do zakładki "Actions" w repozytorium
2. Zobacz listę wszystkich uruchomień workflow
3. Kliknij na konkretne uruchomienie aby zobaczyć szczegóły

### Debugging nieudanych workflow
1. Sprawdź logi konkretnego joba
2. Pobierz artefakty (screenshots, raporty)
3. Sprawdź czy wszystkie secrets są ustawione
4. Uruchom te same komendy lokalnie

## Best Practices

### Dla Pull Requests
- ✅ Quick Check workflow automatycznie sprawdza każdy PR
- ✅ Upewnij się, że wszystkie sprawdzenia przechodzą przed merge
- ✅ Pełny CI/CD uruchomi się po merge do main

### Dla Main Branch
- ✅ Każdy push do main uruchamia pełny pipeline
- ✅ Nie push'uj bezpośrednio do main - używaj PR
- ✅ Monitoruj status w zakładce Actions

### Dla Hotfixów
- ✅ Możesz uruchomić workflow manualnie z zakładki Actions
- ✅ Wybierz branch i kliknij "Run workflow"

## Troubleshooting

### Workflow nie uruchamia się
- Sprawdź czy `.github/workflows/*.yml` są poprawne (YAML validation)
- Sprawdź czy branch trigger pasuje (main, develop, etc.)

### Testy E2E timeoutują
- Zwiększ timeout w `playwright.config.ts`
- Sprawdź czy aplikacja uruchamia się poprawnie
- Sprawdź logi dev servera w job E2E Tests

### Build fails
- Sprawdź czy wszystkie zmienne środowiskowe są ustawione
- Sprawdź czy build działa lokalnie: `npm run build`
- Sprawdź logi build joba

### Brak artefaktów
- Sprawdź czy job zakończył się (nawet z błędem)
- Artefakty są dostępne tylko przez określony czas (7-30 dni)
- Sprawdź czy `if: always()` jest ustawione dla upload-artifact

## Rozszerzenia

### Dodanie nowych kroków
1. Edytuj odpowiedni workflow file
2. Dodaj nowy step lub job
3. Commit i push
4. Workflow automatycznie użyje nowej wersji

### Dodanie nowego workflow
1. Stwórz nowy plik `.github/workflows/nazwa.yml`
2. Zdefiniuj triggers i jobs
3. Commit i push
4. Nowy workflow pojawi się w zakładce Actions

## Dokumentacja

Pełna dokumentacja CI/CD: [docs/CI_CD_SETUP.md](../../docs/CI_CD_SETUP.md)

## Pomoc

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Astro Documentation](https://astro.build/)

