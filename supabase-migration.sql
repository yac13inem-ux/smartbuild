-- ==========================================
-- BuildTrack - Supabase Database Migration
-- ==========================================
-- Run this script in the Supabase SQL Editor
-- https://fziikvgrnwkqfzfnebjw.supabase.co
-- ==========================================

-- Enable UUID extension (for cuid() support)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- Users Table
-- ==========================================
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'engineer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- ==========================================
-- Projects Table
-- ==========================================
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "totalApartments" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT,

    CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==========================================
-- Blocks Table
-- ==========================================
CREATE TABLE IF NOT EXISTS "Block" (
    "id" TEXT PRIMARY KEY,
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

    CONSTRAINT "Block_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==========================================
-- Units Table
-- ==========================================
CREATE TABLE IF NOT EXISTS "Unit" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "blockId" TEXT NOT NULL,
    "grosOeuvreProgress" INTEGER NOT NULL DEFAULT 0,
    "cesProgress" INTEGER NOT NULL DEFAULT 0,
    "cetProgress" INTEGER NOT NULL DEFAULT 0,
    "globalProgress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unit_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==========================================
-- Reports Table
-- ==========================================
CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT PRIMARY KEY,
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
    "authorId" TEXT,

    CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Report_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==========================================
-- Problems Table
-- ==========================================
CREATE TABLE IF NOT EXISTS "Problem" (
    "id" TEXT PRIMARY KEY,
    "description" TEXT NOT NULL,
    "images" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "blockId" TEXT,
    "unitId" TEXT,
    "projectId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Problem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Problem_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Problem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Problem_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==========================================
-- GrosOeuvreFloors Table
-- ==========================================
CREATE TABLE IF NOT EXISTS "GrosOeuvreFloor" (
    "id" TEXT PRIMARY KEY,
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

    CONSTRAINT "GrosOeuvreFloor_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT "GrosOeuvreFloor_blockId_floorNumber_key" UNIQUE ("blockId", "floorNumber")
);

-- ==========================================
-- Create Indexes for Better Performance
-- ==========================================

-- Projects
CREATE INDEX IF NOT EXISTS "Project_authorId_idx" ON "Project"("authorId");

-- Blocks
CREATE INDEX IF NOT EXISTS "Block_projectId_idx" ON "Block"("projectId");

-- Units
CREATE INDEX IF NOT EXISTS "Unit_blockId_idx" ON "Unit"("blockId");

-- Reports
CREATE INDEX IF NOT EXISTS "Report_authorId_idx" ON "Report"("authorId");
CREATE INDEX IF NOT EXISTS "Report_projectId_idx" ON "Report"("projectId");
CREATE INDEX IF NOT EXISTS "Report_blockId_idx" ON "Report"("blockId");
CREATE INDEX IF NOT EXISTS "Report_unitId_idx" ON "Report"("unitId");
CREATE INDEX IF NOT EXISTS "Report_type_idx" ON "Report"("type");

-- Problems
CREATE INDEX IF NOT EXISTS "Problem_projectId_idx" ON "Problem"("projectId");
CREATE INDEX IF NOT EXISTS "Problem_blockId_idx" ON "Problem"("blockId");
CREATE INDEX IF NOT EXISTS "Problem_unitId_idx" ON "Problem"("unitId");
CREATE INDEX IF NOT EXISTS "Problem_createdBy_idx" ON "Problem"("createdBy");
CREATE INDEX IF NOT EXISTS "Problem_status_idx" ON "Problem"("status");

-- GrosOeuvreFloors
CREATE INDEX IF NOT EXISTS "GrosOeuvreFloor_blockId_idx" ON "GrosOeuvreFloor"("blockId");

-- ==========================================
-- Create Trigger for Auto-Updating updatedAt
-- ==========================================

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER "User_updatedAt" BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Project_updatedAt" BEFORE UPDATE ON "Project" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Block_updatedAt" BEFORE UPDATE ON "Block" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Unit_updatedAt" BEFORE UPDATE ON "Unit" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Report_updatedAt" BEFORE UPDATE ON "Report" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Problem_updatedAt" BEFORE UPDATE ON "Problem" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "GrosOeuvreFloor_updatedAt" BEFORE UPDATE ON "GrosOeuvreFloor" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Migration Complete!
-- ==========================================
-- You can now run your BuildTrack application with Supabase
-- ==========================================
