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

