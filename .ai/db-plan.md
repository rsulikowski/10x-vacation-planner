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
- **prompt**: TEXT NOT NULL (unlimited length for large prompts)
- **response**: JSONB NOT NULL
- **status**: ai_status NOT NULL
- **duration_ms**: INTEGER NULL
- **created_on**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **version**: INTEGER NOT NULL DEFAULT 1

*ENUM type `ai_status` defined as ('pending', 'success', 'failure').*
*Note: `version` is incremented on each AI generation so the latest log has the highest version number.*

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
- BTREE on `ai_logs(project_id, version DESC)`

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
