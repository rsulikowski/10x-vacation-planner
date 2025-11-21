# Kompleksowy Plan Testów dla Aplikacji "VacationPlanner"

## 1. Wprowadzenie i Cele Testowania

### 1.1. Wprowadzenie

Niniejszy dokument przedstawia kompleksowy plan testów dla aplikacji internetowej "VacationPlanner" w wersji MVP/Alpha. Aplikacja umożliwia zarządzanie notatkami podróżniczymi i generowanie planów wycieczek przy użyciu AI. Plan ten ma na celu zapewnienie, że aplikacja spełnia wymagania funkcjonalne, jest stabilna, bezpieczna i użyteczna dla końcowego użytkownika.

### 1.2. Cele Testowania

Główne cele procesu testowania to:

- **Weryfikacja funkcjonalności**: Potwierdzenie, że wszystkie kluczowe funkcje aplikacji, takie jak uwierzytelnianie, zarządzanie projektami i notatkami (CRUD) oraz generowanie planu AI, działają zgodnie ze specyfikacją.
- **Zapewnienie jakości**: Identyfikacja i zaraportowanie defektów w celu ich naprawy przed wdrożeniem produkcyjnym.
- **Ocena użyteczności**: Sprawdzenie, czy interfejs użytkownika jest intuicyjny i przyjazny.
- **Weryfikacja bezpieczeństwa**: Upewnienie się, że dane użytkowników są odizolowane i chronione, zwłaszcza w kontekście polityk RLS (Row-Level Security) w Supabase.
- **Ocena niezawodności**: Testowanie stabilności aplikacji, zwłaszcza w interakcji z zewnętrznymi usługami (Supabase, GROQ AI).

## 2. Zakres Testów

### 2.1. Funkcjonalności objęte testami:

- **Uwierzytelnianie Użytkownika**:
  - Logowanie za pomocą e-maila i hasła.
  - Wylogowywanie.
  - Ochrona tras (uniemożliwienie dostępu do stron chronionych bez logowania).
  - Przekierowania (np. zalogowanego użytkownika ze strony logowania).
- **Zarządzanie Projektami Podróży**:
  - Tworzenie nowego projektu.
  - Wyświetlanie listy projektów (z paginacją).
  - Edycja istniejącego projektu.
  - Usuwanie projektu (z potwierdzeniem).
- **Zarządzanie Notatkami**:
  - Tworzenie nowej notatki w ramach projektu.
  - Wyświetlanie notatek z infinite scroll.
  - Filtrowanie notatek (po priorytecie i tagach).
  - Edycja istniejącej notatki.
  - Usuwanie notatki (z potwierdzeniem).
- **Generowanie Planu AI**:
  - Inicjowanie generowania planu.
  - Wyświetlanie stanu ładowania (overlay).
  - Poprawne wyświetlanie wygenerowanego harmonogramu.
  - Obsługa błędów z serwisu AI i opcja ponowienia próby.
- **Interfejs Użytkownika (UI)**:
  - Responsywność podstawowych layoutów.
  - Przełączanie motywu (jasny/ciemny).
  - Działanie komponentów UI (modale, menu, powiadomienia toast).

### 2.2. Funkcjonalności wyłączone z testów (w tej fazie):

- Testy wydajnościowe pod dużym obciążeniem (stress tests, load tests).
- Zaawansowane testy penetracyjne i bezpieczeństwa wykraczające poza weryfikację RLS.
- Testy użyteczności z udziałem zewnętrznych grup użytkowników (testy beta).
- Funkcjonalności wyłączone z MVP (np. rejestracja, reset hasła, udostępnianie planów).

## 3. Typy Testów do Przeprowadzenia

Proponuje się strategię opartą na piramidzie testów, aby zapewnić zrównoważone pokrycie przy optymalnym nakładzie pracy.

| Typ Testu                               | Cel i Zakres                                                                                                                                                                                                      | Narzędzia                                                           |
| :-------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Testy Jednostkowe**                   | Weryfikacja małych, izolowanych fragmentów kodu (funkcje, proste komponenty). Skupienie na logice w `groq.service.ts`, `api-utils.ts`, funkcjach walidacyjnych i prostych komponentach UI.                        | Vitest, React Testing Library                                       |
| **Testy Integracyjne**                  | Sprawdzanie współpracy między modułami. Główne obszary: integracja komponentów React z hookami (np. `ProjectsPage` z `useProjectsPage`), integracja serwisów backendowych z bazą danych, weryfikacja polityk RLS. | Vitest, React Testing Library, Supabase Test Helpers                |
| **Testy End-to-End (E2E)**              | Symulacja pełnych przepływów użytkownika w przeglądarce, od logowania do generowania planu. Weryfikacja spójności całej aplikacji.                                                                                | Playwright, Cypress                                                 |
| **Testy API (manualne i automatyczne)** | Bezpośrednie testowanie endpointów API w celu weryfikacji logiki biznesowej, walidacji, obsługi błędów i bezpieczeństwa.                                                                                          | Postman, Newman, Vitest                                             |
| **Testy Dymne (Smoke Tests)**           | Szybki zestaw podstawowych testów uruchamiany po każdym wdrożeniu, aby sprawdzić, czy kluczowe funkcjonalności działają (np. czy aplikacja się uruchamia, czy można się zalogować).                               | Playwright, Cypress                                                 |
| **Testy Regresyjne**                    | Powtarzanie wcześniej wykonanych testów po wprowadzeniu zmian w kodzie, aby upewnić się, że nowe funkcje nie zepsuły istniejących.                                                                                | Zautomatyzowane zestawy testów (jednostkowych, integracyjnych, E2E) |

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

### 4.1. Uwierzytelnianie

- **TC-AUTH-01**: Użytkownik z poprawnymi danymi loguje się pomyślnie i zostaje przekierowany na stronę `/projects`.
- **TC-AUTH-02**: Próba logowania z niepoprawnym hasłem kończy się komunikatem o błędzie.
- **TC-AUTH-03**: Niezalogowany użytkownik próbujący wejść na `/projects` zostaje przekierowany na `/auth/login`.
- **TC-AUTH-04**: Zalogowany użytkownik klika "Logout", zostaje wylogowany i przekierowany na stronę główną.
- **TC-AUTH-05**: Zalogowany użytkownik próbujący wejść na `/auth/login` zostaje przekierowany na `/projects`.

### 4.2. Zarządzanie Projektami i Notatkami (CRUD)

- **TC-CRUD-01**: Użytkownik tworzy nowy projekt, który pojawia się na liście projektów.
- **TC-CRUD-02**: Użytkownik edytuje nazwę projektu, a zmiana jest widoczna na liście.
- **TC-CRUD-03**: Użytkownik usuwa projekt, a po potwierdzeniu projekt znika z listy.
- **TC-CRUD-04**: Użytkownik wchodzi w szczegóły projektu i dodaje nową notatkę, która pojawia się w siatce notatek.
- **TC-CRUD-05**: Użytkownik filtruje notatki po priorytecie, a na liście pozostają tylko pasujące notatki.
- **TC-CRUD-06**: Użytkownik przewija listę notatek do końca, a kolejne notatki są automatycznie doładowywane (infinite scroll).

### 4.3. Generowanie Planu AI

- **TC-AI-01**: Użytkownik z co najmniej jedną notatką klika "Generate Plan", widzi nakładkę ładowania, a następnie wygenerowany harmonogram.
- **TC-AI-02**: Przycisk "Generate Plan" jest nieaktywny, jeśli projekt nie ma żadnych notatek.
- **TC-AI-03**: W przypadku błędu z serwisu AI, użytkownik widzi powiadomienie o błędzie z opcją ponowienia próby.
- **TC-AI-04**: Weryfikacja strukturalna odpowiedzi AI (czy zawiera tablicę `schedule`, a w niej obiekty z polami `day` i `activities`).
- **TC-AI-05**: Sprawdzenie, czy po wygenerowaniu planu w bazie danych (`ai_logs`) pojawił się nowy wpis ze statusem `success`.

### 4.4. Bezpieczeństwo (RLS)

- **TC-SEC-01**: Użytkownik A loguje się i tworzy projekt P1.
- **TC-SEC-02**: Użytkownik B loguje się i nie widzi projektu P1 na swojej liście.
- **TC-SEC-03**: Użytkownik B próbuje uzyskać dostęp do projektu P1 przez bezpośredni URL (`/projects/{ID_P1}/notes`) i zostaje przekierowany lub widzi błąd "nie znaleziono".
- **TC-SEC-04**: Użytkownik B próbuje odwołać się do API projektu P1 (`/api/projects/{ID_P1}`) i otrzymuje błąd 404 (Not Found).

## 5. Środowisko Testowe

- **Środowisko lokalne**: Programiści i testerzy QA uruchamiają aplikację lokalnie, korzystając z lokalnej instancji Supabase (`supabase start`). Wymagane jest posiadanie kluczy API do GROQ w pliku `.env`.
- **Środowisko stagingowe/testowe**: Dedykowany serwer (np. na DigitalOcean) z osobnym projektem Supabase, na którym uruchamiane są automatyczne testy E2E w ramach CI/CD. Środowisko to powinno być jak najbardziej zbliżone do produkcyjnego.
- **Wersje oprogramowania**: Zgodne z plikiem `.nvmrc` (Node.js v22.14.0) i `package.json`.

## 6. Narzędzia do Testowania

| Kategoria                                        | Narzędzie                              | Zastosowanie                                                                                                       |
| :----------------------------------------------- | :------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Testy jednostkowe i integracyjne komponentów** | **Vitest** + **React Testing Library** | Testowanie logiki w hookach, komponentach React i funkcjach pomocniczych.                                          |
| **Testy E2E**                                    | **Playwright**                         | Automatyzacja scenariuszy użytkownika w przeglądarce. Zapewnia nagrywanie testów, zrzuty ekranu i śledzenie wideo. |
| **Testy API**                                    | **Postman**                            | Manualne testowanie API (zgodnie z istniejącą dokumentacją `.ai/postman-testing-guide.md`).                        |
| **Automatyzacja testów API**                     | **Vitest** lub **Newman**              | Uruchamianie kolekcji testów API w sposób zautomatyzowany, w ramach CI/CD.                                         |
| **Zarządzanie testami i błędami**                | **GitHub Issues**                      | Raportowanie i śledzenie defektów.                                                                                 |
| **CI/CD**                                        | **GitHub Actions**                     | Automatyczne uruchamianie testów po każdym pushu i przed każdym wdrożeniem.                                        |

## 7. Harmonogram Testów

Proces testowania będzie prowadzony równolegle do developmentu, zgodnie z metodyką Agile.

- **Faza 1: Testy jednostkowe i API (ciągłe)**
  - Programiści piszą testy jednostkowe dla nowo tworzonej logiki.
  - Tester QA na bieżąco tworzy i wykonuje testy API dla nowych endpointów.
- **Faza 2: Testy integracyjne (po ukończeniu głównych modułów)**
  - Po zintegrowaniu frontendu z backendem dla danej funkcji (np. CRUD projektów), przeprowadzane są testy integracyjne.
- **Faza 3: Testy E2E i regresyjne (przed wydaniem)**
  - W tygodniu poprzedzającym planowane wydanie wersji Alpha, przeprowadzana jest pełna runda testów E2E oraz testów regresyjnych.
- **Faza 4: Testy dymne (po każdym wdrożeniu)**
  - Po każdym wdrożeniu na środowisko stagingowe/produkcyjne uruchamiany jest szybki, zautomatyzowany zestaw testów dymnych.

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria wejścia (rozpoczęcia testów)

- Funkcjonalność została zaimplementowana i przekazana do testów.
- Kod źródłowy został pomyślnie zbudowany i wdrożony na środowisku testowym.

### 8.2. Kryteria wyjścia (zakończenia testów)

- **Wydanie Alpha**:
  - 100% zdefiniowanych scenariuszy testowych dla kluczowych funkcjonalności (happy paths) zostało wykonanych i zakończonych sukcesem.
  - Nie istnieją żadne otwarte błędy o priorytecie krytycznym (blocker) lub wysokim.
  - Pokrycie kodu testami jednostkowymi wynosi co najmniej 50%.
- **Wydanie Produkcyjne (po MVP)**:
  - Wszystkie zdefiniowane scenariusze testowe (w tym przypadki brzegowe) zostały wykonane.
  - Nie istnieją żadne otwarte błędy o priorytecie krytycznym, wysokim lub średnim.
  - Pokrycie kodu testami jednostkowymi i integracyjnymi wynosi co najmniej 70%.

## 9. Role i Odpowiedzialności

- **Inżynier QA (Tester)**:
  - Projektowanie i utrzymanie planu testów.
  - Tworzenie i wykonywanie manualnych i automatycznych scenariuszy testowych (API, E2E).
  - Raportowanie i weryfikacja błędów.
  - Zarządzanie środowiskiem testowym.
- **Deweloperzy**:
  - Tworzenie i utrzymanie testów jednostkowych i integracyjnych.
  - Naprawa zgłoszonych błędów.
  - Wsparcie w konfiguracji środowisk i procesów CI/CD.
- **Project Manager / Product Owner**:
  - Definiowanie priorytetów dla testowanych funkcjonalności i naprawianych błędów.
  - Akceptacja ukończonych funkcjonalności na podstawie wyników testów.

## 10. Procedury Raportowania Błędów

Wszystkie znalezione błędy będą raportowane jako **Issues** w repozytorium GitHub projektu. Każdy raport powinien zawierać:

- **Tytuł**: Krótki, zwięzły opis problemu.
- **Opis**:
  - **Kroki do odtworzenia (Steps to Reproduce)**: Dokładna instrukcja, jak wywołać błąd.
  - **Oczekiwany rezultat (Expected Result)**: Co powinno się wydarzyć.
  - **Aktualny rezultat (Actual Result)**: Co faktycznie się wydarzyło.
- **Środowisko**: Wersja przeglądarki, system operacyjny, środowisko (lokalne/stagingowe).
- **Załączniki**: Zrzuty ekranu, nagrania wideo, logi z konsoli.
- **Priorytet**:
  - **Krytyczny (Blocker)**: Uniemożliwia dalsze testy lub działanie kluczowej funkcji.
  - **Wysoki (High)**: Poważny błąd w kluczowej funkcjonalności.
  - **Średni (Medium)**: Błąd o mniejszym wpływie, który ma obejście.
  - **Niski (Low)**: Drobny błąd kosmetyczny lub literówka.
- **Etykiety (Labels)**: np. `bug`, `frontend`, `backend`, `security`, `ai-integration`.
