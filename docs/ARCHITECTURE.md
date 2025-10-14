# 🧱 Elections360 NextGen – Technical Architecture

## Purpose | الهدف
- Document the end-to-end architecture linking the React 18 + TypeScript frontend with the Laravel 8 API and data stores.
- Provide engineers with a concise reference for integration patterns, deployment tiers, and shared services.

## Structure / Modules | الهيكلية
1. **Client Tier (frontend/)**
   - React 18 + Vite build pipeline with TypeScript and shadcn/ui.
   - Authentication handled via context hooks consuming Laravel Sanctum tokens.
   - TanStack Query orchestrates API caching, optimistic updates, and invalidation.
2. **API Tier (backend/)**
   - Laravel 8 application exposing RESTful routes under `/api/v1` with Sanctum middleware.
   - Spatie Permission module enforces RBAC; policies wrap domain operations.
   - Jobs & Events queue-ready using Redis driver for async notifications.
3. **Data Tier**
   - Primary relational database (MySQL or PostgreSQL) managed through Eloquent models.
   - Redis recommended for cache/session/queue storage.
4. **Shared Services**
   - Centralized logging (Monolog to Stack channel) flowing into ELK-compatible format.
   - Notifications via Laravel Notifications (mail, SMS gateways).
   - Object storage (S3-compatible) for media attachments.

## Current Status | الحالة الحالية
- ✅ Core folder structure is present but requires dependency verification.
- ⚠️ Observed duplication of legacy docs that need consolidation into `docs/`.
- ⚠️ Queue workers and cache are not yet provisioned in local scripts.

## Next Steps | الخطوات التالية
- Configure environment templates: `.env.example` updates for API_URL, queue, cache.
- Add infrastructure-as-code descriptors (Docker Compose) aligning frontend+backend containers.
- Establish architecture diagram in `docs/diagrams/` with sequence and deployment views.
- Audit third-party integrations (maps, SMS, email) and document fallback strategies.
