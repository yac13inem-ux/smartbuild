# 📋 دليل إصلاح الجداول المفقودة

## المشكلة:
الـ health check يظهر `tables_missing` لكنك نفذت السكريبت ورأيت رسالة النجاح.

## السبب المحتمل:
السكريبت قد نفذ على قاعدة بيانات مختلفة أو لم يتم حفظ التغييرات بشكل صحيح.

---

## ✅ الحل: تحقق من الجداول ثم أنشئها

### الخطوة 1: تحقق من الجداول الموجودة

1. اذهب إلى: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new
2. انسخ هذا الكود:

```sql
-- List all tables
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

3. الصقه واضغط **Run**
4. **أخبرني أي الجداول تراها في النتيجة؟**

يجب أن ترى:
- User
- Project
- Block
- Unit
- Report
- Problem
- GrosOeuvreFloor

---

### الخطوة 2: إذا كانت الجداول مفقودة، أنشئها

انسخ هذا السكريبت الكامل ونفذه:

```sql
-- Drop tables if they exist (clean start)
DROP TABLE IF EXISTS "GrosOeuvreFloor" CASCADE;
DROP TABLE IF EXISTS "Problem" CASCADE;
DROP TABLE IF EXISTS "Report" CASCADE;
DROP TABLE IF EXISTS "Unit" CASCADE;
DROP TABLE IF EXISTS "Block" CASCADE;
DROP TABLE IF EXISTS "Project" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Create User table
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'engineer',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Project table
CREATE TABLE "Project" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "totalApartments" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Block table
CREATE TABLE "Block" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    "numberOfFloors" INTEGER,
    "floorsData" TEXT,
    "grosOeuvreProgress" INTEGER DEFAULT 0,
    "cesProgress" INTEGER DEFAULT 0,
    "cetProgress" INTEGER DEFAULT 0,
    "globalProgress" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Unit table
CREATE TABLE "Unit" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "blockId" TEXT NOT NULL,
    "grosOeuvreProgress" INTEGER DEFAULT 0,
    "cesProgress" INTEGER DEFAULT 0,
    "cetProgress" INTEGER DEFAULT 0,
    "globalProgress" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Report table
CREATE TABLE "Report" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "images" TEXT,
    "observations" TEXT,
    "pdfPath" TEXT,
    "projectId" TEXT,
    "blockId" TEXT,
    "unitId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Problem table
CREATE TABLE "Problem" (
    "id" TEXT PRIMARY KEY,
    "description" TEXT NOT NULL,
    "images" TEXT,
    "status" TEXT DEFAULT 'PENDING',
    "blockId" TEXT,
    "unitId" TEXT,
    "projectId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create GrosOeuvreFloor table
CREATE TABLE "GrosOeuvreFloor" (
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
CREATE INDEX "Project_authorId_idx" ON "Project"("createdBy");
CREATE INDEX "Block_projectId_idx" ON "Block"("projectId");
CREATE INDEX "Unit_blockId_idx" ON "Unit"("blockId");
CREATE INDEX "Report_projectId_idx" ON "Report"("projectId");
CREATE INDEX "Report_blockId_idx" ON "Report"("blockId");
CREATE INDEX "Report_unitId_idx" ON "Report"("unitId");
CREATE INDEX "Problem_projectId_idx" ON "Problem"("projectId");
CREATE INDEX "Problem_blockId_idx" ON "Problem"("blockId");
CREATE INDEX "Problem_unitId_idx" ON "Problem"("unitId");
CREATE INDEX "GrosOeuvreFloor_blockId_idx" ON "GrosOeuvreFloor"("blockId");

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
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

-- Verify tables were created
SELECT '✅ All tables created successfully!' as status;

-- List all tables to verify
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

3. اضغط **Run**
4. انتظر حتى ينتهي التنفيذ
5. يجب أن ترى رسالة: `✅ All tables created successfully!`
6. يجب أن ترى قائمة بجميع الجداول الـ 7

---

### الخطوة 3: تحقق في Table Editor

1. اذهب إلى: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/table-editor
2. يجب أن ترى جميع الجداول الـ 7 على اليسار:
   - ✅ User
   - ✅ Project
   - ✅ Block
   - ✅ Unit
   - ✅ Report
   - ✅ Problem
   - ✅ GrosOeuvreFloor

---

### الخطوة 4: تحقق من Health Check

1. اذهب إلى: https://buildtrack-omega.vercel.app/api/health
2. يجب أن ترى:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "tables": {
      "Project": true,
      "Block": true,
      "GrosOeuvreFloor": true
    }
  }
}
```

---

## 📋 من فضلك أخبرني:

1. **ما الجداول التي تراها في نتيجة الاستعلام (الخطوة 1)؟**
2. **بعد تنفيذ السكريبت (الخطوة 2)، هل ظهرت رسالة النجاح؟**
3. **هل ترى جميع الجداول الـ 7 في Table Editor؟**
4. **ماذا يقول `/api/health` الآن؟**

---

## 🆘 إذا لم تنجح:

إذا استمرت المشكلة، أخبرني بـ:
1. رسالة الخطأ الدقيقة
2. لقطة شاشة من Supabase SQL Editor
3. لقطة شاشة من Table Editor
