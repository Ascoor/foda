# Navigation & Route Audit

## Route Inventory (post-migration)
| Path | Source Component | Notes |
| ---- | ---------------- | ----- |
| `/` | FloatingLandingPage | Public landing page |
| `/experience` | FloatingDashboard | Marketing demo |
| `/app` | PostAuthRedirect | Auth entry point → dynamic redirect |
| `/reports` | ReportsDashboard | New default post-auth destination |
| `/dashboard` | Navigate → `/reports` | Legacy alias preserved |
| `/elections` | ElectionsList | Guarded via nav rules |
| `/elections/:id` | ElectionDetails | Breadcrumb-only nav item |
| `/geo-areas` | GeoAreasDashboard | Guarded |
| `/geo-areas/:id` | GeoAreaDetails | Breadcrumb-only nav item |
| `/committees` | CommitteesList | Guarded |
| `/committees/:id` | CommitteeDetails | Breadcrumb-only nav item |
| `/voters` | VotersList | Guarded |
| `/voters/:id` | VoterDetails | Breadcrumb-only nav item |
| `/candidates` | CandidatesList | Guarded |
| `/candidates/:id` | CandidateDetails | Breadcrumb-only nav item |
| `/agents` | AgentsList | Guarded |
| `/volunteers` | VolunteersList | Guarded |
| `/observations` | ObservationsList | Guarded |
| `/campaigns` | CampaignsList | Guarded |
| `/automation` | AutomationDashboard | Guarded |
| `/analytics` | ComingSoon | Feature-flag gated |
| `/zones/mansoura` | ZoneDashboard | Guarded |
| `/settings` | Settings | Admin-only |

## Issues Resolved
- Introduced `ReportsDashboard` as the unified landing experience and redirected legacy `/dashboard`.
- Centralised navigation data in `src/nav/nav.config.ts`, eliminating ad-hoc sidebar definitions.
- Added breadcrumbs, top navigation and guards driven by the same configuration.
- Implemented telemetry hooks for nav clicks and guard evaluations.
- Created feature-flag aware route visibility with dynamic badge support stubs.
- Replaced the bespoke `AuthRedirect` with context-aware `PostAuthRedirect` honouring `returnTo` and nav access.

## Outstanding TODOs
- Wire real badge data sources for `volunteers` and `alerts` counters.
- Integrate analytics module once feature flag `betaReports` is released.
- Consider localising footer legal copy once copy deck is approved.
