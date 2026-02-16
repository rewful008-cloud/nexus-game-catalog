@echo off
chcp 65001 > nul
title Git Setup - GitHub Upload

echo ════════════════════════════════════════════════════════════
echo          🚀 إعداد Git للرفع على GitHub
echo             Git Setup for GitHub Upload
echo ════════════════════════════════════════════════════════════
echo.

cd /d "c:\Users\iadSa\Downloads\Telegram Desktop\2\static_site"

echo 📁 المجلد الحالي:
cd
echo.

echo ════════════════════════════════════════════════════════════
echo  الخطوة 1: تهيئة Git Repository
echo ════════════════════════════════════════════════════════════
echo.

git init
if %ERRORLEVEL% NEQ 0 (
    echo ❌ خطأ في تهيئة Git!
    echo    تأكد من تثبيت Git: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo  الخطوة 2: إضافة الملفات
echo ════════════════════════════════════════════════════════════
echo.

git add .
echo ✅ تم إضافة الملفات

echo.
echo ════════════════════════════════════════════════════════════
echo  الخطوة 3: عرض حالة الملفات
echo ════════════════════════════════════════════════════════════
echo.

git status

echo.
echo ════════════════════════════════════════════════════════════
echo  ملاحظة: تأكد من أن kun_nexus.db غير مدرج في القائمة!
echo ════════════════════════════════════════════════════════════
echo.
pause

echo.
echo ════════════════════════════════════════════════════════════
echo  الخطوة 4: إعداد Git Config
echo ════════════════════════════════════════════════════════════
echo.

set /p USERNAME="أدخل اسمك (Your Name): "
set /p EMAIL="أدخل بريدك (Your Email): "

git config --global user.name "%USERNAME%"
git config --global user.email "%EMAIL%"

echo ✅ تم تعيين الإعدادات

echo.
echo ════════════════════════════════════════════════════════════
echo  الخطوة 5: إنشاء أول Commit
echo ════════════════════════════════════════════════════════════
echo.

git commit -m "Initial commit: Nexus Game Catalog"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ خطأ في إنشاء Commit!
    pause
    exit /b 1
)

echo ✅ تم إنشاء Commit بنجاح!

echo.
echo ════════════════════════════════════════════════════════════
echo  الخطوة 6: ربط مع GitHub Repository
echo ════════════════════════════════════════════════════════════
echo.
echo ⚠️  قبل المتابعة:
echo    1. افتح: https://github.com/new
echo    2. أنشئ repository جديد
echo    3. اسمه: nexus-game-catalog
echo    4. اجعله Public
echo    5. لا تختر أي ملفات إضافية
echo.
pause

echo.
set /p GITHUB_USERNAME="أدخل اسم مستخدم GitHub الخاص بك: "

git remote add origin https://github.com/%GITHUB_USERNAME%/nexus-game-catalog.git
git branch -M main

echo.
echo ════════════════════════════════════════════════════════════
echo  الخطوة 7: رفع الملفات إلى GitHub
echo ════════════════════════════════════════════════════════════
echo.

echo 🚀 جاري الرفع...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo  ✅ نجح! تم رفع الملفات إلى GitHub
    echo ════════════════════════════════════════════════════════════
    echo.
    echo 🌐 افتح المستودع:
    echo    https://github.com/%GITHUB_USERNAME%/nexus-game-catalog
    echo.
    echo 📋 الخطوة التالية:
    echo    1. افتح: https://app.netlify.com
    echo    2. اربط المستودع مع Netlify
    echo    3. انشر الموقع!
    echo.
) else (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo  ❌ فشل الرفع!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo 💡 الحلول الممكنة:
    echo    1. تحقق من اسم المستخدم وكلمة المرور
    echo    2. أو استخدم Personal Access Token
    echo    3. راجع: https://github.com/settings/tokens
    echo.
)

pause
