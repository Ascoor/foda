# API route refactor (CAMP-REORG-API-ROUTES-002)

The v1 API now aligns with the restructured campaign data model. Controllers were introduced for geographic scopes and committees, finance/volunteer routes were consolidated under a single campaign prefix, and role-aware middleware was enforced across the surface. The table below captures the significant changes.

## Before vs after

| Old route | Status | Replacement | Notes |
| --- | --- | --- | --- |
| `GET /api/v1/campaigns` | Updated | same path | Requires role `campaign_manager, area_coordinator, committee_supervisor, finance, viewer`. |
| `POST /api/v1/campaigns` | Updated | same path | Restricted to `campaign_manager`. |
| `GET/PUT/DELETE /api/v1/campaigns/{campaign}` | Updated | same path | All endpoints now enforce `campaign.context:required` and the role guards above. |
| `GET /api/v1/campaigns/{campaign}/geographic-scopes` | New | — | Returns paginated scopes (`parent_id`, `level`, `search` filters). |
| `POST /api/v1/campaigns/{campaign}/geographic-scopes` | New | — | Validates parent scope ownership. |
| `GET/PUT/DELETE /api/v1/campaigns/{campaign}/geographic-scopes/{geographic_scope}` | New | — | Dedicated CRUD controller & service. |
| `GET /api/v1/campaigns/{campaign}/committees` | Updated | same path | Driven by the new `CommitteeController`; accepts `geographic_scope_id` filter. |
| `GET /api/v1/campaigns/{campaign}/committees/geo` | Updated | same path | Guarded and ordered before committee binding to avoid conflicts. |
| `POST /api/v1/campaigns/{campaign}/committees` | Updated | same path | Validates committee scope belongs to campaign. |
| `GET/PUT/DELETE /api/v1/campaigns/{campaign}/committees/{committee}` | Updated | same path | Role middleware applied (`campaign_manager, area_coordinator` for writes). |
| `Route::apiResource('campaigns.volunteers', ...)` | Replaced | explicit routes under `/campaigns/{campaign}/volunteers` | Adds volunteer role to reader endpoints. |
| `Route::apiResource('campaigns.donations', ...)` | Replaced | explicit routes under `/campaigns/{campaign}/donations` | Finance roles required for writes. |
| `Route::apiResource('campaigns.expenses', ...)` | Replaced | explicit routes under `/campaigns/{campaign}/expenses` | Finance roles required for writes. |
| `/api/v1/campaigns/{campaign}/polling-days` (resource) | Updated | same path | Manual definitions to apply role splits. |
| `/api/v1/campaigns/{campaign}/roles` | Removed | — | Legacy controller removed from codebase. |
| `/api/v1/campaigns/{campaign}/roles/{role}` | Removed | — | Unused duplication eliminated. |
| `/api/v1/campaigns/{campaign}/sms/settings` (GET/PUT) | Removed | — | No backing controller; functionality replaced by notifications. |
| `/api/v1/ec/campaigns/*` | Removed (aliased) | Use `/api/v1/campaigns/*` | A compatibility layer now proxies the legacy namespace to the canonical controllers while clients migrate. |
| `/api/v1/ec/settings/*` | Removed | Use `/api/v1/campaigns/{campaign}/settings/*` | Consolidated into campaign-aware settings. |
| `/api/v1/analytics/*` | Updated | same paths + new `/api/v1/campaigns/{campaign}/analytics/*` | Both global and campaign-nested endpoints exist; all enforce role guards. |
| `/api/v1/home`, `/api/v1/dashboard`, `/api/v1/home/heatmap` | Removed | Use `/api/v1/campaigns/{campaign}/home`, `/dashboard`, `/home/heatmap` | Prevents conflicting dashboard responses. |

## Front-end migration notes

1. **Use the campaign namespace** – React/TS clients should call `/api/v1/campaigns/{campaign}/…` for scopes, committees, volunteers, finance, polling days, analytics, automation, and dashboard data. The legacy `/api/v1/ec/*` endpoints are no longer available.
2. **Send `X-Campaign-ID`** – Existing consumers that rely on the global analytics URLs must continue to provide `X-Campaign-ID` (or `?campaign_id=`). The new nested analytics routes automatically bind the campaign from the URL.
3. **Respect role guards** – UI flows should check the authenticated user’s role before attempting write operations. Volunteers may read volunteer lists but only campaign managers / coordinators may create or mutate them; finance staff can manage donations and expenses.
4. **Scope selector impact** – The new `GeographicScopeController` allows hierarchical browsing and creation. UI components can rely on the paginated response and `parent_id` filters when building nested pickers.
5. **Notification reads** – Mark-as-read endpoints now require at least `volunteer` role and the route parameter is numeric.

## Testing coverage

New feature tests verify geographic scope CRUD, committee CRUD, and role-aware finance/volunteer flows (`GeographyApiTest`, updated `FinanceApiTest`, `VolunteerApiTest`, `CampaignPollingDayApiTest`, and `CampaignApiTest`). Run `php artisan test` to exercise the full suite.

## Follow-up checklist

- Ensure Composer dependencies are installed (`composer install`) before running the Laravel test suite locally or in CI; missing vendors will prevent `php artisan test` from bootstrapping the framework.
