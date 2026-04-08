-- إنشاء الجداول المفقودة فقط
-- نفذ هذا في Supabase SQL Editor

-- Create Project table
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "totalApartments" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create GrosOeuvreFloor table
CREATE TABLE IF NOT EXISTS "GrosOeuvreFloor" (
    "id" TEXT PRIMARY KEY,
    "blockId" TEXT NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "ironReviewDate" TEXT,
    "ironReviewTime" TEXT,
    "concretePourDate" TEXT,
    "concretePourTime" TEXT,
    "ironApproval" BOOLEAN DEFAULT false,
    "concretePoured" BOOLEAN DEFAULT false,
    "notes" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "estimatedDays" INTEGER,
    "actualDays" INTEGER,
    "progress" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Project_authorId_idx" ON "Project"("createdBy");
CREATE INDEX IF NOT EXISTS "GrosOeuvreFloor_blockId_idx" ON "GrosOeuvreFloor"("blockId");

-- Create triggers
DROP TRIGGER IF EXISTS update_Project_updated_at ON "Project";
CREATE TRIGGER update_Project_updated_at BEFORE UPDATE ON "Project" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_GrosOeuvreFloor_updated_at ON "GrosOeuvreFloor";
CREATE TRIGGER update_GrosOeuvreFloor_updated_at BEFORE UPDATE ON "GrosOeuvreFloor" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
SELECT '✅ Missing tables created successfully!' as status;

-- List all tables
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
