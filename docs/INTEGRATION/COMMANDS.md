# أوامر Artisan المتكاملة

يحتوي هذا الدليل على جميع الأوامر المتعلقة بمهمة تكامل Elections360 وكيفية تشغيلها.

## الأوامر الرئيسية

### integration:verify
- **الوصف:** يتحقق من حالة المخطط، العلاقات، الأنواع الأمامية، وتوافر البيانات العربية.
- **الاستخدام:**
  ```bash
  php artisan integration:verify
  ```
- **المخرجات:** يولد `storage/logs/integration_report.md` مع جدول شامل للحالة.

### api:profile
- **الوصف:** يقيس الأداء لأكثر واجهات API استخدامًا.
- **خيارات:** `--top` لتحديد عدد الاستدعاءات (الافتراضي 10).
- **الاستخدام:**
  ```bash
  php artisan api:profile --top=10
  ```
- **المخرجات:** يولد `storage/logs/api_profile.md` بتفاصيل متوسط الزمن والحجم.

### lifecycle:test
- **الوصف:** يحاكي دورة حياة الحملة والمتطوعين والناخبين والأنشطة.
- **الاستخدام:**
  ```bash
  php artisan lifecycle:test
  ```
- **المخرجات:** يولد `storage/logs/lifecycle_report.md` بملخص JSON.

### logs:unify
- **الوصف:** يدمج تقارير `schema_audit.md` و`factory_audit.md` و`sync.log` في تقرير واحد.
- **الاستخدام:**
  ```bash
  php artisan logs:unify
  ```
- **المخرجات:** يولد `storage/logs/system_unified_report.md` بقالب موحد.

## أوامر إضافية ذات صلة

- `schema:verify`, `schema:sync` للحفاظ على تطابق المخطط.
- `generate:arabic-test-data` لتوليد بيانات عربية إضافية.

> **ملاحظة:** يوصى بتشغيل أوامر التكامل بالترتيب المذكور بعد كل عملية نشر للتأكد من سلامة المنصة.
