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

| Key            | Value              |
| -------------- | ------------------ |
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
