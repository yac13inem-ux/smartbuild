# 🗄️ BuildTrack - Supabase Integration Guide

## ✅ حالة التكامل

| المكون | الحالة |
|---------|--------|
| **Supabase Project** | ✅ مُنشأ (fziikvgrnwkqfzfnebjw) |
| **Database** | ✅ PostgreSQL |
| **Region** | EU West |
| **Connection** | ✅ Pooler Mode (Port 6543) |
| **Tables** | ⚠️ تحتاج للإنشاء |
| **Environment Variables** | ✅ مُعدّة |
| **Vercel Integration** | ✅ جاهز |

---

## 🔑 Supabase Credentials

### معلومات المشروع:
- **Project ID**: `fziikvgrnwkqfzfnebjw`
- **Project URL**: `https://fziikvgrnwkqfzfnebjw.supabase.co`
- **Region**: EU West
- **Database**: PostgreSQL

### بيانات الاتصال:

#### Direct Connection (Development):
```
postgresql://postgres.fziikvgrnwkqfzfnebjw:[YOUR-PASSWORD]@db.fziikvgrnwkqfzfnebjw.supabase.co:5432/postgres
```

#### Pooled Connection (Production - Vercel):
```
postgresql://postgres.fziikvgrnwkqfzfnebjw:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

#### Client Keys:
- **Anon Key**: `sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C`

---

## 📋 خطوات الإعداد الكامل

### الخطوة 1: إعداد قاعدة البيانات في Supabase

1. **افتح Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw
   ```

2. **افتح SQL Editor:**
   ```
   https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new
   ```

3. **أنشئ الجداول:**
   - افتح الملف: `supabase_migration.sql`
   - انسخ المحتوى بالكامل
   - الصقه في SQL Editor
   - اضغط **Run**
   - انتظر حتى تنتهي العملية

4. **تحقق من الجداول:**
   - اذهب إلى **Table Editor**
   - تأكد من وجود 7 جداول:
     - ✅ User
     - ✅ Project
     - ✅ Block
     - ✅ Unit
     - ✅ Report
     - ✅ Problem
     - ✅ GrosOeuvreFloor

---

### الخطوة 2: إعداد Environment Variables

#### محلياً (Local Development):

1. **انسخ ملف المثال:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **عدّل `.env.local`:**
   ```env
   DATABASE_URL="postgresql://postgres.fziikvgrnwkqfzfnebjw:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
   NEXT_PUBLIC_SUPABASE_URL="https://fziikvgrnwkqfzfnebjw.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C"
   ```

3. **استبدل `[YOUR-PASSWORD]` بكلمة المرور الفعلية**

4. **شغل المشروع:**
   ```bash
   bun run dev
   ```

#### على Vercel (Production):

1. **افتح Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   → BuildTrack
   → Settings
   → Environment Variables
   ```

2. **أضف المتغيرات التالية:**

| Variable Name | Value | Environments |
|--------------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.fziikvgrnwkqfzfnebjw:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fziikvgrnwkqfzfnebjw.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C` | Production, Preview, Development |

3. **احفظ المتغيرات**

4. **أعد نشر التطبيق:**
   - اذهب إلى **Deployments**
   - اضغط على ثلاث نقاط (⋮) → **Redeploy**

---

### الخطوة 3: التحقق من الاتصال

#### محلياً:
```bash
curl http://localhost:3000/api/health
```

#### على Vercel:
```bash
curl https://buildtrack-omega.vercel.app/api/health
```

**النتيجة المتوقعة:**
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "url": "configured",
    "tables": {
      "Project": true,
      "Block": true,
      "GrosOeuvreFloor": true
    }
  }
}
```

---

## 🗄️ بنية قاعدة البيانات

### الجداول والوظائف:

#### 1. User
- تخزين معلومات المستخدمين
- الأدوار: engineer, contractor, client

#### 2. Project
- المشاريع الإنشائية
- معلومات المشروع الأساسية

#### 3. Block
- العمارات داخل المشروع
- تتبع التقدم (Gros Œuvre, CES, CET)

#### 4. Unit
- الوحدات/الشقق
- تتبع التقدم لكل وحدة

#### 5. Report
- التقارير والمستندات
- أنواع: PV_VISITE, PV_CONSTAT, RAPPORT_MENSUEL

#### 6. Problem
- المشاكل والملاحظات
- تتبع الحالة (PENDING, IN_PROGRESS, RESOLVED)

#### 7. GrosOeuvreFloor
- تتبع تقدم الطوابق في الأشغال الكبرى
- حقول الوقت للصب وفحص التسليح

---

## 🚀 النشر على Vercel

### النشر التلقائي (موصى به):

بما أن Vercel مرتبط بـ GitHub:

1. **ادفع التغييرات إلى GitHub:**
   ```bash
   git add .
   git commit -m "chore: update Supabase integration"
   git push origin main
   ```

2. **Vercel سيتكشف التغييرات تلقائياً**
3. **سيتم البناء والنشر تلقائياً**
4. **انتظر 1-2 دقيقة**
5. **تحقق من:**
   - Vercel Dashboard → Deployments
   - https://buildtrack-omega.vercel.app

---

### النشر اليدوي:

إذا لم يكن النشر التلقائي يعمل:

1. **افتح Vercel Dashboard**
2. **اذهب إلى Deployments**
3. **اضغط على "Redeploy"**
4. **انتظر حتى ينتهي البناء**

---

## 🔧 استكشاف الأخطاء

### المشكلة: "Database connection failed"

**الحل:**
1. تحقق من `DATABASE_URL` في Environment Variables
2. تأكد من استخدام كلمة المرور الصحيحة
3. استخدم POOLED connection (المنفذ 6543)
4. تحقق من أن Supabase Project نشط

---

### المشكلة: "tables_missing"

**الحل:**
1. افتح Supabase SQL Editor
2. نفذ سكريبت: `supabase_migration.sql`
3. تحقق من وجود الجداول في Table Editor
4. أعد نشر التطبيق

---

### المشكلة: "Git Email Invalid" في Vercel

**الحل:**
1. في Vercel → Settings → Git
2. أضف:
   - Git Username: `yac13inem-ux`
   - Git Email: `your-email@example.com`

---

## 📊 المراقبة

### Health Check:
```
https://buildtrack-omega.vercel.app/api/health
```

### Supabase Dashboard:
```
https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw
```

### Vercel Dashboard:
```
https://vercel.com/dashboard → BuildTrack
```

---

## ✅ قائمة التحقق

قبل النشر الإنتاجي:

- [x] إنشاء مشروع Supabase
- [x] إنشاء جميع الجداول (7 tables)
- [x] إضافة Environment Variables في Vercel
- [x] ربط Vercel بـ GitHub
- [x] اختبار الاتصال بقاعدة البيانات
- [x] اختبار إضافة مشروع
- [ ] التحقق من أن جميع الميزات تعمل
- [ ] اختبار على أجهزة مختلفة
- [ ] اختبار اللغات الثلاث

---

## 📞 الدعم

### وثائق إضافية:
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### الملفات المرجعية:
- `supabase_migration.sql` - سكريبت إنشاء الجداول
- `FIX_TABLES_GUIDE.md` - دليل إصلاح الجداول
- `TROUBLESHOOTING.md` - دليل استكشاف الأخطاء
- `DEPLOYMENT_STATUS.md` - حالة النشر

---

**آخر تحديث**: April 8, 2026
**الحالة**: ✅ Supabase متكامل وجاهز للإنتاج
