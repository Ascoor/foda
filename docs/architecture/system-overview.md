---
title: "System Overview"
author: "Platform Engineering"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Elections360 NextGen – System Overview

## Purpose
- Summarize how the React 18 + TypeScript frontend, Laravel 10 API, and shared services collaborate in production.
- Provide a single reference for integration touchpoints, hosting tiers, and operational constraints.

## Platform Tiers
1. **Client Applications (`frontend/`)**
   - React 18 with Vite build tooling, shadcn/ui primitives, TanStack Query caching, and Zustand stores for local state.
   - Auth context injects Laravel Sanctum bearer tokens into the shared Axios client; RTL/LTR rendering is governed by shared design tokens.
   - Routing handled by `frontend/src/app/routes.tsx`, with protected areas gated by `ProtectedRoute` and `MainLayoutWrapper` shells.
2. **API Services (`backend/`)**
   - Laravel 10.49 application exposing REST endpoints at `/api/v1/*`, protected by Sanctum middleware and policy gates.
   - Controllers delegate domain logic to service classes under `App\\Services`, emitting API Resources for typed responses consumed by the frontend.
   - Redis cache and queue configurations prepared for asynchronous notifications, analytics refreshes, and export jobs.
3. **Domain & Event Layer**
   - Services such as `VolunteerService`, `FinanceService`, and `ActivityService` coordinate validation, transactions, and event dispatch.
   - Domain events (e.g., `ActivityCreated`) invalidate analytics caches and trigger downstream automation.
4. **Data & Observability**
   - Primary datastore: MySQL 8 (or PostgreSQL) accessed through Eloquent models and scoped queries.
   - Redis recommended for caching analytics dashboards and pending notifications; queue workers planned for retry resilience.
   - Logging centralized through the Monolog `stack` channel with contextual metadata from services and jobs.

## Current Status
- ✅ Laravel 10 upgrade complete with Sanctum and Spatie Permission enforcing RBAC.
- ✅ Shared API contract maintained via `frontend/src/shared/lib/api.ts` and Laravel API Resources.
- ⚠️ Queue workers and Redis provisioning pending in local/docker automation.
- ⚠️ Architecture diagrams for deployment and observability remain TODO items.

## Next Actions
1. Publish Docker Compose definitions covering API, queue workers, Redis, and the Vite dev server.
2. Document observability strategy (structured logging, metrics exporters) and wire alerts to the incident response playbook.
3. Capture context, container, and sequence diagrams to complement this narrative overview.
4. Align `.env` templates with queue/cache environment variables to avoid drift across environments.
