# 🚀 إعداد التطبيق على Vercel - خطوات سريعة

## الخطوة 1: إعداد قاعدة البيانات (مهم جداً!)

الخطوة الأهم! بدون قاعدة بيانات صحيحة، لن يعمل التطبيق.

### الخيار الأسرع: Supabase (مجاني)

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساباً مجانياً
3. انقر "New Project"
4. اختر كلمة مرور قوية
5. انتظر حتى ينتهي الإنشاء (دقيقة واحدة)

**احصل على DATABASE_URL:**
- اذهب إلى Settings → Database
- انسخ "Connection string" (PostgreSQL)
- سيكون مثل: `postgresql://postgres.xxxx:password@aws-0-xxx.pooler.supabase.com:6543/postgres`

## الخطوة 2: إعداد Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخولك بحساب GitHub
3. انقر "Add New..." → "Project"
4. اختر مستودع **BuildTrack** من GitHub
5. انقر "Import"

## الخطوة 3: إضافة Environment Variables

في Vercel، بعد استيراد المشروع:

1. في قسم "Environment Variables"
2. أضف المتغير التالي:

```
Name: DATABASE_URL
Value: (ضع رابط قاعدة البيانات من Supabase هنا)
Environment: All (Production, Preview, Development)
```

**مثال:**
```
DATABASE_URL=postgresql://postgres.abc123:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## الخطوة 4: إعدادات البناء

تأكد من هذه الإعدادات في Vercel:

- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `bun run build`
- **Install Command**: `bun install && bun run db:generate`
- **Output Directory**: `.next`

## الخطوة 5: إنشاء جداول قاعدة البيانات (مهم!)

بعد النشر الأولي، يجب إنشاء الجداول:

### الطريقة 1: عبر Vercel CLI

1. ثبت Vercel CLI:
```bash
bun install -g vercel
```

2. سجل الدخول:
```bash
vercel login
```

3. اجلب متغيرات البيئة:
```bash
vercel env pull .env.local
```

4. شغّل الـ migration:
```bash
bun run db:push
```

### الطريقة 2: يدوياً

1. اذهب إلى Vercel → Settings → Environment Variables
2. انسخ قيمة `DATABASE_URL`
3. في مجلد المشروع المحلي، شغّل:
```bash
DATABASE_URL="your-database-url-from-vercel" bun run db:push
```

## الخطوة 6: إعادة النشر

بعد إنشاء الجداول:

1. اذهب إلى Vercel → Deployments
2. انقر على آخر deployment
3. انقر "Redeploy"

## التحقق من العمل

بعد النشر:

1. افتح الرابط المقدم من Vercel
2. جرب:
   - ✅ إنشاء مشروع جديد
   - ✅ إضافة عمارة (Block)
   - ✅ إضافة تقرير
   - ✅ إضافة مشكلة

## المشاكل والحلول

### ❌ "Database connection failed"

**السبب:** `DATABASE_URL` غير صحيح

**الحل:**
1. تحقق من صحة رابط قاعدة البيانات
2. تأكد أنك نسخت Connection string الصحيح من Supabase
3. تأكد من إضافة المتغير في Vercel

### ❌ "Cannot add anything" / "لا يمكن إضافة شيء"

**السبب:** الجداول غير موجودة في قاعدة البيانات

**الحل:**
1. شغّل `bun run db:push` مع DATABASE_URL من الإنتاج
2. راجع الخطوة 5 أعلاه

### ❌ "Progress not showing" / "النسبة لا تظهر"

**السبب:** لا توجد بيانات في قاعدة البيانات

**الحل:**
1. أنشئ مشروعاً جديداً
2. أضف عمارة (Block) للمشروع
3. أضف بيانات الطوابق
4. النسب ستظهر تلقائياً

### ❌ Build Error

**السبب:** مشكلة في الاعتماديات

**الحل:**
1. تأكد من أن `installCommand` هو: `bun install && bun run db:generate`
2. تأكد من وجود `DATABASE_URL` أثناء البناء

## مراقبة الأخطاء

### عرض سجلات Vercel:

1. اذهب إلى Vercel → Deployments
2. انقر على deployment الأخير
3. انقر "Logs"
4. ابحث عن أخطاء حمراء

### عرض سجلات قاعدة البيانات (Supabase):

1. اذهب إلى Supabase Dashboard
2. Settings → Database → Logs

## الملفات المهمة

- **DEPLOYMENT.md** - دليل نشر مفصل
- **README.md** - دليل المستخدم الشامل
- **.env.example** - نموذج للمتغيرات البيئية

## الدعم

إذا واجهت مشاكل:

1. راجع [DEPLOYMENT.md](./DEPLOYMENT.md) للتعليمات المفصلة
2. راجع قسم "المشاكل الشائعة" في README.md
3. تحقق من سجلات Vercel
4. تحقق من سجلات قاعدة البيانات

## ملخص سريع

✅ 1. أنشئ قاعدة بيانات على Supabase (مجانية)
✅ 2. اربط GitHub بـ Vercel
✅ 3. أضف DATABASE_URL في Environment Variables
✅ 4. شغّل `bun run db:push` لإنشاء الجداول
✅ 5. أعد نشر التطبيق
✅ 6. جرب إضافة بيانات

**الوقت المتوقع:** 10-15 دقيقة

---

🎉 تم! التطبيق الآن جاهز على Vercel
