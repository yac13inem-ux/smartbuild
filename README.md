# SmartBuild - نظام إدارة المشاريع الإنشائية الشامل

## 📋 نظرة عامة
نظام إدارة المشاريع الإنشائية الشامل مع دعم متعدد اللغات (العربية، الفرنسية، الإنجليزية) وتتبع مفصل للتقدم على مستوى المشاريع والعمارات والطوابق.

## ✨ المميزات الرئيسية

### إدارة المشاريع
- ✅ إنشاء وإدارة المشاريع الإنشائية
- ✅ تتبع المعلومات الأساسية (الاسم، الموقع، عدد الشقق)
- ✅ إدارة عدد العمارات لكل مشروع

### إدارة العمارات
- ✅ إضافة عمارات متعددة لكل مشروع
- ✅ تحديد عدد الطوابق لكل عمارة
- ✅ تتبع التقدم الشامل لكل عمارة

### تتبع الطوابق (Gros Œuvre)
- ✅ **الأشغال الكبرى**:
  - نسبة التقدم لكل طابق
  - عدد الشقق لكل طابق
  - 🆕 **تاريخ الصب الخرساني** (التاريخ والوقت ⏰)
  - 🆕 **تاريخ فحص التسليح** (التاريخ والوقت ⏰)
  - ملاحظات الأشغال الكبرى

### إدارة التقارير والمشاكل
- ✅ إنشاء وتتبع التقارير (PV_VISITE, PV_CONSTAT, RAPPORT_MENSUEL)
- ✅ إبلاغ عن المشاكل وحلها
- ✅ إرفاق الصور بالمشاكل

## 🚀 التطبيق المباشر

**التطبيق منشور ومتاح على:**
🌐 GitHub Repository: [yac13inem-ux/smartbuild](https://github.com/yac13inem-ux/smartbuild)

**قم بنشر التطبيق على Vercel باستخدام الدليل:**
📖 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

## 🗄️ قاعدة البيانات

يستخدم المشروع **Supabase (PostgreSQL)** في بيئة الإنتاج:

### معلومات المشروع:
- **Project Ref**: `bycjhpqrzyptobgtgxbt`
- **Region**: Europe West 1
- **Dashboard**: [https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt](https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt)

### الجداول الرئيسية:
- `User` - معلومات المستخدمين
- `Project` - المشاريع الإنشائية
- `Block` - العمارات
- `Unit` - الوحدات/الشقق
- `Report` - التقارير والمستندات
- `Problem` - المشاكل والملاحظات
- `GrosOeuvreFloor` - تتبع تقدم الطوابق (بما في ذلك حقول الوقت)

## 🌍 دعم اللغات

التطبيق يدعم ثلاث لغات:
- 🇸🇦 العربية (الافتراضية)
- 🇫🇷 Français (French)
- 🇺🇸 English

## 📁 هيكل المشروع

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API Routes
│   │   ├── projects/    # إدارة المشاريع
│   │   ├── blocks/      # إدارة العمارات
│   │   ├── reports/     # التقارير
│   │   ├── problems/    # المشاكل
│   │   ├── units/       # الوحدات
│   │   └── health/      # فحص صحة النظام
│   ├── layout.tsx       # التخطيط الرئيسي
│   └── page.tsx         # الصفحة الرئيسية
├── components/          # مكونات React
│   ├── ui/             # مكونات shadcn/ui
│   ├── ProjectList.tsx
│   ├── AddBlockDialog.tsx
│   ├── EditFloorDialog.tsx
│   ├── DocumentHub.tsx
│   └── ...
├── lib/                # المكتبات المساعدة
│   ├── db.ts          # Prisma Client
│   ├── i18n.ts        # دعم اللغات
│   └── locales/       # ملفات الترجمة
└── contexts/          # React Contexts
    └── LanguageContext.tsx
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

### الخطوات السريعة:

1. **إعداد قاعدة البيانات**:
   - افتح [Supabase Dashboard](https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt)
   - انتقل إلى SQL Editor
   - شغل سكريبت `supabase-migration.sql`

2. **نشر على Vercel**:
   - اذهب إلى [vercel.com/new](https://vercel.com/new)
   - استورد المستودع: `yac13inem-ux/smartbuild`
   - أضف Environment Variables (انظر أدناه)
   - اضغط Deploy!

### Environment Variables المطلوبة:
```bash
DATABASE_URL="postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://bycjhpqrzyptobgtgxbt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y2pocHFyenlwdG9iZ3RneGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzI1NTUsImV4cCI6MjA5MTI0ODU1NX0.mNIPbMT4rOa_P3U0xZUZRXw78kfvv0wHg9PbZFV1edY"
```

### الدليل الكامل:
📖 راجع [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) للتوضيحات الكاملة

## 🎯 الميزات الجديدة

### حقول الوقت ⏰
- 🆕 إضافة حقول الوقت للتواريخ في قسم Gros Œuvre
- 🆕 عرض التاريخ والوقت بشكل عمودي (سهل القراءة)
- 🆅 دعم لجميع اللغات الثلاث

### الفحص الصحي للنظام
- 🆕 API endpoint لفحص صحة قاعدة البيانات
- 🆕 التحقق من وجود جميع الجداول
- 🆕 تشخيص مشاكل الاتصال

## 📱 التصميم

- **مكتبة UI**: shadcn/ui
- **التصميم**: Tailwind CSS 4
- **الأيقونات**: Lucide React
- **التنبيهات**: Sonner
- **الأدوات**: Framer Motion

## 🔗 روابط مفيدة

- 📖 [دليل النشر على Vercel](./VERCEL_DEPLOYMENT_GUIDE.md) ⭐
- 📖 [تكوين Supabase](./SUPABASE_NEW_PROJECT.md) ⭐
- 📖 [سكريبت الهجرة](./supabase-migration.sql)
- 🌐 [GitHub Repository](https://github.com/yac13inem-ux/smartbuild)
- 🗄️ [Supabase Dashboard](https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt)
- 🔧 [SQL Editor](https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt/sql/new)

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

SmartBuild by Yacine Ben Belaid

---

**ملاحظة**: هذا مشروع في التطوير المستمر. الميزات الجديدة قيد الإضافة.

**الإصدار الحالي**: 1.0.0
**آخر تحديث**: 2025-02-04
