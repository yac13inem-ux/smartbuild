# BuildTrack - Construction Project Management System

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
🌐 [https://buildtrack-omega.vercel.app](https://buildtrack-omega.vercel.app)

## 🗄️ قاعدة البيانات

يستخدم المشروع **Supabase (PostgreSQL)** في بيئة الإنتاج:

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

المشروع منشور بالفعل على Vercel مع Supabase!

### التكوين الحالي:
- ✅ **Platform**: Vercel
- ✅ **Database**: Supabase (PostgreSQL)
- ✅ **URL**: https://buildtrack-omega.vercel.app
- ✅ **Status**: 🟢 Active and Working

### فحص صحة النظام:
يمكنك فحص حالة النظام عبر:
```
https://buildtrack-omega.vercel.app/api/health
```

### Environment Variables المطلوبة:
```
DATABASE_URL=postgresql://postgres.fziikvgrnwkqfzfnebjw:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://fziikvgrnwkqfzfnebjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C
```

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

- 📖 [دليل النشر على Vercel و Supabase](./SUPABASE_DEPLOYMENT_GUIDE.md)
- 📖 [دليل التشخيص وإصلاح المشاكل](./TROUBLESHOOTING.md)
- 📖 [البدء السريع](./QUICK_SETUP.md)
- 🌐 [GitHub Repository](https://github.com/yac13inem-ux/BuildTrack)
- 🚀 [Live Demo](https://buildtrack-omega.vercel.app)

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
