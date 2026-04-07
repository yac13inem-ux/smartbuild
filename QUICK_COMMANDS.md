# ⚡ الأوامر السريعة للنشر

## DATABASE_URL الخاص بك:

```
postgresql://postgres:UzWfjHkVBg7uBSUm@db.obthfperigbrrngujetz.supabase.co:5432/postgres
```

---

## الأوامر التي ستحتاجها:

### 1. لتوليد Prisma Client:
```bash
bun run db:generate
```

### 2. لإنشاء الجداول في قاعدة البيانات:

#### على Mac/Linux:
```bash
DATABASE_URL="postgresql://postgres:UzWfjHkVBg7uBSUm@db.obthfperigbrrngujetz.supabase.co:5432/postgres" bun run db:push
```

#### على Windows (PowerShell):
```powershell
$env:DATABASE_URL="postgresql://postgres:UzWfjHkVBg7uBSUm@db.obthfperigbrrngujetz.supabase.co:5432/postgres"
bun run db:push
```

#### على Windows (CMD):
```cmd
set DATABASE_URL=postgresql://postgres:UzWfjHkVBg7uBSUm@db.obthfperigbrrngujetz.supabase.co:5432/postgres
bun run db:push
```

### 3. لتشغيل المشروع محلياً:
```bash
bun run dev
```

---

## في Vercel:

### Environment Variable:
```
Name: DATABASE_URL
Value: postgresql://postgres:UzWfjHkVBg7uBSUm@db.obthfperigbrrngujetz.supabase.co:5432/postgres
Environment: All
```

---

## الخطوات المختصرة:

1. ✅ استورد BuildTrack في Vercel
2. ✅ أضف DATABASE_URL في Environment Variables
3. ✅ انشر على Vercel
4. ✅ شغّل `bun run db:push` (الأمر أعلاه)
5. ✅ أعد النشر في Vercel

---

**الوقت: 10 دقائق** 🚀
