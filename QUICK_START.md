# ⚡ نشر التطبيق على Vercel - الخلاصة السريعة

## ابدأ الآن (3 خطوات بسيطة):

### 1️⃣ افتح Vercel واستورد المشروع

```
1. اذهب إلى: https://vercel.com
2. سجل دخولك بحساب GitHub
3. انقر "Add New" → "Project"
4. ابحث عن "BuildTrack" وانقر "Import"
```

### 2️⃣ أنشئ قاعدة بيانات مجانية وأضف DATABASE_URL

```
1. افتح: https://supabase.com
2. سجل حساباً مجانياً
3. انقر "New Project" وانتظر دقيقة
4. Settings → Database → انسخ "Connection String"
5. عد إلى Vercel
6. أضف Environment Variable:
   - Name: DATABASE_URL
   - Value: (الرابط من Supabase)
   - Environment: All
```

### 3️⃣ انشر وأنشئ الجداول

```
1. في Vercel، انقر "Deploy"
2. انتظر 2-3 دقائق
3. افتح Terminal محلياً في مجلد المشروع
4. شغّل:
   DATABASE_URL="رابط-قاعدة-البيانات-من-Supabase" bun run db:push
5. في Vercel، انقر "Redeploy" على آخر deployment
```

## ✅ جرب الآن!

افتح الرابط من Vercel:
- أنشئ مشروع جديد ✅
- أضف عمارة (Block) ✅
- شاهد النسب ✅
- أضف تقرير ✅

## 🔗 الروابط المفيدة:

- **GitHub**: https://github.com/adelbenbelaid091-cpu/BuildTrack
- **VERCEL_DEPLOY_NOW.md**: دليل تفصيلي للنشر الآن
- **VERCEL_SETUP.md**: دليل إعداد بالعربية
- **DEPLOYMENT.md**: دليل شامل بالإنجليزية

## ⏱️ الوقت المتوقع: 15 دقيقة

**تم!** 🎉
