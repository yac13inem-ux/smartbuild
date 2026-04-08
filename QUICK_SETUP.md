# 🚀 BuildTrack - إعداد سريع / Quick Setup Guide

## 📖 English Version

### What You Need to Do:

1. **Set Up Supabase Database (5 minutes)**
   - Go to: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new
   - Copy the content from `supabase_migration.sql` file
   - Paste and click "Run"
   - Wait for success message

2. **Configure Vercel (3 minutes)**
   - Go to your Vercel project settings
   - Add these Environment Variables:
   
   **DATABASE_URL:**
   ```
   postgresql://postgres.fziikvgrnwkqfzfnebjw:lL5OvpM9vSzCKYGW@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

   **NEXT_PUBLIC_SUPABASE_URL:**
   ```
   https://fziikvgrnwkqfzfnebjw.supabase.co
   ```

   **NEXT_PUBLIC_SUPABASE_ANON_KEY:**
   ```
   sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C
   ```

3. **Redeploy (1 minute)**
   - Go to Deployments tab
   - Redeploy your application
   - Test it works!

---

## 📖 النسخة العربية

### ما تحتاج إلى فعله:

1. **إعداد قاعدة بيانات Supabase (5 دقائق)**
   - اذهب إلى: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new
   - انسخ محتوى ملف `supabase_migration.sql`
   - الصقه واضغط على "Run" (تشغيل)
   - انتظر رسالة النجاح

2. **إعداد Vercel (3 دقائق)**
   - اذهب إلى إعدادات مشروع Vercel
   - أضف متغيرات البيئة التالية:
   
   **DATABASE_URL:**
   ```
   postgresql://postgres.fziikvgrnwkqfzfnebjw:lL5OvpM9vSzCKYGW@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

   **NEXT_PUBLIC_SUPABASE_URL:**
   ```
   https://fziikvgrnwkqfzfnebjw.supabase.co
   ```

   **NEXT_PUBLIC_SUPABASE_ANON_KEY:**
   ```
   sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C
   ```

3. **إعادة النشر (1 دقيقة)**
   - اذهب إلى تبويب Deployments
   - أعد نشر التطبيق
   - اختبر أنه يعمل!

---

## ✅ Checklist / قائمة التحقق

- [ ] Run SQL migration script in Supabase
- [ ] Add DATABASE_URL in Vercel (use pooler connection)
- [ ] Add NEXT_PUBLIC_SUPABASE_URL in Vercel
- [ ] Add NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel
- [ ] Redeploy application on Vercel
- [ ] Test creating a new project
- [ ] Verify data appears in Supabase Table Editor

---

## 🎯 Features Confirmed / الميزات المؤكدة

✅ Time fields for iron review and concrete pour
✅ Fields displayed vertically (date above time)
✅ Multi-language support (Arabic, English, French)
✅ Progress tracking (Gros Œuvre, CES, CET)
✅ Mobile responsive design
✅ PostgreSQL database with Supabase
✅ Ready for Vercel deployment

---

## 🔗 Important Links / روابط مهمة

- Supabase Dashboard: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw
- Supabase SQL Editor: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new
- GitHub Repository: https://github.com/yac13inem-ux/BuildTrack

---

## 💡 Tips / نصائح

1. **Use Pooler Connection:** Always use the pooled connection string (port 6543) for Vercel
   **استخدم اتصال Pooler:** استخدم دائماً اتصال pooler (المنفذ 6543) لـ Vercel

2. **Check Tables:** After migration, verify tables in Supabase Table Editor
   **تحقق من الجداول:** بعد الترحيل، تأكد من الجداول في محرر جداول Supabase

3. **Test Thoroughly:** Create a test project, add blocks and floors
   **اختبر بدقة:** أنشئ مشروعاً تجريبياً، أضف كتل وطوابق

4. **Monitor Logs:** Check Vercel logs if something doesn't work
   **راقب السجلات:** تحقق من سجلات Vercel إذا لم يعمل شيء

---

## 🎉 You're Ready! / أنت جاهز!

After completing these steps, your BuildTrack application will be fully functional with:
- ✅ Supabase database
- ✅ All features working
- ✅ Time fields visible and functional
- ✅ Deployed on Vercel

بعد إكمال هذه الخطوات، سيكون تطبيق BuildTrack الخاص بك يعمل بالكامل مع:
- ✅ قاعدة بيانات Supabase
- ✅ جميع الميزات تعمل
- ✅ حقول الوقت ظاهرة وعاملة
- ✅ منشور على Vercel
