# دليل التحديث على GitHub

## الحالة الحالية
هناك **10 commits** جاهزة للرفع إلى GitHub في مستودع BuildTrack.

## التغييرات الجاهزة للرفع

أحدث 10 commits تم إنشاؤها:
- 4ecdc61 - أحدث تغييرات (منذ 4 دقائق)
- 25bf54e - تحديثات إضافية (منذ 12 دقيقة)
- b447c0f - تحديثات (منذ 84 دقيقة)
- 28b242a - تحديثات (منذ ساعتين)
- f001817 - تحديثات (منذ 7 ساعات)
- 718ef76 - fix: simplify dev script to avoid output redirection issues
- f21cc21 - تحديثات (منذ 7 ساعات)
- 12524db - تحديثات (منذ 7 ساعات)
- c6d0949 - تحديثات (منذ 7 ساعات)
- 4b13170 - تحديثات (منذ 7 ساعات)

## كيفية الرفع إلى GitHub

### الخيار 1: باستخدام SSH (موصى به)

1. **تأكد من إعداد مفتاح SSH**:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **أضف المفتاح إلى حساب GitHub**:
   - انسخ محتوى `~/.ssh/id_ed25519.pub`
   - أضفه في: GitHub Settings > SSH and GPG Keys > New SSH key

3. **غيّر رابط remote إلى SSH**:
   ```bash
   cd /home/z/my-project
   git remote set-url origin git@github.com:adelbenbelaid091-cpu/BuildTrack.git
   ```

4. **ارفع التغييرات**:
   ```bash
   git push origin main
   ```

### الخيار 2: باستخدام Personal Access Token

1. **أنشئ Personal Access Token** على GitHub:
   - اذهب إلى: GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - أنشئ token جديد مع صلاحيات: `repo` (full control)

2. **استخدم Token للرفع**:
   ```bash
   cd /home/z/my-project
   git push https://YOUR_TOKEN@github.com/adelbenbelaid091-cpu/BuildTrack.git main
   ```

3. **أو حفظ Token كـ credential helper**:
   ```bash
   git config --global credential.helper store
   git push origin main
   # أدخل username: adelbenbelaid091-cpu
   # أدخل password: YOUR_TOKEN
   ```

### الخيار 3: باستخدام GitHub CLI

1. **تثبيت GitHub CLI** (إن لم يكن مثبتاً):
   ```bash
   # على Ubuntu/Debian
   sudo apt install gh

   # على macOS
   brew install gh
   ```

2. **تسجيل الدخول**:
   ```bash
   gh auth login
   ```

3. **رفع التغييرات**:
   ```bash
   git push origin main
   ```

## التحقق من التغييرات قبل الرفع

لرؤية الملفات التي تم تغييرها:
```bash
cd /home/z/my-project
git diff origin/main..HEAD
```

لرؤية قائمة الملفات المعدلة:
```bash
git diff --name-only origin/main..HEAD
```

## بعد الرفع

يمكنك التحقق من نجاح الرفع بزيارة:
https://github.com/adelbenbelaid091-cpu/BuildTrack

---

**ملاحظة**: البيئة الحالية لا تمتلك صلاحيات الدفع المباشر إلى GitHub. يجب عليك تنفيذ أحد الخيارات أعلاه من جهازك المحلي أو إعداد بيانات الاعتماد المناسبة.
