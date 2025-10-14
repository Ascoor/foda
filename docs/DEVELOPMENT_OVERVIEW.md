# FODA Development Overview

This document replaces the scattered project plans, audits, and execution briefs that used to live in the repository root. It delivers a single source of truth for engineers and delivery leads who are implementing and operating the election management platform.

## 1. System Snapshot
- **Stack:** React 18 + TypeScript + Vite frontend, Laravel 8 backend with Sanctum + Spatie Permission, MySQL/PostgreSQL database.
- **Hosting modes:** Docker Compose for production parity, direct local execution for rapid development.
- **Core capabilities:** 12 functional modules (committees, agents, analytics, voters, etc.), bilingual UX (Arabic/English), interactive Leaflet maps, notification centre, analytics dashboards, scheduled jobs.

## 2. Development Workflows
### Recommended local setup
```bash
# Backend
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev -- --port=8080
```

### Unified start script
```bash
./start.sh
```
Choose Docker or local mode from the interactive prompts. Docker exposes:
- Frontend: http://localhost:8080
- API: http://localhost:8000
- Database: localhost:3306

## 3. Architecture Highlights
- **Frontend:** Feature-first modules (`frontend/src/modules`) share contexts, hooks, and UI primitives. React Router v6 handles navigation, TanStack Query powers data caching, and i18next delivers bilingual copy.
- **Backend:** Laravel API follows REST v1 structure under `app/Http/Controllers/Api/V1`. Sanctum guards authentication while Spatie Permission manages RBAC. Database migrations and seeders live in `database/` for reproducible environments.
- **Cross-cutting concerns:** shared logging, analytics caching, and notification broadcasting via Laravel Echo/WebSockets.

## 4. Delivery Roadmap (Oct 2025 baseline)
| Phase | Focus | Completion | Key next steps |
|-------|-------|------------|----------------|
| 1. Foundations & architecture | Platform scaffolding, auth, base UI | **85%** | Harden sessions, expand caching, finalise security alerts. |
| 2. Dynamic operations & mapping | Live maps, operational workflows | **35%** | Swap Leaflet to real `/ec/geo-areas` data, ship forgotten password flow, launch live reporting channel. |
| 3. Analytics & intelligence | Dashboards, notifications, exports | **80%** | Deliver strategic PDF/Excel exports. |
| 4. Professional release | Mobile, AI insights, admin tooling | **15%** | Kick off mobile client + advanced admin experience. |
| 5. Hardening & go-live | QA, performance, CI/CD | **15%** | Implement GitHub Actions CI/CD, complete security/performance audits. |

## 5. Operational Priorities
- **Security & compliance:** enforce HTTPS/TLS end-to-end, expand rate limiting, ship audit log and session analytics, prepare 2FA for privileged roles.
- **Observability:** enable structured logs, centralise alerts for slow API responses, and track map data freshness.
- **Scalability:** target under-15s latency for live reports, optimise caching for analytics-heavy dashboards, plan load tests for 5k concurrent users.

## 6. Document Map
The detailed artefacts remain available in `docs/archive/` for reference:
- `PROJECT_PLAN.md` — full bilingual delivery programme with risks and KPIs.
- `EXECUTION_PLAN_AR.md` — Arabic execution blueprint covering phased restructuring.
- `AUDIT_Elections360.md` — technical audit of infrastructure and code quality.
- `CRUD_API_REVIEW.md` — endpoint catalogue with authentication notes.
- `COMPREHENSIVE_REVIEW_AR.md` — Arabic deep-dive into UX, data, and security gaps.
- `elections360_README.md` — legacy Elections360 setup instructions.

> Start here for day-to-day delivery. Reach into the archive only when deeper historical detail is required.
