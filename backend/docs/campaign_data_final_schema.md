# Campaign Data Final Schema

هذه الوثيقة تلخص الهيكل النهائي لجداول منصة الحملات في تطبيق Laravel ضمن مجلد `backend`. تم تجميع المعلومات من جميع ملفات التهجير الموجودة في `database/migrations` بعد دمج التحديثات اللاحقة على الجداول.

## 1. جداول المراجع الأساسية

### elections
- **الأعمدة**: `id`, `name`, `start_date`, `end_date`, الطوابع الزمنية.
- **القيود**: مفتاح أساسي على `id`.

### ec_settings
- **الأعمدة**: `id`, `election_id` (يقبل الفراغ)، `key`, `value`, الطوابع الزمنية.
- **القيود**: مفتاح خارجي إلى `elections.id` مع حذف متسلسل، وفريد منطقي مطلوب للتطبيق (لا يوجد فهرس فريد في المخطط).

### settings
- **الأعمدة**: `id`, `key` (فريد), `value`, `description`, `type`, الطوابع الزمنية.
- **القيود**: `key` فريد لضمان عدم تكرار مفاتيح الإعداد.

### geo_areas
- **الأعمدة**: `id`, `election_id`, `name`, `campaign_id` (اختياري), `parent_id` (اختياري), `level`, `code`, `meta`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `elections.id` (إلزامي) و `campaigns.id` و `geo_areas.id` (للهيكل الهرمي) مع حذف متسلسل أو تحويل إلى فارغ. فهرس على `campaign_id` وفريد على `code`.

## 2. إدارة الحملات

### campaigns
- **الأعمدة**: `id`, `election_id` (اختياري), `name`, `slug` (فريد, يقبل الفراغ في البداية ثم يتم ملؤه), `description`, `starts_at`, `ends_at`, `spatial_level`, `bbox`, `status`, الطوابع الزمنية.
- **القيود**: مفتاح خارجي إلى `elections.id` مع حذف بتحويل إلى فارغ، فهرس فريد على `slug`.

### campaign_polling_days
- **الأعمدة**: `id`, `campaign_id`, `date`, `notes`, الطوابع الزمنية.
- **القيود**: مفتاح خارجي إلى `campaigns.id` مع حذف متسلسل، فريد مركب على (`campaign_id`, `date`) مع فهرس على `campaign_id`.

### campaign_user
- **الأعمدة**: `id`, `campaign_id`, `user_id`, `role`, `status`, `permissions`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و`users.id` مع حذف متسلسل، فريد مركب على (`campaign_id`, `user_id`)، فهرس مركب على (`campaign_id`, `role`).

## 3. الحسابات والهوية

### users
- **الأعمدة**: `id`, `name`, `email` (فريد), `email_verified_at`, `password`, `avatar`, `role_id` (اختياري), `status`, `last_login_at`, `remember_token`, الطوابع الزمنية.
- **القيود**: فريد على `email`، ومفتاح خارجي إلى `roles.id` (من حزمة الصلاحيات) مع حذف متسلسل.

### campaign_volunteer (جسر تخصيص)
- **الأعمدة**: `id`, `campaign_id`, `volunteer_id`, `assignment`, `shift`, `tags`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و `volunteers.id` مع حذف متسلسل، فريد مركب على (`campaign_id`, `volunteer_id`)، فهرس مركب على (`campaign_id`, `assignment`).

## 4. النطاق الجغرافي واللجان

### areas
- **الأعمدة**: `id`, `name`, `description`, `x`, `y`, `name_ar`, `name_en`, `slug`, `type`, `level`, `parent_id` (اختياري), `code`, `meta`, `lat`, `lng`, الطوابع الزمنية.
- **القيود**: مفتاح خارجي ذاتي على `parent_id` مع حذف بتحويل إلى فارغ، فهرس فريد على `slug`.

### campaign_area
- **الأعمدة**: `id`, `campaign_id`, `area_id`, `alias`, `code`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و`areas.id` مع حذف متسلسل، فريد مركب على (`campaign_id`, `area_id`).

### committees
- **الأعمدة**: `id`, `campaign_id`, `geo_area_id`, `name`, `location`, `code`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و`geo_areas.id` مع حذف متسلسل، فريد مركب على (`campaign_id`, `code`)، فهرس مركب على (`campaign_id`, `name`).

## 5. الفرق، المتطوعون، والوكلاء

### teams
- **الأعمدة**: `id`, `campaign_id`, `name`, `area_id`, `supervisor_id`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id`, `areas.id`, و`users.id` مع حذف متسلسل، فهرس مركب على (`campaign_id`, `name`).

### volunteers
- **الأعمدة**: `id`, `campaign_id`, `name`, `email` (فريد), `phone`, `team_id` (اختياري), `tags`, الطوابع الزمنية.
- **القيود**: مفتاح خارجي إلى `campaigns.id` مع حذف متسلسل، مفتاح خارجي إلى `teams.id` بتحويل إلى فارغ، فهرس على `campaign_id`.

### agents
- **الأعمدة**: `id`, `campaign_id`, `candidate_id`, `committee_id`, `person_id`, `name`, `active`, `assigned_at`, `ended_at`, `meta`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id`, `candidates.id`, `committees.id`, و`volunteers.id`، فريد مركب على (`campaign_id`, `person_id`) بالإضافة إلى فريد عالمي على `person_id`, فهرس مركب على (`campaign_id`, `committee_id`).

### candidates
- **الأعمدة**: `id`, `campaign_id`, `election_id`, `name`, `party`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و`elections.id`، فهرس على `campaign_id`.

## 6. الناخبون والتفاعل الميداني

### voters
- **الأعمدة**: `id`, `campaign_id`, `name`, `committee_id`, `email`, `phone`, `area_id`, `address`, `gender`, `birthdate`, `age`, `bloodgroup`, `img_url`, `ion_user_id`, `voter_id`, `national_id`, `voter_uid`, `meta`, `add_date`, الطوابع الزمنية.
- **القيود**: مفتاح خارجي إلى `campaigns.id` مع حذف متسلسل، مرجع منطقي إلى `committees` (بدون قيد FK صريح)، مفتاح خارجي إلى `areas.id`، فريد مركب على (`campaign_id`, `national_id`) و (`campaign_id`, `voter_uid`) إضافة إلى الفريد الأصلي على `voter_id`, فهرس مركب على (`campaign_id`, `committee_id`).

### activities
- **الأعمدة**: `id`, `area_id`, `committee_id`, `campaign_id`, `voter_id`, `created_by`, `type`, `status`, `title`, `description`, `latitude`, `longitude`, `support_score`, `reported_at`, `meta`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `areas.id`, `committees.id`, `campaigns.id`, `voters.id`, و`users.id`، فهارس على `type`, `status`, `reported_at`, وفهرس مركب على (`campaign_id`, `reported_at`).

### events
- **الأعمدة**: `id`, `campaign_id`, `event_id` (فريد), `name`, `description`, `organiser`, `location`, `date`, `area_id`, `team_id`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id`, `areas.id`, و`teams.id` مع حذف متسلسل، فهارس على `campaign_id` و (`campaign_id`, `date`).

### observations
- **الأعمدة**: `id`, `campaign_id`, `committee_id`, `volunteer_id`, `notes`, `recorded_at`, `meta`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id`, `committees.id`, و`volunteers.id`, فهرس على (`campaign_id`, `recorded_at`).

## 7. الاتصالات والأتمتة

### sms_settings
- **الأعمدة**: `id`, `campaign_id`, `api_key`, `sender_id`, الطوابع الزمنية.
- **القيود**: مفتاح خارجي إلى `campaigns.id` بتحويل إلى فراغ، فهرس على `campaign_id`.

### sms
- **الأعمدة**: `id`, `user_id`, `campaign_id`, `message`, `recipient`, `status`, `sent_at`, `scheduled_for`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `users.id` و`campaigns.id`, فهرس مركب على (`campaign_id`, `status`).

### notifications
- **الأعمدة**: `id` (تزايدي), `campaign_id`, `user_id`, `type`, `title`, `message`, `priority`, `meta`, `read_at`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و`users.id`, فهارس على `type`, `priority`, `read_at`, إضافة إلى فهرس مركب على (`campaign_id`, `type`).

### automation_tasks
- **الأعمدة**: `id`, `campaign_id`, `task`, `display_name`, `description`, `is_enabled`, `status`, `last_run_at`, `meta`, الطوابع الزمنية.
- **القيود**: مفتاح خارجي إلى `campaigns.id`، فريد مركب على (`campaign_id`, `task`) مع فهرس مطابق.

## 8. الماليات والتحليلات

### expense_categories
- **الأعمدة**: `id`, `name`, الطوابع الزمنية.
- **القيود**: فريد منطقي على `name` (يجب تطبيقه على مستوى التطبيق عند الحاجة).

### finances
- **الأعمدة**: `id`, `campaign_id`, `amount`, `type`, `date`, `description`, `reference_id`, `category_id`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و`expense_categories.id`, فهرس مركب على (`campaign_id`, `date`).

### analytics_snapshots
- **الأعمدة**: `id`, `campaign_id`, `election_id`, `metric_key`, `snapshot_date`, `payload`, `forecast_value`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و`elections.id`, فريد مركب على (`campaign_id`, `metric_key`, `snapshot_date`).

### swots
- **الأعمدة**: `id`, `campaign_id`, `entity_type`, `entity_id`, `strengths`, `weaknesses`, `opportunities`, `threats`, `created_by`, الطوابع الزمنية.
- **القيود**: مفاتيح خارجية إلى `campaigns.id` و`users.id`, فهرس مركب على (`campaign_id`, `entity_type`, `entity_id`).

## 9. سجلات التهجير والمساعدة

### schema_migrations_log
- **الأعمدة**: `id`, `table_name`, `change_type`, `executed_by`, `details`, `executed_at` (افتراضي الوقت الحالي).
- **القيود**: فهرس مركب على (`table_name`, `executed_at`).

### جداول مساندة أخرى
- **profiles**, **homes**, **auths**: هياكل أولية تحتوي فقط على `id` والطوابع الزمنية (تستخدم كنقاط توسيع مستقبلية).

## 10. ملخص علاقات مفتاحية
- كل الجداول التشغيلية (`committees`, `teams`, `volunteers`, `voters`, `activities`, `events`, `observations`, `sms`, `notifications`, `automation_tasks`, `finances`, `analytics_snapshots`, `swots`, `agents`) تحمل `campaign_id` لضمان العزل بين الحملات.
- الجسور الأساسية (`campaign_user`, `campaign_volunteer`, `campaign_area`) تربط الكيانات العامة بسياق الحملة وتفرض تفردًا لكل حملة.
- التسلسل الجغرافي يعتمد على `areas` للاستخدام الداخلي و`geo_areas` للبيانات المرتبطة بالانتخابات العامة، مع إمكانية ربط كل منهما بالحملة حسب الحاجة.
