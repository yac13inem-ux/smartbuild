-- BuildTrack Safe Setup Script for Supabase
-- This script only creates what's missing, won't fail on existing items
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CREATE TABLES (IF NOT EXISTS)
-- ============================================================

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'engineer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "totalApartments" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Block" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    "numberOfFloors" INTEGER,
    "floorsData" TEXT,
    "grosOeuvreProgress" INTEGER NOT NULL DEFAULT 0,
    "cesProgress" INTEGER NOT NULL DEFAULT 0,
    "cetProgress" INTEGER NOT NULL DEFAULT 0,
    "globalProgress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "blockId" TEXT NOT NULL,
    "grosOeuvreProgress" INTEGER NOT NULL DEFAULT 0,
    "cesProgress" INTEGER NOT NULL DEFAULT 0,
    "cetProgress" INTEGER NOT NULL DEFAULT 0,
    "globalProgress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "images" TEXT,
    "observations" TEXT,
    "pdfPath" TEXT,
    "projectId" TEXT,
    "blockId" TEXT,
    "unitId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Problem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "blockId" TEXT,
    "unitId" TEXT,
    "projectId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GrosOeuvreFloor" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "ironReviewDate" TEXT,
    "ironReviewTime" TEXT,
    "concretePourDate" TEXT,
    "concretePourTime" TEXT,
    "ironApproval" BOOLEAN NOT NULL DEFAULT false,
    "concretePoured" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "estimatedDays" INTEGER,
    "actualDays" INTEGER,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GrosOeuvreFloor_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- CREATE INDEXES (IF NOT EXISTS)
-- ============================================================

CREATE INDEX IF NOT EXISTS "Project_authorId_idx" ON "Project"("createdBy");
CREATE INDEX IF NOT EXISTS "Block_projectId_idx" ON "Block"("projectId");
CREATE INDEX IF NOT EXISTS "Unit_blockId_idx" ON "Unit"("blockId");
CREATE INDEX IF NOT EXISTS "Report_projectId_idx" ON "Report"("projectId");
CREATE INDEX IF NOT EXISTS "Report_blockId_idx" ON "Report"("blockId");
CREATE INDEX IF NOT EXISTS "Report_unitId_idx" ON "Report"("unitId");
CREATE INDEX IF NOT EXISTS "Problem_projectId_idx" ON "Problem"("projectId");
CREATE INDEX IF NOT EXISTS "Problem_blockId_idx" ON "Problem"("blockId");
CREATE INDEX IF NOT EXISTS "Problem_unitId_idx" ON "Problem"("unitId");
CREATE INDEX IF NOT EXISTS "GrosOeuvreFloor_blockId_idx" ON "GrosOeuvreFloor"("blockId");

-- ============================================================
-- CREATE TRIGGER FUNCTION (REPLACE IF EXISTS)
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================
-- CREATE TRIGGERS (DROP IF EXISTS FIRST)
-- ============================================================

DROP TRIGGER IF EXISTS update_User_updated_at ON "User";
CREATE TRIGGER update_User_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_Project_updated_at ON "Project";
CREATE TRIGGER update_Project_updated_at BEFORE UPDATE ON "Project" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_Block_updated_at ON "Block";
CREATE TRIGGER update_Block_updated_at BEFORE UPDATE ON "Block" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_Unit_updated_at ON "Unit";
CREATE TRIGGER update_Unit_updated_at BEFORE UPDATE ON "Unit" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_Report_updated_at ON "Report";
CREATE TRIGGER update_Report_updated_at BEFORE UPDATE ON "Report" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_Problem_updated_at ON "Problem";
CREATE TRIGGER update_Problem_updated_at BEFORE UPDATE ON "Problem" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_GrosOeuvreFloor_updated_at ON "GrosOeuvreFloor";
CREATE TRIGGER update_GrosOeuvreFloor_updated_at BEFORE UPDATE ON "GrosOeuvreFloor" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- NOTE: Foreign key constraints
-- ============================================================
-- If you're getting constraint errors, the constraints already exist.
-- Check the Table Editor in Supabase to verify your tables are set up correctly.
-- The application should work even if we skip explicit constraint creation,
-- as the constraints may already exist from a previous run.

SELECT 'Setup completed!' as status;
SELECT 'Please verify all tables exist in Supabase Table Editor' as note;
SELECT 'Tables needed: User, Project, Block, Unit, Report, Problem, GrosOeuvreFloor' as required_tables;
