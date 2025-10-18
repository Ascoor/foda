# 🔄 Elections360 NextGen – Data Flow Specification

## Purpose | الهدف
- Describe how user interactions in the React frontend propagate through the Laravel API to the database and ancillary services.
- Align developers on request/response contracts, validation layers, and async pipelines.

## Structure / Modules | الهيكلية
1. **User Interaction Layer**
   - UI modules and hooks trigger Axios requests through `frontend/src/lib/api.ts`, optionally memoised via TanStack Query wrappers.
   - Forms lean on Zod schemas for synchronous client validation before dispatching mutations.
2. **Transport Layer**
   - HTTPS calls send Sanctum bearer tokens stored in local storage/session, injected by the shared Axios interceptors.
   - Requests target `/api/v1/*` endpoints with JSON accept headers; locale headers are opt-in per feature.
3. **Application Layer**
   - Laravel controllers validate payloads inline using `$request->validate()` or dedicated FormRequest classes (e.g., `HomeRequest`) and enforce permissions with policies + middleware.
   - Controllers offload heavy domain logic to services inside `App\Services`, which compose repositories, caching, and events.
4. **Persistence Layer**
   - Eloquent models encapsulate query scopes and relationships (e.g., `Activity::forType`, `Activity::betweenDates`, `Team::volunteers`).
   - Transactions wrap multi-model writes when services touch committees, voters, or finance ledgers simultaneously.
   - Caching via `Cache::remember()` accelerates analytics dashboards; invalidation occurs in controllers/events after writes.
5. **Outbound Integrations**
   - SMS, external data fetches, and webhook stubs live under `App\Services\External` and are orchestrated via dedicated service classes.
   - Queue jobs are scaffolded for high-latency tasks (notifications, exports) and require worker activation in deployment scripts.

## Current Status | الحالة الحالية
- ✅ Axios client and caching helpers (`frontend/src/lib/api.ts`) are wired and actively used by dashboard modules.
- ⚠️ Error envelopes vary between controllers; consolidate responses into `{ code, message, details }`.
- ⚠️ Audit logging and webhook dispatchers are still TODO; skeleton events exist without downstream listeners.

## Next Steps | الخطوات التالية
- Publish DTO schemas (`frontend/src/types` & Laravel API Resources) to prevent drift between stacks.
- Normalize error envelopes (`{ code, message, details }`) and document them in the shared API client.
- Extend queue workers + retry strategies for SMS/notification flows and capture them in deployment scripts.
- Add sequence diagrams (login, activity ingestion, finance approval) under `docs/diagrams/data-flow/`.
