# Documentation & Data Governance Report

## 1. Document Inventory & Classification
The tables below consolidate all Markdown documentation that currently ships with the repository (excluding third-party dependencies) and align them with the requested knowledge base categories.

| Category | Description | Key Files | Notes |
| --- | --- | --- | --- |
| Architecture Docs | High-level system and data architecture references that describe tiers, runtime integrations, and information flow. | `docs/ARCHITECTURE.md`, `docs/DATA_FLOW.md`, `docs/INTEGRATION/README.md`, `docs/INTEGRATION/FRONTEND_ALIGNMENT.md`, `docs/INTEGRATION/DATA_LIFECYCLE.md` | Architecture coverage is solid but lacks updated diagrams and infrastructure topology.
| Feature Docs | API- or feature-specific specs spanning backend endpoints and frontend user journeys. | `backend/docs/API.md`, `backend/docs/area.md`, `backend/docs/auth.md`, `backend/docs/event.md`, `backend/docs/finance.md`, `backend/docs/home.md`, `backend/docs/settings.md`, `backend/docs/sms.md`, `backend/docs/swot.md`, `backend/docs/team.md`, `backend/docs/volunteers.md`, `backend/docs/voter.md`, feature READMEs under `frontend/src/features/*/README.md` | Backend feature docs focus on endpoint summaries; frontend READMEs are terse (often one-liners) and should be expanded with UX flows and state charts.
| UI/UX Docs | Documentation dedicated to design systems, component guidelines, or interaction patterns. | *(None found)* | Recommend adding design rationale for shadcn/ui usage and layout behavior to align engineers and designers.
| Models & Schemas | Descriptions of data entities, migrations, and shared type contracts. | `frontend/src/types/*.ts`, migration descriptions referenced in `docs/APP_LOGIC_REVIEW.md`, domain coverage in `docs/INTEGRATION/REPORTS_OVERVIEW.md` | Frontend types are comprehensive but drift from backend table fields (e.g., `Campaign`, `Voter`); no canonical schema catalog exists.
| Process / DevOps / CI | Operational runbooks, delivery plans, and security practices. | `README.md`, `backend/README.md`, `frontend/README.md`, `docs/SYSTEM_SETUP.md`, `docs/SECURITY_POLICY.md`, `docs/DEVELOPMENT_PLAN.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/APP_LOGIC_REVIEW.md`, `docs/EXECUTION_PLAN_AR.md` | Processes are documented but not version-controlled per release; add CI checklist and doc-review workflow under `docs/review/` as recommended below.
| Legacy / Deprecated | Superseded modules or migration guidance. | `frontend/src/legacy/*` (no READMEs) | Legacy folder lacks narrative; add migration notes and deprecation timelines to avoid regressions.

> **Inventory summary:** 30 curated documentation files were catalogued. Adding UI/UX and Legacy narratives will close the only empty categories.

## 2. Data Lifecycle Trace (Source → Analytics)

| Phase | Responsibilities | Primary Assets | Validation / Risks |
| --- | --- | --- | --- |
| **Ingestion** | Domain entities seeded and persisted through Laravel migrations and factories. | Database migrations such as `backend/database/migrations/2024_08_02_000000_create_voters_table.php`; seed logic referenced in `docs/INTEGRATION/DATA_LIFECYCLE.md`; Eloquent models (`backend/app/Models/*.php`). | FormRequest classes (`backend/app/Http/Requests/*`) enforce field-level validation (e.g., `StoreVoterRequest` requires `voter_id` uniqueness). Gaps: some controllers (e.g., ElectionCircle `CampaignController`) call `$request->all()` without validation.
| **Processing** | Services and controllers coordinate business rules, caching, and domain events. | API controllers under `backend/app/Http/Controllers/Api/V1` (e.g., `VoterController` for CRUD/import/export, `AnalyticsController` for aggregation); service layer stubs in `backend/app/Services`. | `HandlesIndexRequests` trait standardizes pagination/filtering. Several services are placeholders (`VoterService`)—risk of logic leaking into controllers.
| **Storage** | Data persisted via Eloquent models and relationships. | Models such as `Area`, `Voter`, and ElectionCircle aggregates; pivot relations defined in models; queue-ready caching in `AnalyticsController`. | Missing explicit soft-delete policies and archival strategy; consider enabling `SoftDeletes` for voter/campaign data and documenting retention windows.
| **Exposure (API)** | REST endpoints exposed under `/api/v1` via Laravel routes. | `backend/routes/api.php` maps resources, including analytics, voters, and election circle endpoints. Responses leverage API Resources (`backend/app/Http/Resources`). | Response envelopes vary; some endpoints stream CSV (e.g., `VoterController::export`) without pagination. Need standardized `{ data, meta }` contract per governance policy.
| **Consumption (Frontend)** | React 18 + TanStack Query modules consume APIs, manage caches, and present UI. | Shared Axios wrapper (`frontend/src/shared/lib/api.ts`), endpoint registry (`frontend/src/shared/lib/endpoints.ts`), feature-level API hooks (`frontend/src/features/voters/api.ts`, `frontend/src/features/analytics/api.ts`). | Frontend types (e.g., `frontend/src/types/Voter.ts`) diverge from backend payload shape (`name` vs. `full_name`, `committee_id` vs. `committee_uuid`). Requires schema harmonization or transformers.
| **Visualization / Analytics** | Aggregation endpoints and dashboards convert data into insights. | `AnalyticsController` computes cached KPIs/forecasts; frontend dashboards (`frontend/src/features/analytics/Analytics.tsx`, `DashboardCharts.tsx`) render charts. | Cache TTL configured (5 minutes for overview, 24 hours for forecast). Need monitoring to invalidate caches after bulk imports and to align metrics with actual domain terminology.

Sequence summary:
1. **Ingestion:** migrations + factories create voters, areas, campaigns. FormRequests validate runtime writes.
2. **Processing:** controllers query models, optionally offload to services. Analytics aggregator collects metrics with caching.
3. **Exposure:** routes register resources with Sanctum guards; CSV exports bypass JSON schema.
4. **Consumption:** Axios client adds auth headers, caches GET requests, and feeds feature hooks.
5. **Visualization:** React charts show analytics; forecast endpoint supplies projections with bounded history window.

## 3. Documentation Hierarchy Blueprint

```
Documentation/
├─ Architecture/
│  ├─ 01-system-overview.md   ← Source: docs/ARCHITECTURE.md
│  ├─ 02-data-lifecycle.md    ← New synthesis of Section 2 above + docs/DATA_FLOW.md
│  ├─ 03-security-compliance.md ← Draw from docs/SECURITY_POLICY.md
│  └─ 04-devops-pipeline.md   ← Extend docs/SYSTEM_SETUP.md with CI/CD steps
├─ Backend/
│  ├─ apis/
│  │  └─ voter.md             ← Move backend/docs/voter.md (keep per-feature API specs)
│  ├─ models-schemas/
│  │  └─ voter-table.md       ← Add migration + resource mapping per entity
│  └─ integrations/
│     └─ external-data.md     ← Consolidate docs/INTEGRATION/REPORTS_OVERVIEW.md
├─ Frontend/
│  ├─ features/
│  │  └─ voters.md            ← Expand frontend/src/features/voters/README.md
│  ├─ components/
│  │  └─ ui-guidelines.md     ← **New**: document shadcn/ui theming + accessibility
│  └─ ux/
│     └─ journeys.md          ← Capture end-to-end flows per persona
├─ Shared/
│  ├─ contexts-hooks.md       ← Describe shared React context/hooks
│  ├─ utilities.md            ← Document `frontend/src/shared/lib` + backend helpers
│  └─ types.md                ← Contract registry linking TS types ↔ API resources
└─ Legacy/
   ├─ deprecated-modules.md   ← Explain `frontend/src/legacy`
   └─ migration-paths.md      ← Outline replacement strategy and timelines
```

**Immediate steps**
1. Create `docs/Documentation/README.md` that links to each subtree and sets naming conventions.
2. Schedule a doc consolidation sprint to migrate existing files into the above structure (maintain Git history via `git mv`).
3. Automate linting for docs (e.g., `markdownlint`) and enforce PR templates referencing this hierarchy.

## 4. Data Domains & Stewardship Matrix

| Domain | Subdomains | Key Data Assets | API & Frontend Touchpoints | Governance Notes |
| --- | --- | --- | --- | --- |
| Users | Auth, Roles, Profiles | `backend/app/Models/User.php`, `backend/app/Models/Role.php`, Sanctum tokens; migrations `2014_10_12_000000_create_users_table.php` | `AuthController`, `ProfileController`, `frontend/src/shared/lib/api.ts` auth token management | Need centralized RBAC matrix and token revocation policy; document login session handling in Frontend docs.
| Campaigns | Analytics, Activities | `backend/app/Models/ElectionCircle/Campaign.php`, `backend/app/Http/Controllers/ElectionCircle/CampaignController.php`, analytics aggregations in `AnalyticsController` | Frontend campaign APIs (`frontend/src/features/campaigns/api.ts`), analytics dashboards | Validation gap between frontend `Campaign` type (status/goals) and backend model (name/description/election_id). Establish DTO or transformation layer.
| GeoAreas | Zones, Observations | `backend/app/Models/Area.php`, `backend/app/Http/Controllers/Api/V1/AreaController.php`, committee geo endpoints | Frontend geo modules (`frontend/src/features/geo-areas/*`), heatmap dashboards | Ensure geometry fields & map config (see `docs/INTEGRATION/FRONTEND_ALIGNMENT.md`) are tracked; add caching invalidation policy for area edits.
| Elections | Candidates, Voters | ElectionCircle controllers (`backend/app/Http/Controllers/ElectionCircle/*`), `backend/app/Models/Voter.php`, `frontend/src/features/voters/*` | API endpoints `/api/v1/ec/*`, voter imports/exports (`VoterController`), frontend voters feature | Schema drift between TS `Voter` type and database table; importer lacks sanitization beyond CSV header matching—add mapping & error handling.
| Marketing | Landing, Partners, Testimonials | *(No dedicated backend models yet; marketing data currently front-loaded in `home` endpoints)* | `backend/app/Http/Controllers/Api/V1/HomeController.php`, `frontend/src/features/dashboard/*` | Define owner/steward before launch; add doc stubs for marketing copy, partner logos, testimonial management.

## 5. Governance Roles, Policies & Tooling

- **Roles**
  - *Documentation Lead:* curates the hierarchy, approves structural changes, and owns `docs/Documentation/README.md`.
  - *Data Steward:* reviews schema updates, ensures FormRequests/migrations stay aligned with frontend types, and audits caches (analytics, exports).
  - *Feature Engineers:* update relevant docs on every feature branch and link PRs to affected knowledge base entries.

- **Update Protocol**
  1. Create docs in feature branches alongside code changes.
  2. Stage updates under `docs/review/<feature-id>/` before moving them into the canonical hierarchy.
  3. Require peer review from both Documentation Lead and Data Steward for schema-affecting PRs.
  4. Run CI checks (`npm run lint-docs` once configured, `php artisan test`, `pnpm lint`) to ensure doc + code consistency.
  5. Upon approval, merge into `main` and archive superseded docs under `Documentation/Legacy/`.

- **Recommended Tooling**
  - `npx typedoc` for automated TypeScript API documentation (frontend `src` + shared types).
  - `php artisan schema:dump` + `npx json2yaml` to export schema snapshots consumed by frontend types.
  - `codex audit docs` (or markdownlint) to enforce formatting and broken-link checks.
  - Integrate doc coverage into CI by counting Markdown updates vs. touched domains.

## 6. Governance Readiness Dashboard

| Area | Status | Highlights |
| --- | --- | --- |
| Architecture Docs | ✅ Ready | Up-to-date overview and data flow narratives exist; needs diagrams for completeness.
| Frontend Docs | ⚠ Partial | Feature READMEs exist but lack UX guidance and state diagrams.
| Backend Models & Schemas | ⚠ Partial | Core migrations/models present, yet schema/type drift observed (Voter, Campaign) and some controllers skip validation.
| Legacy Docs | ❌ Missing | Legacy React folder has no documentation; migration paths must be authored.
| Data Lifecycle | ✅ Mapped | End-to-end flow verified in Section 2 with explicit assets and risks.
| Governance Policy | ✅ Drafted | Roles, protocol, and tooling defined in Section 5; requires operational adoption.

---
**Next Milestones**
1. Migrate docs into the proposed hierarchy and add missing UI/UX + legacy narratives.
2. Align backend resources with frontend types (introduce transformers or adjust DTOs) and document the canonical schema catalog.
3. Automate documentation linting and governance checks inside CI to make the protocol enforceable.
