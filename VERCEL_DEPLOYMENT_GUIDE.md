# 🚀 BuildTrack - دليل نشر Vercel

## الخطوة 1: إعداد قاعدة البيانات في Supabase

### 1.1 افتح Supabase Dashboard
- اذهب إلى: https://supabase.com/dashboard
- سجل الدخول باستخدام حسابك
- اختر مشروع BuildTrack: `fziikvgrnwkqfzfnebjw`

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
- ابحث عن المستودع: `yac13inem-ux/BuildTrack`
- انقر على "Import"

### 2.3 إعدادات المشروع
في قسم "Environment Variables"، أضف المتغيرات التالية:

```
DATABASE_URL=postgresql://postgres:lL5OvpM9vSzCKYGW@db.fziikvgrnwkqfzfnebjw.supabase.co:5432/postgres
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
- ستحصل على رابط مثل: `https://buildtrack-xxx.vercel.app`

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
- **Project URL**: https://fziikvgrnwkqfzfnebjw.supabase.co
- **Database URL**: `postgresql://postgres:lL5OvpM9vSzCKYGW@db.fziikvgrnwkqfzfnebjw.supabase.co:5432/postgres`
- **Anon Key**: `sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C`

### 📌 ملفات مهمة
- **Database Schema**: `prisma/schema.prisma`
- **Migration Script**: `supabase-migration.sql`
- **Environment Example**: `.env.example`

### 📌 GitHub Repository
- **URL**: https://github.com/yac13inem-ux/BuildTrack
- **Branch**: `main`
- **Commits**: 79+ (بعد آخر تحديث)

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

**تم إنشاء هذا الدليل بواسطة BuildTrack AI Assistant** 🤖
