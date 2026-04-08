-- Create enum types if they don't exist
CREATE TYPE IF NOT EXISTS "ReportType" AS ENUM ('PV_VISITE', 'PV_CONSTAT', 'RAPPORT_MENSUEL');

CREATE TYPE IF NOT EXISTS "ProblemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');

-- Note: IF NOT EXISTS is not supported in all PostgreSQL versions
-- If the above fails, use these commands instead:

-- DROP TYPE IF EXISTS "ReportType";
-- CREATE TYPE "ReportType" AS ENUM ('PV_VISITE', 'PV_CONSTAT', 'RAPPORT_MENSUEL');

-- DROP TYPE IF EXISTS "ProblemStatus";
-- CREATE TYPE "ProblemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');
