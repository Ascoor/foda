# FODA - نظام إدارة الانتخابات الموحد
## Elections360 + FODA Unified Project

---

## 🎯 نظرة عامة

تم توحيد مشروعي FODA و Elections360 في مشروع واحد متكامل يجمع بين:
- **الميزات المتقدمة** من FODA (12 وحدة، نظام صلاحيات، خرائط تفاعلية)
- **البنية الحديثة** من Elections360 (Docker، Laravel 11 جاهز)
- **مرونة التشغيل** (محلي أو Docker)

---

## 🏗️ هيكل المشروع الموحد

```
foda/
├── backend/                    # Laravel Backend (Laravel 8 + ميزات متقدمة)
│   ├── app/                    # Controllers, Models, Middleware
│   ├── database/               # Migrations, Seeders
│   ├── routes/                 # API Routes
│   ├── Dockerfile             # Docker configuration
│   └── composer.json          # Dependencies
├── frontend/                   # React Frontend (TypeScript + Vite)
│   ├── src/                   # Source code
│   │   ├── components/        # UI Components
│   │   ├── modules/           # Feature modules (12 modules)
│   │   ├── contexts/          # State management
│   │   └── lib/               # Utilities
│   ├── Dockerfile             # Docker configuration
│   └── package.json           # Dependencies
├── docker-compose.yml         # Docker orchestration
├── start.sh                   # Unified startup script
├── README.md                  # English documentation
├── README_AR.md               # Arabic documentation
├── DEVELOPMENT_PLAN.md        # Development roadmap
└── CRUD_API_REVIEW.md         # API documentation
```

---

## 🚀 طرق التشغيل

### 1️⃣ التشغيل الموحد (المُوصى به)

```bash
# تشغيل تلقائي مع خيارات
./start.sh
```

**الخيارات المتاحة:**
- **Docker Compose** (مُوصى به للإنتاج)
- **Local Development** (مُوصى به للتطوير)

### 2️⃣ التشغيل بـ Docker

```bash
# تشغيل كامل مع Docker
docker-compose up --build

# تشغيل في الخلفية
docker-compose up -d --build

# إيقاف الخدمات
docker-compose down
```

**المنافذ:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Database: localhost:3306

### 3️⃣ التشغيل المحلي

```bash
# Backend (Terminal 1)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev -- --port=8080
```

---

## 🎯 الميزات المتاحة

### ✅ الميزات المكتملة
- [x] **نظام مصادقة متقدم** مع Laravel Sanctum
- [x] **12 وحدة رئيسية** مطورة بالكامل
- [x] **خرائط تفاعلية** مع Leaflet
- [x] **نظام ترجمة** (عربي/إنجليزي)
- [x] **تصميم متجاوب** مع Tailwind CSS
- [x] **نظام صلاحيات** متقدم
- [x] **لوحة تحكم** تفاعلية
- [x] **API متكامل** مع 50+ endpoint

### 🔄 الميزات قيد التطوير
- [ ] **خرائط حية** مع تحديث فوري
- [ ] **تقارير لحظية** مع WebSockets
- [ ] **تطبيق محمول** (React Native)
- [ ] **تحليلات ذكية** مع AI
- [ ] **نظام إشعارات** متقدم

---

## 📊 الوحدات المتاحة

### 1. لوحة التحكم (Dashboard)
- إحصائيات شاملة
- مخططات تفاعلية
- موجز الأنشطة

### 2. إدارة الانتخابات (Elections)
- إنشاء وإدارة الانتخابات
- تتبع الحالة
- تقارير مفصلة

### 3. المناطق الجغرافية (Geo Areas)
- خرائط تفاعلية
- إدارة المناطق
- إحصائيات جغرافية

### 4. إدارة الناخبين (Voters)
- تسجيل الناخبين
- البحث والتصفية
- استيراد/تصدير

### 5. إدارة المرشحين (Candidates)
- ملفات المرشحين
- رفع المستندات
- تتبع التقدم

### 6. إدارة اللجان (Committees)
- إنشاء اللجان
- تعيين الأعضاء
- إدارة المهام

### 7. إدارة المتطوعين (Volunteers)
- تسجيل المتطوعين
- تتبع المهارات
- تعيين المهام

### 8. إدارة الوكلاء (Agents)
- تسجيل الوكلاء
- إدارة الصلاحيات
- تتبع الأنشطة

### 9. المراقبة (Observations)
- تسجيل الملاحظات
- رفع التقارير
- تتبع الحوادث

### 10. الحملات (Campaigns)
- إنشاء الحملات
- إدارة الموارد
- تتبع التقدم

### 11. التحليلات (Analytics)
- تحليل البيانات
- مخططات تفاعلية
- تقارير مخصصة

### 12. الإعدادات (Settings)
- إعدادات النظام
- تفضيلات المستخدم
- إدارة الأذونات

---

## 🔧 التكوين

### متغيرات البيئة (Backend)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=foda
DB_USERNAME=foda
DB_PASSWORD=foda

SANCTUM_STATEFUL_DOMAINS=localhost:8080
```

### متغيرات البيئة (Frontend)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 🐳 Docker Configuration

### الخدمات المتاحة
- **app**: Laravel Backend
- **frontend**: React Frontend  
- **db**: MySQL Database

### المتغيرات
- Database: `foda`
- Username: `foda`
- Password: `foda`
- Root Password: `secret`

---

## 📈 خطة التطوير

راجع ملف `DEVELOPMENT_PLAN.md` للحصول على خطة التطوير الشاملة والتفصيلية.

### المراحل القادمة
1. **المرحلة 2**: خرائط حية وتقارير لحظية
2. **المرحلة 3**: تحليلات ذكية وتقارير استراتيجية
3. **المرحلة 4**: تطبيق محمول ونظام ذكي
4. **المرحلة 5**: تحسينات نهائية وأمان

---

## 🛠️ الأدوات والتقنيات

### Backend
- Laravel 8+ مع Sanctum
- MySQL/PostgreSQL
- Redis (اختياري)
- WebSockets (قيد التطوير)

### Frontend
- React 18+ مع TypeScript
- Vite للبناء
- Tailwind CSS + shadcn/ui
- Leaflet للخرائط
- React Query لإدارة البيانات

### DevOps
- Docker & Docker Compose
- Nginx (للإنتاج)
- SSL/TLS

---

## 📞 الدعم والمساعدة

### الوثائق المتاحة
- `README.md`: الوثائق الإنجليزية
- `README_AR.md`: الوثائق العربية
- `DEVELOPMENT_PLAN.md`: خطة التطوير
- `CRUD_API_REVIEW.md`: وثائق API

### المساعدة
- راجع الوثائق أولاً
- تحقق من ملفات التكوين
- راجع سجلات الأخطاء
- تواصل مع فريق التطوير

---

## 🎉 الخلاصة

تم توحيد مشروعي FODA و Elections360 بنجاح في مشروع واحد متكامل يجمع بين:

✅ **الميزات المتقدمة** من FODA  
✅ **البنية الحديثة** من Elections360  
✅ **مرونة التشغيل** (محلي أو Docker)  
✅ **وثائق شاملة** باللغتين  
✅ **خطة تطوير واضحة** للمستقبل  

**FODA - نظام إدارة الانتخابات الموحد** 🚀  
*منصة شاملة لإدارة الانتخابات بكل كفاءة وشفافية*
