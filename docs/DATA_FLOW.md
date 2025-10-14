# 🔄 Elections360 NextGen – Data Flow Specification

## Purpose | الهدف
- Describe how user interactions in the React frontend propagate through the Laravel API to the database and ancillary services.
- Align developers on request/response contracts, validation layers, and async pipelines.

## Structure / Modules | الهيكلية
1. **User Interaction Layer**
   - UI components trigger TanStack Query mutations or fetches through the `lib/api` client.
   - Form validation handled client-side with Zod before network calls.
2. **Transport Layer**
   - HTTPS requests authenticated via Sanctum tokens stored in HTTP-only cookies.
   - All API calls target `/api/v1/*` endpoints with locale headers (`Accept-Language`).
3. **Application Layer**
   - Laravel controllers validate requests via FormRequest classes and authorize via policies.
   - Services and Actions encapsulate domain logic, emitting Events for side-effects (audit logs, notifications).
4. **Persistence Layer**
   - Eloquent models interact with MySQL/PostgreSQL using transactions where cross-entity operations occur.
   - Observer classes maintain data integrity (e.g., syncing counts, cascading status updates).
5. **Outbound Integrations**
   - Queue jobs dispatched for heavy operations (report generation, SMS/email, geo-sync).
   - Webhooks prepared for third-party monitoring dashboards.

## Current Status | الحالة الحالية
- ✅ Base HTTP client wrappers exist but require review for consistent error normalization.
- ⚠️ Audit log events are defined conceptually; implementation pending in backend observers.
- ⚠️ Webhook sender skeleton missing; placeholders identified in integration plan.

## Next Steps | الخطوات التالية
- Finalize shared DTO schemas in `frontend/src/lib/contracts` and mirror them with Laravel API Resources.
- Implement standardized error envelope `{code,message,details}` across controllers.
- Extend queue workers to process notification jobs and document retry strategies.
- Add sequence diagrams (login, election update, report export) under `docs/diagrams/data-flow/`.
