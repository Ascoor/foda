---
title: "Services Architecture"
author: "Backend Platform"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Services & Application Logic

## Purpose
- Summarize backend service orchestration and the flows connecting Laravel controllers, services, events, and resources.
- Provide actionable review notes carried over from the previous `APP_LOGIC_REVIEW.md` document.

## End-to-End Flows
1. **Authentication & Session Bootstrap**
   - `AuthController` issues Sanctum tokens after validating credentials; previous tokens revoked to enforce single-session security.
   - Frontend stores tokens via `setAuthToken` in `frontend/src/shared/lib/api.ts`, hydrating Axios interceptors automatically.
2. **Dashboard & Analytics**
   - `HomeController@index` aggregates voter, team, and event counts, while `AnalyticsController` composes region trends cached for five minutes.
   - Dashboard modules fetch data through `frontend/src/shared/lib/endpoints.ts`, using TanStack Query to cache responses and display charts.
3. **Field Activity Lifecycle**
   - `ActivityController` applies scoped filters (`forType`, `betweenDates`, `forStatus`) before returning `ActivityResource` collections.
   - Frontend timeline modules render paginated feeds and trigger export/reporting actions.
4. **Communications & Alerts**
   - `SmsService` enforces per-minute rate limits, dispatches provider requests, and logs outcomes for auditing.
   - Automation UI polls for delivery status and surfaces toast notifications through shared hooks.
5. **Configuration & Governance**
   - `SettingService::get` casts typed configuration and powers `/api/v1/settings`; admin UI updates feature toggles and metadata.

## Review Notes
- ✅ Laravel 10 upgrade confirmed across controllers and service classes.
- ✅ Shared typing between Laravel API Resources and frontend TypeScript definitions prevents payload drift.
- ⚠️ Queue workers for SMS retries and analytics recomputation remain pending (requires Supervisor/Docker deployment).
- ⚠️ Need to normalize error envelopes to `{ code, message, details }` across controllers.
- ⚠️ Volunteer and finance service classes contain TODOs for complex business rules (multi-currency, skill matrices).

## Recommended Actions
1. Implement worker deployment scripts and document them within `docs/governance/review-process.md`.
2. Backfill unit/integration tests for `SmsService`, `SettingService`, and volunteer assignment flows.
3. Extend API Resources to cover analytics endpoints with typed transformers and caching metadata.
4. Produce ADRs capturing major service-level design decisions for future audits.
