# 🚀 SmartBuild - دليل نشر Vercel

## الخطوة 1: إعداد قاعدة البيانات في Supabase

### 1.1 افتح Supabase Dashboard
- اذهب إلى: https://supabase.com/dashboard
- سجل الدخول باستخدام حسابك
- اختر مشروع SmartBuild: `bycjhpqrzyptobgtgxbt`

### 1.2 افتح SQL Editor
- من القائمة الجانبية، انقر على "SQL Editor"
- انقر على "New query"

### 1.3 قم بتشغيل سكريبت الهجرة
- افتح الملف: `supabase-migration.sql` في مشروعك
- انسخ محتوى الملف بالكامل
- الصقه في SQL Editor
- انقر على "Run" لتنفيذ السكريبت
- انتظر حتى تظهر رسالة: "Success. No rows returned"

### 1.4 تحقق من الجداول
- اذهب إلى "Table Editor" في Supabase Dashboard
- يجب أن ترى الجداول التالية:
  - ✅ User
  - ✅ Project
  - ✅ Block
  - ✅ Unit
  - ✅ Report
  - ✅ Problem
  - ✅ GrosOeuvreFloor

---

## الخطوة 2: إعداد Vercel

### 2.1 اذهب إلى Vercel Dashboard
- اذهب إلى: https://vercel.com/dashboard
- إذا لم يكن لديك حساب، قم بالتسجيل

### 2.2 استيراد المشروع من GitHub
- انقر على "Add New" → "Project"
- ابحث عن المستودع: `yac13inem-ux/smartbuild`
- انقر على "Import"

### 2.3 إعدادات المشروع
في قسم "Environment Variables"، أضف المتغيرات التالية:

```
DATABASE_URL=postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://bycjhpqrzyptobgtgxbt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y2pocHFyenlwdG9iZ3RneGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzI1NTUsImV4cCI6MjA5MTI0ODU1NX0.mNIPbMT4rOa_P3U0xZUZRXw78kfvv0wHg9PbZFV1edY
```

### 2.4 إعدادات البناء (Build Settings)
- **Framework Preset**: Next.js
- **Root Directory**: `/` (افتراضي)
- **Build Command**: `bun run build` (سيتم استخدام `next build` تلقائياً)
- **Output Directory**: `.next` (افتراضي)
- **Install Command**: `bun install`

### 2.5 نشر المشروع
- انقر على "Deploy"
- انتظر حتى يكتمل البناء والنشر
- ستحصل على رابط مثل: `https://smartbuild-xxx.vercel.app`

---

## الخطوة 3: التحقق من النشر

### 3.1 تحقق من العمل
- افتح رابط التطبيق
- جرب إنشاء مشروع جديد
- تحقق من حفظ البيانات في قاعدة البيانات

### 3.2 تحقق من السجلات
- في Vercel Dashboard، افتح مشروعك
- انقر على "Logs"
- تأكد من عدم وجود أخطاء

---

## استكشاف الأخطاء وحلها

### ❌ خطأ: "Can't reach database server"
**الحل**: تأكد من أن `DATABASE_URL` صحيح في Vercel Environment Variables

### ❌ خطأ: "Table does not exist"
**الحل**: تأكد من تشغيل سكريبت `supabase-migration.sql` في Supabase SQL Editor

### ❌ خطأ: "Connection timeout"
**الحل**: تأكد من أن Supabase project نشط وقيد التشغيل

---

## معلومات مهمة

### 📌 بيانات Supabase
- **Project URL**: https://bycjhpqrzyptobgtgxbt.supabase.co
- **Database URL (Pooling)**: `postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- **Database URL (Direct)**: `postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y2pocHFyenlwdG9iZ3RneGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzI1NTUsImV4cCI6MjA5MTI0ODU1NX0.mNIPbMT4rOa_P3U0xZUZRXw78kfvv0wHg9PbZFV1edY`

### 📌 ملفات مهمة
- **Database Schema**: `prisma/schema.prisma`
- **Migration Script**: `supabase-migration.sql`
- **Environment Example**: `.env.example`

### 📌 GitHub Repository
- **URL**: https://github.com/yac13inem-ux/smartbuild
- **Branch**: `main`
- **Commits**: 80+ (بعد آخر تحديث)

---

## الميزات المضافة

### ⏰ حقول الوقت في Gros Œuvre
تم إضافة حقول الوقت في:
- وقت مراجعة التسليح (Iron Review Time)
- وقت صب الخرسانة (Concrete Pour Time)

هذه الحقول تظهر الآن تحت حقول التاريخ مباشرة.

### 📊 تتبع شامل للمشاريع
- المشاريع (Projects)
- المباني (Blocks)
- الوحدات (Units)
- الطوابق (Floors)
- التقارير (Reports)
- المشاكل (Problems)

### 🌍 دعم متعدد اللغات
- العربية ✅
- English ✅
- Français ✅

---

## دعم Vercel

لمزيد من المعلومات، راجع:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Integration](https://supabase.com/docs/guides/with-nextjs)

---

**تم إنشاء هذا الدليل بواسطة SmartBuild AI Assistant** 🤖
