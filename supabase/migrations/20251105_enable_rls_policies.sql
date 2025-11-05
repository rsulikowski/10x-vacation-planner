-- =====================================================
-- Migration: Enable Row-Level Security (RLS) Policies
-- Description: Enables RLS on all tables and creates policies for user data isolation
-- Date: 2025-11-05
-- 
-- Purpose:
--   This migration enables authentication-based access control by:
--   1. Enabling RLS on travel_projects, notes, and ai_logs tables
--   2. Creating policies that use auth.uid() for user verification
--   3. Ensuring users can only access their own data
--
-- Prerequisites:
--   - Initial schema migration (20251012120000_initial_schema.sql) completed
--   - Supabase Auth configured and user accounts created
--
-- Testing After Migration:
--   1. Create test user in Supabase Dashboard
--   2. Verify user can only access their own projects
--   3. Verify user cannot access other users' data
-- =====================================================

-- =====================================================
-- ENABLE ROW-LEVEL SECURITY
-- =====================================================

-- Enable RLS on all user-scoped tables
-- Once enabled, NO data is accessible unless explicitly allowed by policies
ALTER TABLE travel_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: travel_projects
-- Purpose: Users can only access their own travel projects
-- =====================================================

-- Policy: Allow authenticated users to SELECT their own projects
CREATE POLICY travel_projects_select_policy
  ON travel_projects
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Allow authenticated users to INSERT their own projects
-- WITH CHECK ensures user_id matches the authenticated user
CREATE POLICY travel_projects_insert_policy
  ON travel_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to UPDATE their own projects
-- USING checks current ownership, WITH CHECK ensures it stays owned by same user
CREATE POLICY travel_projects_update_policy
  ON travel_projects
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to DELETE their own projects
CREATE POLICY travel_projects_delete_policy
  ON travel_projects
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- RLS POLICIES: notes
-- Purpose: Users can only access notes belonging to their projects
-- Strategy: Check project ownership through travel_projects join
-- =====================================================

-- Policy: Allow authenticated users to SELECT notes from their projects
CREATE POLICY notes_select_policy
  ON notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to INSERT notes into their projects
CREATE POLICY notes_insert_policy
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to UPDATE notes in their projects
CREATE POLICY notes_update_policy
  ON notes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to DELETE notes from their projects
CREATE POLICY notes_delete_policy
  ON notes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM travel_projects
      WHERE travel_projects.id = notes.project_id
        AND travel_projects.user_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES: ai_logs
-- Purpose: Users can only access their own AI generation logs
-- Note: Can verify via user_id OR via project ownership
-- Using user_id directly for performance (no join needed)
-- =====================================================

-- Policy: Allow authenticated users to SELECT their own AI logs
CREATE POLICY ai_logs_select_policy
  ON ai_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Allow authenticated users to INSERT their own AI logs
CREATE POLICY ai_logs_insert_policy
  ON ai_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to UPDATE their own AI logs
-- Note: Updates are rare, but included for completeness
CREATE POLICY ai_logs_update_policy
  ON ai_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to DELETE their own AI logs
CREATE POLICY ai_logs_delete_policy
  ON ai_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- VERIFICATION QUERIES (for testing after migration)
-- =====================================================

-- To test RLS policies after migration, run these queries as different users:
-- 
-- 1. Check if RLS is enabled:
--    SELECT tablename, rowsecurity 
--    FROM pg_tables 
--    WHERE schemaname = 'public' 
--    AND tablename IN ('travel_projects', 'notes', 'ai_logs');
--
-- 2. List all policies:
--    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
--    FROM pg_policies
--    WHERE tablename IN ('travel_projects', 'notes', 'ai_logs')
--    ORDER BY tablename, policyname;
--
-- 3. Test data isolation (as authenticated user):
--    SELECT * FROM travel_projects;  -- Should only return user's own projects
--    SELECT * FROM notes;            -- Should only return notes from user's projects
--    SELECT * FROM ai_logs;          -- Should only return user's own AI logs

-- =====================================================
-- END OF MIGRATION
-- =====================================================

