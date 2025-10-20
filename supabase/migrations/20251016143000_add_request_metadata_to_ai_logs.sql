-- =====================================================
-- Migration: Add Request Metadata to ai_logs
-- Description: Adds request_body and response_code columns to ai_logs table
-- Date: 2025-10-16
-- 
-- Purpose:
--   Enhance ai_logs table to capture complete API request/response metadata
--   for better debugging, auditing, and monitoring of AI generation requests.
--
-- Tables Modified:
--   - ai_logs: Add request_body (JSONB) and response_code (INTEGER)
--
-- Backward Compatibility:
--   Existing rows will have NULL values for new columns initially.
--   Application code should handle NULL values for historical records.
-- =====================================================

-- Add request_body column to store the complete API request payload
-- This captures all parameters sent to the AI service (e.g., temperature, model, etc.)
-- JSONB format allows flexible storage and efficient querying of request parameters
alter table ai_logs 
  add column request_body jsonb null;

-- Add response_code column to store HTTP status code from AI service
-- Used for monitoring API health and debugging failed requests
-- Examples: 200 (success), 500 (server error), 429 (rate limit)
alter table ai_logs 
  add column response_code integer null;

-- Add column comments for documentation
comment on column ai_logs.request_body is 'Complete API request payload sent to AI service in JSON format';
comment on column ai_logs.response_code is 'HTTP status code from AI service response (e.g., 200, 500, 429)';

-- =====================================================
-- INDEX MODIFICATION
-- =====================================================

-- Drop the existing index that uses version field
-- The version field is less useful for time-based queries and sorting
drop index if exists idx_ai_logs_project_version;

-- Create new index using created_on for chronological ordering
-- This index optimizes queries that retrieve AI logs by project in chronological order
-- Most common use case: fetching latest AI generation for a project
create index idx_ai_logs_project_created_on on ai_logs(project_id, created_on desc);

comment on index idx_ai_logs_project_created_on is 'Optimizes queries for retrieving AI logs by project in chronological order (latest first)';

-- =====================================================
-- DATA MIGRATION NOTES
-- =====================================================
-- 
-- Existing rows will have NULL values for these columns.
-- Consider running a data migration script if historical records
-- need to be populated with default or reconstructed values.
-- 
-- Example: Set default response_code for successful historical records:
-- update ai_logs 
--   set response_code = 200 
--   where status = 'success' and response_code is null;
-- =====================================================

-- =====================================================
-- END OF MIGRATION
-- =====================================================

