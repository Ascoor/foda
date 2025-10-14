# 🧰 Elections360 NextGen – System Setup Guide

## Purpose | الهدف
- Provide a step-by-step process to prepare local development and shared staging environments.
- Ensure consistent tooling across backend and frontend teams with minimal onboarding friction.

## Structure / Modules | الهيكلية
1. **Prerequisites**
   - Node.js 18+, npm 9+, PNPM optional for workspace management.
   - PHP 8.1+, Composer 2.6+, MySQL 8 or PostgreSQL 13, Redis 6.
   - Docker Desktop (optional but recommended) and mkcert for local HTTPS.
2. **Environment Configuration**
   - Copy `.env.example` to `.env` in `backend/` and `frontend/`.
   - Set `APP_URL`, `FRONTEND_URL`, `VITE_API_URL`, database credentials, and Redis host.
3. **Dependency Installation**
   - Backend: `composer install && php artisan key:generate`.
   - Frontend: `npm install` (or `pnpm install`) within `frontend/`.
   - Global tooling: `npm install -g @nestjs/cli` not required; keep stack minimal.
4. **Database & Seeds**
   - Run `php artisan migrate --seed` to initialize roles, demo data, and admin user.
   - Optional: `php artisan db:seed --class=DemoElectionSeeder` for sample dashboards.
5. **Running the Stack**
   - Use `./start.sh` to boot combined services; verifies port availability (8000, 5173/8080, 6379).
   - Manual run: `php artisan serve` and `npm run dev` in separate terminals.
6. **Verification**
   - Access `http://localhost:5173` (or configured port), login with seeded credentials.
   - Confirm API health at `http://localhost:8000/api/v1/health`.

## Current Status | الحالة الحالية
- ✅ Manual setup steps validated previously; require update to reflect Redis and HTTPS additions.
- ⚠️ `start.sh` script lacks Windows compatibility and Redis bootstrap.
- ⚠️ Automated verification scripts not yet configured.

## Next Steps | الخطوات التالية
- Extend `start.sh` to check/install Composer/NPM dependencies and manage Redis container.
- Publish Docker Compose definition for full stack parity across developers.
- Add onboarding checklist to `docs/operations/onboarding.md` capturing credentials and support contacts.
