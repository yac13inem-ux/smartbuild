-- Check if all required tables exist in Supabase
-- Run this in Supabase SQL Editor

-- List all tables in the public schema
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count records in each table
SELECT
    'Project' as table_name,
    COUNT(*) as record_count
FROM "Project"
UNION ALL
SELECT
    'Block' as table_name,
    COUNT(*) as record_count
FROM "Block"
UNION ALL
SELECT
    'Unit' as table_name,
    COUNT(*) as record_count
FROM "Unit"
UNION ALL
SELECT
    'Report' as table_name,
    COUNT(*) as record_count
FROM "Report"
UNION ALL
SELECT
    'Problem' as table_name,
    COUNT(*) as record_count
FROM "Problem"
UNION ALL
SELECT
    'GrosOeuvreFloor' as table_name,
    COUNT(*) as record_count
FROM "GrosOeuvreFloor"
UNION ALL
SELECT
    'User' as table_name,
    COUNT(*) as record_count
FROM "User";

-- Check database version
SELECT version();
