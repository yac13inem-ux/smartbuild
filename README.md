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
