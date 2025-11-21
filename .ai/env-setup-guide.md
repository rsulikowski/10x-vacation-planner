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
