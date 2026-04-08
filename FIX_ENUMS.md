# Fix Missing Enum Types in Supabase

## Problem
The Documents and Problems sections cannot create entries because the enum types `ReportType` and `ProblemStatus` are missing from the Supabase database.

## Solution
Run the following SQL commands in your Supabase SQL Editor to add the missing enum types:

```sql
-- Create ReportType enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReportType') THEN
        CREATE TYPE "ReportType" AS ENUM ('PV_VISITE', 'PV_CONSTAT', 'RAPPORT_MENSUEL');
    END IF;
END
$$;

-- Create ProblemStatus enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProblemStatus') THEN
        CREATE TYPE "ProblemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');
    END IF;
END
$$;
```

## Steps to Fix:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Paste and run the SQL commands above
4. After running the SQL, the Documents and Problems sections should work

## What was fixed:
1. ✅ Improved error logging in API routes to show detailed error messages
2. ✅ Updated frontend to display detailed error messages
3. ✅ Identified that enum types were missing from database
4. ✅ Created SQL script to add missing enum types

## Verification:
After running the SQL, try creating a document or problem. It should work without errors.
