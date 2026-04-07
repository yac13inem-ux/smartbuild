# 🚀 نشر التطبيق على Vercel الآن - خطوات سريعة

## الطريقة المباشرة (الأسرع) - عبر واجهة الويب

### الخطوة 1: افتح Vercel

1. اذهب إلى: **[vercel.com](https://vercel.com)**
2. سجل دخولك بحساب **GitHub** الخاص بك
3. انقر على زر **"Add New..."** في الزاوية اليمنى العلوية
4. اختر **"Project"**

### الخطوة 2: استيراد المشروع

1. سترى قائمة بمستودعات GitHub الخاصة بك
2. ابحث عن **BuildTrack**
3. انقر على زر **"Import"** بجانب BuildTrack

### الخطوة 3: إعدادات المشروع

سيتحقق Vercel تلقائياً من الإعدادات. تأكد من:

- **Framework Preset**: Next.js ✅ (يجب أن يُكتشف تلقائياً)
- **Root Directory**: `./` ✅ (افتراضي)
- **Build Command**: `bun run build` ✅
- **Install Command**: `bun install && bun run db:generate` ✅
- **Output Directory**: `.next` ✅

### الخطوة 4: إضافة DATABASE_URL (مهم جداً!)

#### أولاً: إنشاء قاعدة بيانات مجانية (Supabase)

1. افتح [supabase.com](https://supabase.com) في تبويب جديد
2. سجل حساباً مجانياً
3. بعد تسجيل الدخول، انقر **"New Project"**
4. املأ:
   - **Name**: BuildTrack (أو أي اسم)
   - **Database Password**: اختر كلمة مرور قوية واحفظها!
   - **Region**: اختر أقرب منطقة لك (مثلاً North East US)
5. انقر **"Create new project"**
6. انتظر دقيقة أو دقيقتين حتى ينتهي الإنشاء

#### ثانياً: الحصول على DATABASE_URL

1. في Supabase، اذهب إلى **Settings** (الإعدادات) ← **Database**
2. ابحث عن قسم **Connection String**
3. اضغط على **"URI"**
4. انسخ الرابط (سيبدأ بـ `postgresql://`)
5. ستبدو مثل:
   ```
   postgresql://postgres.abc123:YOUR-PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

#### ثالثاً: إضافة DATABASE_URL في Vercel

1. عد إلى تبويب Vercel
2. في قسم **Environment Variables**
3. أضف متغير جديد:
   - **Name**: `DATABASE_URL`
   - **Value**: (الصق الرابط الذي نسخته من Supabase)
   - **Environment**: اختر **All** (Production, Preview, Development)
4. انقر **"Add"**

### الخطوة 5: النشر

1. انقر على زر **"Deploy"** في الأسفل
2. انتظر البناء (سيستغرق 2-3 دقائق)
3. عند اكتمال البناء، ستحصل على رابط مثل:
   ```
   https://buildtrack-xxx.vercel.app
   ```

### الخطوة 6: إنشاء جداول قاعدة البيانات (مهم جداً!)

الآن بعد النشر، يجب إنشاء الجداول في قاعدة البيانات:

#### الطريقة 1: استخدام Terminal محلياً

افتح Terminal في مجلد المشروع وشغّل:

```bash
# استبدل YOUR-DATABASE-URL برابط قاعدة البيانات من Vercel
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-xxx.pooler.supabase.com:6543/postgres" bun run db:push
```

#### الطريقة 2: من خلال Vercel CLI

إذا كنت تريد استخدام Vercel CLI:

```bash
# تثبيت Vercel CLI (إذا لم يكن مثبتاً)
bun install -g vercel

# تسجيل الدخول
vercel login

# سحب متغيرات البيئة
vercel env pull .env.local

# إنشاء الجداول
bun run db:push
```

### الخطوة 7: إعادة النشر

بعد إنشاء الجداول:

1. عد إلى Vercel
2. اذهب إلى **Deployments**
3. انقر على آخر deployment
4. انقر **"..."** (القائمة) ← **"Redeploy"**

## التحقق من النجاح

افتح رابط Vercel وجرب:

✅ **1. إنشاء مشروع جديد**
   - انقر على علامة التبويب "Projects"
   - انقر زر "+" أو "Add Project"
   - أدخل اسم المشروع
   - احفظ

✅ **2. إضافة عمارة (Block)**
   - في صفحة المشروع، انقر "Add Block"
   - أدخل اسم العمارة وعدد الطوابق
   - احفظ

✅ **3. مشاهدة النسب**
   - ستظهر النسب التلقائية (Gros Œuvre, CES, CET)
   - في صفحة Dashboard الرئيسية

✅ **4. إضافة تقرير**
   - انقر على "Documents"
   - انقر "+" أو "Create Document"
   - املأ النموذج
   - احفظ

## المشاكل والحلول السريعة

### ❌ Error: Database connection failed

**الحل:**
1. تحقق من صحة `DATABASE_URL`
2. تأكد من نسخ Connection string الصحيح من Supabase
3. تأكد من إضافة المتغير في Vercel

### ❌ لا يمكن إضافة شيء / "Cannot add anything"

**الحل:**
1. هذا يعني أن الجداول غير موجودة
2. شغّل `bun run db:push` مع DATABASE_URL من الإنتاج (الخطوة 6)
3. أعد نشر التطبيق على Vercel

### ❌ النسب لا تظهر / "Progress not showing"

**الحل:**
1. أنشئ مشروعاً جديداً أولاً
2. أضف عمارة (Block) للمشروع
3. النسب ستظهر تلقائياً بعد إضافة بيانات

### ❌ Build Error في Vercel

**الحل:**
1. تأكد من أن Install Command هو: `bun install && bun run db:generate`
2. تأكد من وجود `DATABASE_URL` في Environment Variables أثناء البناء
3. تحقق من سجلات البناء في Vercel

## مراقبة الأخطاء

### عرض السجلات في Vercel:

1. اذهب إلى Vercel → Deployments
2. انقر على deployment الأخير
3. انقر **"Logs"**
4. ابحث عن أخطاء حمراء

### عرض سجلات قاعدة البيانات:

1. اذهب إلى Supabase Dashboard
2. Settings → Database → Logs

## الخلاصة

الخطوات المهمة:
1. ✅ استيراد BuildTrack في Vercel
2. ✅ إنشاء قاعدة بيانات مجانية على Supabase
3. ✅ إضافة DATABASE_URL في Environment Variables
4. ✅ النشر على Vercel
5. ✅ تشغيل `bun run db:push` لإنشاء الجداول
6. ✅ إعادة النشر
7. ✅ اختبار التطبيق

**الوقت المتوقع:** 15-20 دقيقة

---

🎉 بعد إكمال هذه الخطوات، سيكون تطبيقك يعمل على Vercel!

**للمساعدة الإضافية:**
- اقرأ `VERCEL_SETUP.md` - دليل بالعربية
- اقرأ `DEPLOYMENT.md` - دليل مفصل بالإنجليزية
- اقرأ `README.md` - دليل المستخدم الشامل
