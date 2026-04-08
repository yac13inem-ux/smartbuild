# 🚀 إضافة Supabase في Vercel - خطواتك الأخيرة!

## المعلومات التي قدمتها:
- ✅ كلمة المرور: lL5OvpM9vSzCKYGW
- ✅ Supabase URL: https://fziikvgrnwkqfzfnebjw.supabase.co
- ✅ Publishable Key: sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C

## 🎯 DATABASE_URL جاهز:

```
postgresql://postgres:lL5OvpM9vSzCKYGW@db.fziikvgrnwkqfzfnebjw.supabase.co:5432/postgres
```

## 📝 ما عليك فعله الآن في Vercel:

### الخطوة 1: إضافة DATABASE_URL في Vercel

1. 🌐 اذهب إلى مشروعك في Vercel: https://vercel.com/dashboard
2. اختر مشروع **BuildTrack**
3. من القائمة العلوية، اضغط **Settings** ⚙️
4. من القائمة الجانبية، اختر **Environment Variables**
5. أضف متغير جديد:

```
Key: DATABASE_URL
Value: postgresql://postgres:lL5OvpM9vSzCKYGW@db.fziikvgrnwkqfzfnebjw.supabase.co:5432/postgres
```

6. اضغط **Add**
7. اضغط **Save**

### الخطوة 2: إنشاء الجداول في Supabase

اختر إحدى الطريقتين:

#### الطريقة 1: من جهازك (الأسهل)

في جهازك المحلي، شغّل:

```bash
# تأكد أنك في مجلد المشروع
cd /home/z/my-project

# توليد Prisma Client
bun run db:generate

# دفع الـ schema إلى Supabase
bun run db:push
```

أو باستخدام npx:

```bash
npx prisma generate
npx prisma db push
```

#### الطريقة 2: من Supabase Dashboard

1. 🌐 اذهب إلى: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw
2. 📝 من القائمة الجانبية، اختر **SQL Editor**
3. اضغط **New Query**
4. الصق هذا الكود:

```sql
-- Create all tables
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'engineer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "totalApartments" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,
    CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Block" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Block_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "GrosOeuvreFloor" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GrosOeuvreFloor_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE("blockId", "floorNumber")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Project_authorId_idx" ON "Project"("authorId");
CREATE INDEX IF NOT EXISTS "Block_projectId_idx" ON "Block"("projectId");
CREATE INDEX IF NOT EXISTS "GrosOeuvreFloor_blockId_idx" ON "GrosOeuvreFloor"("blockId");
```

5. اضغط **Run** ▶️
6. انتظر "Success" ✅

### الخطوة 3: إعادة النشر في Vercel

بعد إضافة متغير البيئة:

1. 🌐 اذهب إلى مشروعك في Vercel
2. 📦 من القائمة الجانبية، اختر **Deployments**
3. أضغط **Redeploy** في أعلى اليمين
4. ⏳ انتظر 1-2 دقيقة حتى يكتمل النشر
5. ✅ ستظهر علامة خضراء "Ready"

### الخطوة 4: اختبر التطبيق!

1. 🌐 افتح رابط تطبيق Vercel
2. ➕ حاول إنشاء **مشروع جديد**
3. 🏢 حاول إنشاء **عمارة (Block)**
4. ✏️ حاول تعديل **تفاصيل الطابق**
5. ⏰ حتم حفظ **الوقت** في Gros Œuvre

## ✅ إذا سار كل شيء بشكل صحيح:

- التطبيق يعمل!
- يمكنك إنشاء وحفظ المشاريع
- يمكنك إنشاء وحفظ العمارات
- يمكنك حفظ التواريخ والأوقات
- كل شيء متصل بـ Supabase! 🎉

## 🔧 إذا واجهت مشاكل:

### مشكلة: "Connection refused"
- تحقق من `DATABASE_URL` في Vercel
- تأكد أن كلمة المرور صحيحة
- تأكد أن مشروع Supabase نشط

### مشكلة: "relation does not exist"
- الجداول لم تُنشأ بعد
- شغّل `npx prisma db push` أو استخدم SQL Editor

### مشكلة: لا يمكن حفظ البيانات
- تحقق من Console في المتصفح
- تحقق من Function Logs في Vercel
- تأكد من أن API Routes تعمل

## 🎊 مبروك!

الآن لديك تطبيق BuildTrack يعمل على Vercel مع Supabase! 🚀

### المستخدمون يمكنهم الآن:
- ✅ إنشاء مشاريع
- ✅ إدارة العمارات
- ✅ تتبع Gros Œuvre مع التوقيت
- ✅ حفظ جميع البيانات في Supabase

### روابط مفيدة:
- 🌐 Supabase Dashboard: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw
- 📊 Table Editor: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/editor
- 📝 SQL Editor: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new
- 📈 Database Logs: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/logs/database
