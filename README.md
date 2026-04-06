# BuildTrack - Construction Project Management System

## 📋 نظرة عامة
نظام إدارة المشاريع الإنشائية الشامل مع دعم متعدد اللغات (العربية، الفرنسية، الإنجليزية) وتتبع مفصل للتقدم على مستوى المشاريع والعمارات والطوابق.

## ✨ المميزات الرئيسية

### إدارة المشاريع
- إنشاء وإدارة المشاريع الإنشائية
- تتبع المعلومات الأساسية (الاسم، الموقع، عدد الشقق)
- إدارة عدد العمارات لكل مشروع

### إدارة العمارات
- إضافة عمارات متعددة لكل مشروع
- تحديد عدد الطوابق لكل عمارة
- تتبع التقدم الشامل لكل عمارة

### تتبع الطوابق (Gros Œuvre)
- **الأشغال الكبرى**:
  - نسبة التقدم لكل طابق
  - عدد الشقق لكل طابق
  - تاريخ الصب الخرساني
  - تاريخ فحص التسليح
  - ملاحظات الأشغال الكبرى

### تتبع الطوابق (CES & CET)
- **الأشغال التشطيبية (CES)**:
  - نسبة التقدم لكل طابق
  - ملاحظات الأشغال التشطيبية

- **الأشغال التقنية (CET)**:
  - نسبة التقدم لكل طابق
  - ملاحظات الأشغال التقنية

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+ 
- Bun أو npm
- Prisma CLI

### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/adelbenbelaid091-cpu/BuildTrack.git
cd BuildTrack

# تثبيت الاعتماديات
bun install
# أو
npm install

# إعداد قاعدة البيانات
bun run db:push

# تشغيل خادم التطوير
bun run dev
```

التمتع بالتطبيق على: http://localhost:3000

## 📁 هيكل المشروع

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API Routes
│   │   ├── projects/    # إدارة المشاريع
│   │   ├── blocks/      # إدارة العمارات
│   │   ├── reports/     # التقارير
│   │   └── problems/    # المشاكل
│   ├── layout.tsx       # التخطيط الرئيسي
│   └── page.tsx         # الصفحة الرئيسية
├── components/          # مكونات React
│   ├── ui/             # مكونات shadcn/ui
│   ├── ProjectList.tsx
│   ├── AddBlockDialog.tsx
│   ├── EditFloorDialog.tsx
│   └── ...
├── lib/                # المكتبات المساعدة
│   ├── db.ts          # Prisma Client
│   ├── i18n.ts        # دعم اللغات
│   └── locales/       # ملفات الترجمة
└── contexts/          # React Contexts
    └── LanguageContext.tsx
```

## 🌍 دعم اللغات

التطبيق يدعم ثلاث لغات:
- العربية (الافتراضية)
- Français (French)
- English

## 🗄️ قاعدة البيانات

يستخدم المشروع Prisma ORM مع SQLite:

```prisma
model Project {
  id              String   @id @default(cuid())
  name            String
  description     String?
  location        String?
  totalApartments Int?
  blocks          Block[]
  // ...
}

model Block {
  id          String   @id @default(cuid())
  name        String
  projectId   String
  numberOfFloors Int?
  floorsData  String?  // JSON
  // ...
}
```

## 🔧 الأوامر المتاحة

```bash
# التطوير
bun run dev          # تشغيل خادم التطوير

# البناء
bun run build        # بناء للإنتاج
bun run start        # تشغيل الإنتاج

# قاعدة البيانات
bun run db:push      # دفع التغييرات لقاعدة البيانات
bun run db:generate  # توليد Prisma Client

# جودة الكود
bun run lint         # فحص الكود
```

## 🚀 النشر على Vercel

> ⚠️ **مهم**: راجع [دليل النشر الشامل](./DEPLOYMENT.md) للحصول على تعليمات مفصلة

### نظرة سريعة:

### طريقة 1: النشر التلقائي عبر GitHub (موصى به)

1. **تأكد من إعداد قاعدة البيانات للإنتاج:**
   ```bash
   # استخدم PostgreSQL أو MySQL للإنتاج
   # أضف DATABASE_URL إلى Environment Variables
   ```

2. **اتصل بمستودع GitHub الخاص بك:**
   - قم بزيارة [vercel.com](https://vercel.com)
   - انقر على "Add New" → "Project"
   - اختر مستودع `BuildTrack` من GitHub

3. **إعدادات النشر:**
   - **Framework Preset**: Next.js
   - **Build Command**: `bun run build`
   - **Install Command**: `bun install && bun run db:generate`

4. **Environment Variables:**
   ```
   DATABASE_URL=<your-production-database-url>
   ```

5. **انقر على Deploy**

### طريقة 2: النشر عبر Vercel CLI

```bash
# تثبيت Vercel CLI
bun install -g vercel

# تسجيل الدخول
vercel login

# النشر
cd BuildTrack
vercel

# للنشر في بيئة الإنتاج
vercel --prod
```

### ملاحظات هامة للنشر:

- ✅ المشروع يستخدم Next.js 16 مع `output: standalone` للإنتاج
- ✅ تم إعداد `vercel.json` للنشر التلقائي
- ✅ جميع API routes تستخدم `await params` للتوافق مع Next.js 16
- ⚠️ يجب استخدام قاعدة بيانات PostgreSQL أو MySQL للإنتاج (وليس SQLite)
- ⚠️ لا تنسَ إضافة `DATABASE_URL` في Environment Variables

### المشاكل الشائعة والحلول

#### ❌ "لا يمكن إضافة شيء" على Vercel

**الحل:**
1. تأكد من إعداد `DATABASE_URL` في Environment Variables
2. تحقق من أن قاعدة البيانات متصلة
3. راجع سجلات Vercel Function Logs
4. تأكد من تشغيل `db:push` لإنشاء الجداول

#### ❌ "النسبة لا تظهر في لوحة التحكم"

**الحل:**
1. تأكد من إضافة عمارات (blocks) للمشروع
2. تحقق من أن `floorsData` محفوظ بشكل صحيح
3. راجع API route: `/api/blocks` للتأكد من البيانات
4. تحقق من Console في المتصفح للأخطاء

#### ❌ "Database connection failed"

**الحل:**
1. تحقق من صحة `DATABASE_URL`
2. تأكد من أن قاعدة البيانات تقبل الاتصالات
3. أضف نطاق IP الخاص بـ Vercel إذا تم تفعيل IP Whitelisting

### للحصول على مساعدة مفصلة:

📖 راجع [DEPLOYMENT.md](./DEPLOYMENT.md) للحصول على:
- إعداد قاعدة بيانات إنتاج (Supabase, Neon, PlanetScale)
- خطوات النشر التفصيلية
- استكشاف الأخطاء وإصلاحها
- استراتيجيات النسخ الاحتياطي

## 📱 التصميم

- **مكتبة UI**: shadcn/ui
- **التصميم**: Tailwind CSS 4
- **الأيقونات**: Lucide React
- **التنبيهات**: Sonner
- **الأدوات**: Framer Motion

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:
1. Fork المستودع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع تحت ترخيص MIT - راجع ملف LICENSE للتفاصيل

## 👥 المطور

BuildTrack by Adel Ben Belaid

---

**ملاحظة**: هذا مشروع في التطوير المستمر. الميزات الجديدة قيد الإضافة.
