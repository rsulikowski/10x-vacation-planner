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

