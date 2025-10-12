-- =====================================================
-- Migration: Initial Schema Setup
-- Description: Creates the core database schema for VacationPlanner application
-- Date: 2025-10-12
-- 
-- Tables Created:
--   - travel_projects: User's travel planning projects
--   - notes: Free-form notes for attractions/activities
--   - ai_logs: Audit log for AI-generated itineraries
--
-- Additional Objects:
--   - ai_status enum type
--   - Indexes for query optimization
--   - Trigger for automatic updated_on timestamps
--   - Row-Level Security policies for data isolation
--
-- Prerequisites:
--   - Supabase Auth configured (provides auth.users table and auth.uid() function)
--   - pgcrypto extension for UUID generation
-- =====================================================

-- Enable required extensions
-- pgcrypto provides gen_random_uuid() function for UUID generation
create extension if not exists pgcrypto;

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- ai_status: Tracks the lifecycle of AI generation requests
-- Values:
--   - pending: AI generation request initiated but not completed
--   - success: AI successfully generated itinerary
--   - failure: AI generation failed (used for debugging and retry logic)
create type ai_status as enum ('pending', 'success', 'failure');

-- =====================================================
-- TABLES
-- =====================================================

-- -----------------------------------------------------
-- Table: travel_projects
-- Purpose: Stores user's vacation planning projects
-- Security: User-owned, RLS enabled
-- -----------------------------------------------------
create table travel_projects (
  id uuid primary key default gen_random_uuid(),
  -- Foreign key to Supabase Auth users table
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Project name (e.g., "Summer Trip to Italy")
  name text not null,
  -- Total duration of the trip in days
  duration_days integer not null,
  -- When the project was created
  created_on timestamptz not null default now(),
  -- Optional: the actual planned start date of the trip
  planned_date date null
);

-- Add comment for table documentation
comment on table travel_projects is 'User-owned travel planning projects containing notes and generating AI itineraries';
comment on column travel_projects.duration_days is 'Total number of days for the trip, used for itinerary generation';
comment on column travel_projects.planned_date is 'Actual planned start date of the trip (optional)';

-- -----------------------------------------------------
-- Table: notes
-- Purpose: Free-form notes about attractions, activities, and preferences
-- Security: Inherited from parent travel_projects, RLS enabled
-- -----------------------------------------------------
create table notes (
  id uuid primary key default gen_random_uuid(),
  -- Reference to parent travel project
  project_id uuid not null references travel_projects(id) on delete cascade,
  -- Free-form text content (e.g., "Visit Colosseum, opens at 9am")
  content text not null,
  -- Priority level for AI scheduling: 1 = high, 2 = medium, 3 = low
  priority smallint not null default 2 check (priority between 1 and 3),
  -- Optional tags for location/place names (array for future filtering)
  place_tags text[] null,
  -- Auto-updated timestamp of last modification
  updated_on timestamptz not null default now()
);

-- Add comment for table documentation
comment on table notes is 'Free-form notes about attractions and activities for a travel project';
comment on column notes.priority is 'Priority level for AI itinerary generation: 1 = must-see (high), 2 = should-see (medium), 3 = optional (low)';
comment on column notes.place_tags is 'Array of location/place tags for future filtering and grouping';

-- -----------------------------------------------------
-- Table: ai_logs
-- Purpose: Audit trail of AI-generated itineraries
-- Security: User-owned, RLS enabled
-- Note: Supports versioning - each regeneration increments version
-- -----------------------------------------------------
create table ai_logs (
  id uuid primary key default gen_random_uuid(),
  -- Foreign key to user (denormalized for direct access control)
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Foreign key to the project this generation is for
  project_id uuid not null references travel_projects(id) on delete cascade,
  -- The full prompt sent to the AI (stored for debugging and audit)
  prompt text not null,
  -- The AI response in JSON format (structured itinerary data)
  response jsonb not null,
  -- Current status of the AI generation request
  status ai_status not null,
  -- Time taken for AI to respond in milliseconds (null if pending)
  duration_ms integer null,
  -- Timestamp when the AI generation was initiated
  created_on timestamptz not null default now(),
  -- Version number for tracking regenerations (higher = more recent)
  version integer not null default 1
);

-- Add comment for table documentation
comment on table ai_logs is 'Audit log of AI-generated itineraries with versioning support';
comment on column ai_logs.version is 'Incremented on each regeneration; highest version is the latest itinerary';
comment on column ai_logs.duration_ms is 'AI response time in milliseconds, used for performance monitoring';
comment on column ai_logs.response is 'Structured JSON containing the generated day-by-day itinerary';

-- =====================================================
-- INDEXES
-- =====================================================

-- Index for filtering travel projects by user
create index idx_travel_projects_user_id on travel_projects(user_id);

-- Index for retrieving notes by project (most common query pattern)
create index idx_notes_project_id on notes(project_id);

-- GIN index for efficient array operations on place_tags
create index idx_notes_place_tags on notes using gin(place_tags);

-- Composite index for retrieving latest AI logs by project (version DESC for latest first)
create index idx_ai_logs_project_version on ai_logs(project_id, version desc);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Function to automatically update the updated_on timestamp
-- This ensures notes always have accurate modification timestamps
create or replace function update_updated_on_column()
returns trigger as $$
begin
  new.updated_on = now();
  return new;
end;
$$ language plpgsql;

-- Attach trigger to notes table
-- Fires before any UPDATE operation to refresh the updated_on timestamp
create trigger set_notes_updated_on
  before update on notes
  for each row
  execute function update_updated_on_column();

comment on function update_updated_on_column() is 'Automatically updates updated_on timestamp before row updates';

-- =====================================================
-- ROW-LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all user-scoped tables
-- This ensures users can only access their own data
alter table travel_projects enable row level security;
alter table notes enable row level security;
alter table ai_logs enable row level security;

-- -----------------------------------------------------
-- RLS Policies: travel_projects
-- Purpose: Users can only access their own travel projects
-- -----------------------------------------------------

-- Policy: Allow authenticated users to SELECT their own projects
create policy travel_projects_select_authenticated
  on travel_projects
  for select
  to authenticated
  using (user_id = auth.uid());

-- Policy: Allow authenticated users to INSERT their own projects
create policy travel_projects_insert_authenticated
  on travel_projects
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Policy: Allow authenticated users to UPDATE their own projects
create policy travel_projects_update_authenticated
  on travel_projects
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Policy: Allow authenticated users to DELETE their own projects
create policy travel_projects_delete_authenticated
  on travel_projects
  for delete
  to authenticated
  using (user_id = auth.uid());

-- -----------------------------------------------------
-- RLS Policies: notes
-- Purpose: Users can only access notes belonging to their projects
-- Strategy: Check project ownership through travel_projects join
-- -----------------------------------------------------

-- Policy: Allow authenticated users to SELECT notes from their projects
create policy notes_select_authenticated
  on notes
  for select
  to authenticated
  using (
    exists (
      select 1
      from travel_projects tp
      where tp.id = notes.project_id
        and tp.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to INSERT notes into their projects
create policy notes_insert_authenticated
  on notes
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from travel_projects tp
      where tp.id = notes.project_id
        and tp.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to UPDATE notes in their projects
create policy notes_update_authenticated
  on notes
  for update
  to authenticated
  using (
    exists (
      select 1
      from travel_projects tp
      where tp.id = notes.project_id
        and tp.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from travel_projects tp
      where tp.id = notes.project_id
        and tp.user_id = auth.uid()
    )
  );

-- Policy: Allow authenticated users to DELETE notes from their projects
create policy notes_delete_authenticated
  on notes
  for delete
  to authenticated
  using (
    exists (
      select 1
      from travel_projects tp
      where tp.id = notes.project_id
        and tp.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------
-- RLS Policies: ai_logs
-- Purpose: Users can only access their own AI generation logs
-- Note: Direct user_id check for performance (no join needed)
-- -----------------------------------------------------

-- Policy: Allow authenticated users to SELECT their own AI logs
create policy ai_logs_select_authenticated
  on ai_logs
  for select
  to authenticated
  using (user_id = auth.uid());

-- Policy: Allow authenticated users to INSERT their own AI logs
create policy ai_logs_insert_authenticated
  on ai_logs
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Policy: Allow authenticated users to UPDATE their own AI logs
create policy ai_logs_update_authenticated
  on ai_logs
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Policy: Allow authenticated users to DELETE their own AI logs
create policy ai_logs_delete_authenticated
  on ai_logs
  for delete
  to authenticated
  using (user_id = auth.uid());

-- =====================================================
-- END OF MIGRATION
-- =====================================================

