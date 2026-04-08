# 🚨 مشكلة Vercel والحل السريع

## المشكلة
التطبيق لا يعمل على Vercel (لا إنشاء، لا حفظ) لأنه يستخدم **SQLite**.

## ❌ لماذا لا يعمل SQLite على Vercel؟
- Vercel بيئة **serverless**
- كل دالة تعمل في بيئة معزولة
- الملفات لا تُحفظ
- SQLite يعتمد على الملفات

## ✅ الحل - 5 خطوات سريعة:

### 1️⃣ أنشئ قاعدة بيانات PostgreSQL مجانية

**الخيار الأسهل: Vercel Postgres**
1. في Vercel → اذهب إلى مشروعك
2. من القائمة الجانبية اختر **Storage**
3. اضغط **Create Database**
4. اختر **Postgres** وانتظر

### 2️⃣ احصل على DATABASE_URL

1. في صفحة Storage التي فتحتها
2. اضغط على **.env.local**
3. انسخ `DATABASE_URL` بالكامل

### 3️⃣ أضف متغير البيئة في Vercel

1. في Vercel → **Settings** → **Environment Variables**
2. أضف متغير جديد:
   - **Name**: `DATABASE_URL`
   - **Value**: الصق القيمة التي نسختها
3. اضغط **Save**

### 4️⃣ حدّث Prisma Schema

افتح ملف `prisma/schema.prisma` وغيّر السطر 12:

**من:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**إلى:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5️⃣ ارتُب وأعد النشر

```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for Vercel"
git push origin main
```

Vercel سيعيد النشر تلقائياً ✅

---

## ✅ تحقق أن كل شيء يعمل:

1. افتح التطبيق في Vercel
2. حاول إنشاء مشروع جديد
3. حاول إنشاء عمارة
4. حاول حفظ البيانات

---

## 🆘 ما زال لا يعمل؟

### تحقق من الـ Logs:
1. في Vercel → **Deployments**
2. اختر آخر deployment
3. انظر في **Build Logs** و **Function Logs**

### المشاكل الشائعة:

1. **خطأ "No database provider"**
   - تأكد من تحديث `schema.prisma` إلى `postgresql`

2. **خطأ "Connection refused"**
   - تأكد من `DATABASE_URL` صحيح في Environment Variables

3. **Build fails**
   - تحقق من أن جميع التبعيات مُثبتة
   - انظر في Logs لمعرفة السبب

---

## 📚 مزيد من التفاصيل:

لدليل مفصل، اقرأ ملف `VERCEL_SETUP_GUIDE.md`

---

## 🎯 الخيارات الأخرى لقاعدة البيانات:

إذا لم تريد استخدام Vercel Postgres:

- **Supabase**: https://supabase.com (مجاني)
- **Neon**: https://neon.tech (مجاني وسريع)
- **PlanetScale**: https://planetscale.com (MySQL - مجاني)

جميعها تعمل على Vercel! ✅
