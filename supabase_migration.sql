-- BuildTrack Database Migration Script for Supabase (FIXED)
-- Run this script in Supabase SQL Editor: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Users table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'engineer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Create Projects table
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

-- Create foreign key constraint for Project author
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Project_authorId_fkey'
    ) THEN
        ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey"
        FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Create Blocks table
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

-- Create foreign key for Block
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Block_projectId_fkey'
    ) THEN
        ALTER TABLE "Block" ADD CONSTRAINT "Block_projectId_fkey"
        FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create Units table
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

-- Create foreign key for Unit
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Unit_blockId_fkey'
    ) THEN
        ALTER TABLE "Unit" ADD CONSTRAINT "Unit_blockId_fkey"
        FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create Reports table
CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL, -- PV_VISITE, PV_CONSTAT, RAPPORT_MENSUEL
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

-- Create foreign keys for Report
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Report_authorId_fkey'
    ) THEN
        ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey"
        FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Report_projectId_fkey'
    ) THEN
        ALTER TABLE "Report" ADD CONSTRAINT "Report_projectId_fkey"
        FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Report_blockId_fkey'
    ) THEN
        ALTER TABLE "Report" ADD CONSTRAINT "Report_blockId_fkey"
        FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Report_unitId_fkey'
    ) THEN
        ALTER TABLE "Report" ADD CONSTRAINT "Report_unitId_fkey"
        FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create Problems table
CREATE TABLE IF NOT EXISTS "Problem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, RESOLVED
    "blockId" TEXT,
    "unitId" TEXT,
    "projectId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- Create foreign keys for Problem
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Problem_projectId_fkey'
    ) THEN
        ALTER TABLE "Problem" ADD CONSTRAINT "Problem_projectId_fkey"
        FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Problem_blockId_fkey'
    ) THEN
        ALTER TABLE "Problem" ADD CONSTRAINT "Problem_blockId_fkey"
        FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Problem_unitId_fkey'
    ) THEN
        ALTER TABLE "Problem" ADD CONSTRAINT "Problem_unitId_fkey"
        FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'Problem_authorId_fkey'
    ) THEN
        ALTER TABLE "Problem" ADD CONSTRAINT "Problem_authorId_fkey"
        FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Create GrosOeuvreFloors table
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

-- Create foreign key for GrosOeuvreFloor
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'GrosOeuvreFloor_blockId_fkey'
    ) THEN
        ALTER TABLE "GrosOeuvreFloor" ADD CONSTRAINT "GrosOeuvreFloor_blockId_fkey"
        FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create unique constraint for GrosOeuvreFloor (blockId, floorNumber)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'GrosOeuvreFloor_blockId_floorNumber_key'
    ) THEN
        ALTER TABLE "GrosOeuvreFloor" ADD CONSTRAINT "GrosOeuvreFloor_blockId_floorNumber_key"
        UNIQUE ("blockId", "floorNumber");
    END IF;
END $$;

-- Create indexes for better performance
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

-- Create trigger function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop triggers if they exist (to avoid errors on re-run)
DROP TRIGGER IF EXISTS update_User_updated_at ON "User";
DROP TRIGGER IF EXISTS update_Project_updated_at ON "Project";
DROP TRIGGER IF EXISTS update_Block_updated_at ON "Block";
DROP TRIGGER IF EXISTS update_Unit_updated_at ON "Unit";
DROP TRIGGER IF EXISTS update_Report_updated_at ON "Report";
DROP TRIGGER IF EXISTS update_Problem_updated_at ON "Problem";
DROP TRIGGER IF EXISTS update_GrosOeuvreFloor_updated_at ON "GrosOeuvreFloor";

-- Create triggers for all tables
CREATE TRIGGER update_User_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Project_updated_at BEFORE UPDATE ON "Project" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Block_updated_at BEFORE UPDATE ON "Block" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Unit_updated_at BEFORE UPDATE ON "Unit" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Report_updated_at BEFORE UPDATE ON "Report" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_Problem_updated_at BEFORE UPDATE ON "Problem" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_GrosOeuvreFloor_updated_at BEFORE UPDATE ON "GrosOeuvreFloor" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database migration completed successfully!' as status;
