# 🚀 Supabase - بدء سريع (5 دقائق فقط!)

## الخطوة 1: إنشاء Supabase (2 دقيقة)
1. اذهب إلى: https://supabase.com
2. سجّل حساب جديد (GitHub أسرع)
3. اضغط **New Project**
4. الاسم: `buildtrack`
5. كلمة المرور: اختر كلمة قوية واحفظها!
6. المنطقة: اختر الأقرب لموقعك
7. Pricing: **Free**
8. اضغط **Create new project**
9. انتظر 2 دقيقة ⏳

## الخطوة 2: الحصول على DATABASE_URL (1 دقيقة)
1. في Supabase Dashboard
2. **Settings** (يسار) → **Database**
3. ابحث عن **Connection String**
4. اضغط **URI**
5. انسخ الرابط
6. استبدل `[YOUR-PASSWORD]` بكلمة المرور الخاصة بك

الرابط سيكون بهذا الشكل:
```
postgresql://postgres.[PROJECT-ID]:YOUR_PASSWORD@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

## الخطوة 3: إضافة في Vercel (30 ثانية)
1. في Vercel → **Settings** → **Environment Variables**
2. أضف متغير:
   - **Key**: `DATABASE_URL`
   - **Value**: الصق الرابط من Supabase
3. اضغط **Save**

## الخطوة 4: إنشاء الجداول (30 ثانية)
اختر طريقة واحدة:

### الطريقة الأسرع (من جهازك):
```bash
npx prisma db push
```

### أو يدوياً في Supabase:
1. في Supabase Dashboard → **SQL Editor**
2. افتح ملف `SUPABASE_SETUP.md`
3. انسخ كود SQL من "الطريقة 2"
4. الصقه في SQL Editor
5. اضغط **Run**

## الخطوة 5: رفع التغييرات (10 ثواني)
```bash
git add .
git commit -m "Use Supabase"
git push origin main
```

## الخطوة 6: انتظر إعادة النشر
- Vercel سيعيد النشر تلقائياً
- انتظر 1-2 دقيقة ⏳

## ✅ اختبر:
1. افتح التطبيق
2. أنشئ مشروع جديد
3. أنشئ عمارة
4. احفظ البيانات

## 🎉 انتهى!

كل شيء سيعمل الآن! 🚀
