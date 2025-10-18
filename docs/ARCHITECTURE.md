# 🧱 Elections360 NextGen – Technical Architecture

## Purpose | الهدف
- Capture the current architecture that connects the React 18 + TypeScript frontend with the Laravel 10 API and supporting services.
- Provide engineers with a reliable reference for integration patterns, deployment tiers, and shared infrastructure decisions.

## Structure / Modules | الهيكلية
1. **Client Tier (`frontend/`)**
   - React 18 with a Vite build pipeline, TypeScript, shadcn/ui primitives, and TanStack Query for data orchestration.
   - Authentication handled via context providers that attach Laravel Sanctum bearer tokens issued by the API.
   - Shared UI state persisted through React Query caches, Zustand stores, and URL search params for deep-linking.
2. **API Tier (`backend/`)**
   - Laravel 10.49 application serving RESTful endpoints under `/api/v1` guarded by Sanctum middleware and `auth:sanctum` guards.
   - Controllers validate requests inline (e.g., `$request->validate([...])`) and delegate heavy lifting to domain services within `App\Services`.
   - `spatie/laravel-permission` enforces RBAC while policies gate sensitive resources (teams, finance, analytics exports).
3. **Domain & Events Layer**
   - Service classes encapsulate business rules: e.g., `VolunteerService` for onboarding, `FinanceService` for ledgers, `EventService` for scheduling.
   - Events such as `ActivityCreated` invalidate analytics caches and can trigger downstream notifications.
4. **Data & Cache Layer**
   - MySQL 8 (or PostgreSQL) as the primary relational database accessed via Eloquent models and query scopes.
   - Redis-backed cache recommended; analytics endpoints actively memoize results (see `AnalyticsController`).
   - Queue configuration prepared for async tasks (notifications, report exports) though worker provisioning is pending in local scripts.
5. **Shared Services**
   - Logging aggregates through Monolog `stack` channel with contextual metadata from services.
   - SMS and external connectors routed through `App\Services\External` and `SmsService` wrappers.
   - File/object storage abstracted for future S3-compatible drivers.

## Current Status | الحالة الحالية
- ✅ Laravel 10 + PHP 8.1 upgrade complete; Sanctum, Spatie Permission, and service layer patterns are active in the codebase.
- ✅ Frontend and backend share a consistent API contract via `frontend/src/lib/api` and Laravel API Resources.
- ⚠️ Queue workers and Redis cache require local/docker provisioning before enabling heavy async workloads.
- ⚠️ Infrastructure diagrams and container orchestration docs remain TODO.

## Next Steps | الخطوات التالية
- Update `.env.example` files (frontend + backend) with queue/cache variables and API host alignment.
- Document docker-compose stack that runs Laravel Octane, queue workers, and the Vite dev server together.
- Produce architecture diagrams (context, deployment, request sequence) under `docs/diagrams/`.
- Formalize observability plan (structured logs, metrics exporters) and document integration fallbacks for SMS/maps providers.
