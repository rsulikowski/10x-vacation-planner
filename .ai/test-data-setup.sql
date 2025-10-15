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

