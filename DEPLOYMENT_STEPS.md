# 🚀 خطوات النشر على Vercel - Deployment Steps

## ✅ المتطلبات المسبقة (Prerequisites)
- ✅ تم إضافة أنواع enum إلى قاعدة بيانات Supabase
- ✅ تم رفع الكود إلى GitHub
- ✅ جميع المتغيرات البيئية جاهزة

## 📋 خطوات النشر (Deployment Steps)

### الخطوة 1: تسجيل الدخول إلى Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل الدخول بحساب GitHub الخاص بك
3. اضغط على "Add New" -> "Project"

### الخطوة 2: استيراد المستودع (Import Repository)
1. اختر المستودع: `yac13inem-ux/smartbuild`
2. اضغط على "Import"

### الخطوة 3: تكوين البيئة (Environment Variables)

أضف المتغيرات التالية في قسم "Environment Variables":

```bash
# Database Connection (Supabase)
DATABASE_URL=postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL=https://bycjhpqrzyptobgtgxbt.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y2pocHFyenlwdG9iZ3RneGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzI1NTUsImV4cCI6MjA5MTI0ODU1NX0.mNIPbMT4rOa_P3U0xZUZRXw78kfvv0wHg9PbZFV1edY
```

**ملاحظة هامة**: لا تضع علامات التنصيص (" ") حول القيم في Vercel!

### الخطوة 4: إعدادات البناء (Build Settings)

Vercel سيكتشف تلقائياً إعدادات Next.js:

- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `bun install`

### الخطوة 5: النشر (Deploy)

1. اضغط على زر "Deploy"
2. انتظر حتى ينتهي البناء (سيستغرق 2-3 دقائق)
3. عند نجاح النشر، ستحصل على رابط مثل:
   ```
   https://smartbuild-xxx.vercel.app
   ```

## 🧪 بعد النشر - اختبار التطبيق

### اختبار الأقسام:
1. **Dashboard** - يجب أن تعرض الإحصائيات
2. **Projects** - يجب أن تعرض المشاريع
3. **Documents** - جرب إنشاء مستند جديد ✅
4. **Problems** - جرب إنشاء مشكلة جديدة ✅
5. **Settings** - تأكد من عمل الإعدادات

### اختبار إنشاء مستند:
1. افتح قسم Documents
2. اضغط على زر "+"
3. املأ البيانات:
   - العنوان: مثال "Test Report"
   - النوع: اختر أي نوع
   - المشروع: اختر مشروع (اختياري)
   - التاريخ: اختر تاريخ
   - الوصف: اكتب وصف
4. اضغط على "حفظ" (Save)
5. ✅ يجب أن يظهر المستند في القائمة

### اختبار إنشاء مشكلة:
1. افتح قسم Problems
2. اضغط على زر "+"
3. املأ البيانات:
   - الوصف: اكتب وصف المشكلة
   - المشروع: اختر مشروع (اختياري)
   - الحالة: اختر حالة
4. اضغط على "حفظ" (Save)
5. ✅ يجب أن تظهر المشكلة في القائمة

## 🔧 حل المشاكل الشائعة

### إذا فشل النشر:

**خطأ: Database connection error**
- تأكد من صحة `DATABASE_URL`
- تأكد من أن `?pgbouncer=true` موجودة في نهاية الرابط

**خطأ: Build failed**
- تحقق من logs في Vercel
- تأكد من أن جميع الاعتماديات مثبتة

**خطأ: Failed to create report**
- تأكد من أنك قمت بتشغيل كود SQL في Supabase
- تأكد من أن أنواع enum موجودة

### كيفية فتح SQL Editor في Supabase:

1. اذهب إلى: https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt
2. اضغط على "SQL Editor" في القائمة الجانبية
3. اضغط على "New query"
4. الصق الكود التالي وشغله:

```sql
-- Create ReportType enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReportType') THEN
        CREATE TYPE "ReportType" AS ENUM ('PV_VISITE', 'PV_CONSTAT', 'RAPPORT_MENSUEL');
    END IF;
END
$$;

-- Create ProblemStatus enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProblemStatus') THEN
        CREATE TYPE "ProblemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');
    END IF;
END
$$;
```

## 📊 مراقبة التطبيق

بعد النشر، يمكنك:
- عرض Logs في Vercel Dashboard
- مراقبة الأداء في Analytics
- إعداد نشر تلقائي عند كل push إلى GitHub

## 🔄 التحديثات المستقبلية

عندما تريد تحديث التطبيق:
1. قم بالتعديلات المحلية
2. `git add .`
3. `git commit -m "message"`
4. `git push origin main`
5. Vercel سينشر تلقائياً!

## 📱 معلومات المشروع

- **GitHub Repository**: https://github.com/yac13inem-ux/smartbuild
- **Supabase Project**: https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**ملاحظة**: إذا واجهت أي مشاكل بعد النشر، راجع الـ logs في Vercel أو اتصل بالدعم الفني.
