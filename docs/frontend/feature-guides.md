---
title: "Feature Guides"
author: "Frontend Guild"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Feature Guides Overview

## Purpose
- Aggregate the behaviour of major Elections360 frontend modules in one bilingual-friendly reference.
- Replace scattered README snippets within `frontend/src/features/*` with a unified, maintained document.

## Feature Matrix
| Module | Routes | Primary API Dependencies | Highlights |
| --- | --- | --- | --- |
| Dashboard | `/dashboard` | `GET /api/v1/dashboard`, analytics endpoints | Real-time stats, cached responses via TanStack Query, displays geo heatmaps and progress charts. |
| Elections | `/elections`, `/elections/:id` | `GET/POST /api/v1/elections` | Manage election metadata, schedules, and candidate rosters with detail views for each election. |
| Geo Areas | `/geo-areas`, `/geo-areas/:id` | `GET /api/v1/areas` | Map-driven dashboards showing committees and demographic overlays per area. |
| Committees | `/committees`, `/committees/:id` | `/api/v1/committees` | Assign voters, agents, and volunteers; includes filters for area and activity status. |
| Voters | `/voters`, `/voters/:id` | `/api/v1/voters` | Searchable lists with CSV export hooks and detail modals for history. |
| Candidates | `/candidates`, `/candidates/:id` | `/api/v1/candidates` | Manage candidate bios, media, and assigned volunteers. |
| Agents | `/agents` | `/api/v1/agents` | Bulk assignment workflows, CSV exports, and safe state handling (loading/error toasts). |
| Volunteers | `/volunteers` | `/api/v1/volunteers` | CRUD with committee assignments, skill tracking, and export utilities. |
| Observations | `/observations` | `/api/v1/observations` | Collect field reports, categorize by type/severity, handle attachments. |
| Campaigns | `/campaigns` | `/api/v1/campaigns` (planned) | Strategic planning dashboard for activities; integrates with notifications backlog. |
| Automation | `/automation` | `/api/v1/sms`, `/api/v1/automation` | Manage SMS sends, schedule campaigns, review delivery logs with SafeDataRenderer. |
| Settings | `/settings` | `/api/v1/settings` | Administrative toggles, role assignments, and feature flags. |
| Analytics | `/analytics` | `/api/v1/analytics` | Placeholder module for deep-dive metrics; displays `ComingSoon` component until API stabilizes. |
| Zones | `/zones/mansoura` | `/api/v1/areas`, `/api/v1/analytics/zones` | Location-specific dashboards for municipal coordination. |

## Shared UX Patterns
- **SafeDataRenderer** handles loading/empty/error states uniformly across list pages.
- **useToast** surfaces success and failure notifications using the shared Sonner wrapper.
- **AssignDialog** components support agent/volunteer assignment workflows with optimistic updates.
- **Export Buttons** rely on `export*` helpers within each module, triggering backend CSV/Excel responses.

## Development Tips
- Keep feature-specific hooks under `frontend/src/features/<module>/hooks` to maintain separation from shared contexts.
- Align translation keys with `frontend/src/i18n/locales/{en,ar}.json`; each module registers `namespace` keys for readability.
- When introducing new modules, mirror routing shape defined in `frontend/src/app/routes.tsx` and document them here immediately after merge.

## Next Actions
1. Add module-level ADRs (architecture decision records) when introducing new patterns (e.g., offline caching, maps).
2. Expand the feature matrix with owner, maturity, and analytics instrumentation columns.
3. Link to backend endpoint documentation (`docs/backend/endpoints-reference.md`) for each module.
4. Replace placeholder analytics module once API contracts are finalized.
