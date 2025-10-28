# Navigation & Route Audit

## Route Inventory (config-first)

| Path | Owner | Used By | Status | Notes |
| ---- | ----- | ------- | ------ | ----- |
| `/` | Marketing | Landing shell | Active | Public Aurora landing experience. |
| `/experience` | Marketing | Demo dashboard | Active | Alternate marketing walkthrough. |
| `/app` | Auth | PostAuthRedirect | Active | Entry point that resolves to first accessible nav item. |
| `/login` | Auth | Login page | Active | Updated guard target for unauthenticated redirects. |
| `/reports` | Reports | DashboardShell / nav.dashboard | Active | Primary post-auth destination; seeded as dashboard link. |
| `/dashboard` | Legacy | Router redirect | Redirect | Maintained for legacy bookmarks, forwards to `/reports`. |
| `/elections` | Elections | nav.elections | Guarded | Requires authenticated role. |
| `/elections/:id` | Elections | nav.elections.detail | Guarded | Breadcrumb-only entry. |
| `/geo-areas` | Geo Areas | nav.geoAreas | Guarded | Provides GIS management UI. |
| `/geo-areas/:id` | Geo Areas | nav.geoAreas.detail | Guarded | Detail breadcrumb route. |
| `/committees` | Committees | nav.committees | Guarded | Committee directory. |
| `/committees/:id` | Committees | nav.committees.detail | Guarded | Detail breadcrumb route. |
| `/voters` | Voters | nav.voters | Guarded | Voter registry workspace. |
| `/voters/:id` | Voters | nav.voters.detail | Guarded | Detail breadcrumb route. |
| `/candidates` | Candidates | nav.candidates | Guarded | Candidate management. |
| `/candidates/:id` | Candidates | nav.candidates.detail | Guarded | Detail breadcrumb route. |
| `/agents` | Field Ops | nav.fieldOps.agents | Guarded | Agents roster (under Field Ops). |
| `/volunteers` | Field Ops | nav.fieldOps.volunteers | Guarded | Volunteer management. |
| `/observations` | Field Ops | nav.fieldOps.observations | Guarded | Observation inbox. |
| `/zones/mansoura` | Field Ops | nav.fieldOps.zones | Guarded | Geo-zones drill-down. |
| `/campaigns` | Campaigns | nav.campaigns | Guarded | Campaign coordination hub. |
| `/automation` | Campaigns | nav.campaigns.automation | Guarded | Automation lab (future EG automations). |
| `/analytics` | Analytics | nav.reports | Flagged | Hidden unless `betaReports` flag present. |
| `/settings` | Settings | nav.settings | Guarded | Admin-only configuration. |
| `*` | Core | NotFound | Active | 404 catch-all. |

## Fixes & Follow-ups

- 🔄 Redirect target for `ProtectedRoute` standardised to `/login` to avoid `/auth/login` dead link.
- 📦 Navigation metadata consolidated in `src/nav/nav.config.ts` with EG-ready modules and feature flag coverage.
- 🌐 Translation keys migrated to `nav.*` namespace for easier localisation parity (AR/EN).
- 🧭 Legacy sidebar/header now hydrate from config-derived trees; remove remaining ad-hoc menus in `legacy/components/sidebar/smart` when modules are retired.
- 📊 Wire badge sources for volunteers/alerts once notification counters are live APIs.
- 🛰️ Connect `/analytics` once the `betaReports` flag is rolled out to production tenants.
