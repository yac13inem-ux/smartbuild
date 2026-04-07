# 🚀 إعداد BuildTrack مع Supabase

## 📋 ما هو Supabase؟
Supabase هو بديل مفتوح المصدر لـ Firebase مع PostgreSQL مجاني!

---

## 🎯 الخطوة 1: إنشاء حساب ومشروع Supabase

### 1.1 إنشاء حساب:
1. اذهب إلى: https://supabase.com
2. اضغط **Start your project**
3. سجّل حساب جديد باستخدام:
   - GitHub (الأسرع)
   - أو Email + Password

### 1.2 إنشاء مشروع جديد:
1. بعد تسجيل الدخول، اضغط **New Project**
2. املأ المعلومات:
   - **Name**: `buildtrack` (أو أي اسم تريده)
   - **Database Password**: اختر كلمة مرور قوية ⚠️ (احفظها!)
   - **Region**: اختر المنطقة الأقرب لجمهورك:
     - **North East US (Virginia)** - إذا معظم مستخدميك في أمريكا/أوروبا
     - **EU West (Ireland)** - إذا معظم مستخدميك في أوروبا/أفريقيا
     - **Southeast Asia (Singapore)** - إذا معظم مستخدميك في آسيا
   - **Pricing Plan**: اختر **Free** (مجاني)
3. اضغط **Create new project**
4. انتظر حوالي **2 دقيقة** حتى تُنشأ قاعدة البيانات ⏳

---

## 🎯 الخطوة 2: الحصول على DATABASE_URL

### 2.1 بعد إنشاء المشروع:
1. ستظهر صفحة **Getting Started**
2. في القائمة الجانبية (يسار)، اختر **Settings** ⚙️
3. ثم اختر **Database**

### 2.2 الحصول على Connection String:
1. في صفحة Database، ابحث عن قسم **Connection String**
2. اضغط على **URI**
3. سترى رابط شبيه بهذا:

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 2.3 تحضير DATABASE_URL:
1. انسخ الرابط بالكامل
2. استبدل `[YOUR-PASSWORD]` بكلمة المرور التي أنشأتها في الخطوة 1.2
3. الرابط النهائي يجب أن يكون بهذا الشكل:

```
postgresql://postgres.[PROJECT-REF]:mypassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**ملاحظة مهمة**: احفظ هذا الرابط! ستحتاجه في الخطوات التالية.

---

## 🎯 الخطوة 3: إضافة DATABASE_URL في Vercel

### 3.1 في لوحة تحكم Vercel:
1. اذهب إلى مشروعك في Vercel
2. من القائمة الجانبية اختر **Settings** ⚙️
3. اختر **Environment Variables**

### 3.2 إضافة المتغير:
1. أضف متغير جديد:
   - **Key**: `DATABASE_URL`
   - **Value**: الصق الرابط الذي حصلت عليه من Supabase
2. اضغط **Save** 💾

### 3.3 التأكد:
- تأكد أن المتغير ظهر في القائمة
- تأكد أن Value صحيح (لا يوجد مسافات إضافية)

---

## 🎯 الخطوة 4: تحديث Prisma Schema

### 4.1 افتح ملف `prisma/schema.prisma`

غيّر **السطر 11-14** من:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

إلى:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4.2 تحديث قاعدة البيانات

في جهازك المحلي، شغّل:

```bash
# توليد Prisma Client
bun run db:generate

# أو
npm run db:generate
```

---

## 🎯 الخطوة 5: إنشاء الجداول في Supabase

### الطريقة 1: باستخدام Prisma (موصى به)

في جهازك المحلي:

```bash
# دفع الـ schema إلى Supabase
bun run db:push

# أو
npx prisma db push
```

هذا الأمر سي:
- ✅ إنشاء جميع الجداول
- ✅ إنشاء جميع العلاقات
- ✅ إعداد كل شيء تلقائياً

### الطريقة 2: يدوياً في Supabase Dashboard

1. اذهب إلى مشروع Supabase
2. من القائمة الجانبية اختر **SQL Editor** 📝
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Project_authorId_idx" ON "Project"("authorId");
CREATE INDEX IF NOT EXISTS "Block_projectId_idx" ON "Block"("projectId");
CREATE INDEX IF NOT EXISTS "GrosOeuvreFloor_blockId_idx" ON "GrosOeuvreFloor"("blockId");
```

5. اضغط **Run** ▶️
6. انتظر حتى يظهر "Success" ✅

---

## 🎯 الخطوة 6: رفع التغييرات إلى GitHub

```bash
# إضافة التغييرات
git add prisma/schema.prisma

# الارتكاب
git commit -m "Switch database to Supabase (PostgreSQL)"

# الرفع
git push origin main
```

---

## 🎯 الخطوة 7: إعادة النشر في Vercel

### تلقائياً:
- Vercel سيعيد النشر تلقائياً بعد الـ push
- انتظر حوالي **1-2 دقيقة** ⏳

### يدوياً:
1. في Vercel، اذهب إلى **Deployments**
2. اضغط **Redeploy**
3. انتظر اكتمال النشر

---

## ✅ الخطوة 8: اختبار التطبيق

### 8.1 افتح التطبيق:
1. في Vercel، اضغط على رابط التطبيق
2. أو افتح: `https://your-app.vercel.app`

### 8.2 اختبر الوظائف:
1. ✅ حاول إنشاء **مشروع جديد**
2. ✅ حاول إنشاء **عمارة (Block)**
3. ✅ حتعديل **تفاصيل الطابق**
4. ✅ حاول حفظ **الوقت** في Gros Œuvre

---

## 🔧 استكشاف الأخطاء

### المشكلة: خطأ "Connection refused"
**الحل**:
1. تأكد من `DATABASE_URL` صحيح في Vercel
2. تحقق أن كلمة المرور في الرابط صحيحة
3. تأكد أن المشروع Supabase نشط (ليس paused)

### المشكلة: خطأ "relation does not exist"
**الحل**:
1. الجداول لم تُنشأ
2. شغّل `bun run db:push` أو استخدم SQL Editor
3. تأكد من إنشاء جميع الجداول

### المشكلة: لا يمكن حفظ البيانات
**الحل**:
1. تحقق من Console في المتصفح
2. تحقق من Logs في Vercel
3. تأكد من أن API Routes تعمل

### المشكلة: Build fails في Vercel
**الحل**:
1. اذهب إلى **Deployments** → آخر deployment
2. اضغط على **Build Logs**
3. ابحث عن الأخطاء
4. تأكد من أن جميع التبعيات مُثبتة

---

## 📊 مراقبة قاعدة البيانات

### في Supabase Dashboard:
1. **Table Editor**: عرض وتعديل البيانات
2. **SQL Editor**: تنفيذ استعلامات SQL
3. **Database**: إعدادات قاعدة البيانات
4. **Logs**: عرض سجلات قاعدة البيانات

### مثال: عرض جميع المشاريع
```sql
SELECT * FROM "Project" ORDER BY "createdAt" DESC;
```

### مثال: عرض جميع العمارات
```sql
SELECT * FROM "Block" ORDER BY "createdAt" DESC;
```

---

## 🔐 الأمان

### النصائح:
1. ✅ لا تشارك `DATABASE_URL` مع أحد
2. ✅ لا تضع `DATABASE_URL` في الكود
3. ✅ استخدم Environment Variables فقط
4. ✅ تفعيل Row Level Security (RLS) إذا احتجت

### تفعيل RLS (اختياري):
```sql
-- في Supabase SQL Editor
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Block" ENABLE ROW LEVEL SECURITY;
```

---

## 💾 النسخ الاحتياطي

### Supabase ينشئ نسخ احتياطية تلقائياً:
- كل يوم للخطة المجانية
- يمكن الاستعادة في أي وقت

### إنشاء نسخة احتياطية يدوياً:
1. في Supabase Dashboard
2. **Settings** → **Database**
3. **Backups**
4. اضغط **Create backup**

---

## 📈 المراقبة والتحليلات

### Supabase Dashboard يوفر:
- **Metrics**: استخدام قاعدة البيانات
- **Logs**: سجلات الأنشطة
- **Performance**: أداء الاستعلامات
- **Storage**: استخدام التخزين

---

## 🆘 الدعم

### إذا واجهت مشاكل:
1. تحقق من **Logs** في Supabase Dashboard
2. تحقق من **Logs** في Vercel
3. راجع هذا الدليل
4. تواصل مع دعم Supabase أو Vercel

---

## 📝 ملخص سريع:

1. 📧 أنشئ حساب Supabase
2. 🏗️ أنشئ مشروع جديد
3. 🔑 احصل على `DATABASE_URL`
4. ⚙️ أضفه في Vercel Environment Variables
5. 🔄 غيّر `provider = "postgresql"` في schema.prisma
6. 🚀 شغّل `bun run db:push` لإنشاء الجداول
7. 📤 Git push
8. ⏳ انتظر إعادة النشر
9. ✅ اختبر التطبيق

---

## 🎉 مبروك!

الآن لديك تطبيق BuildTrack يعمل على Vercel مع Supabase كقاعدة بيانات! 🚀

### المميزات:
- ✅ قاعدة بيانات PostgreSQL مجانية
- ✅ حتى 500 MB تخزين
- ✅ 500,000 قراءة شهرياً
- ✅ 50,000 كتابة شهرياً
- ✅ نسخ احتياطية يومية
- ✅ لوحة تحكم سهلة

### الموارد:
- 📚 [Supabase Docs](https://supabase.com/docs)
- 📚 [Prisma Docs](https://www.prisma.io/docs)
- 📚 [Vercel Docs](https://vercel.com/docs)
