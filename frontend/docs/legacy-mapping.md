# Legacy to React Migration Mapping

This document maps core modules from the legacy CodeIgniter application in `/old` to the current React implementation under `frontend/src/pages`.

| Legacy Module | Legacy Path | React Page | Status |
|---------------|-------------|-----------|--------|
| Area          | `old/application/modules/area`       | _not yet implemented_ | ❌ |
| Auth          | `old/application/modules/auth`       | _not yet implemented_ | ❌ |
| Event         | `old/application/modules/event`      | _not yet implemented_ | ❌ |
| Finance       | `old/application/modules/finance`    | _not yet implemented_ | ❌ |
| Home / Dashboard | `old/application/modules/home`   | `src/pages/Dashboard.tsx` | ✅ |
| Profile       | `old/application/modules/profile`    | _not yet implemented_ | ❌ |
| Settings      | `old/application/modules/settings`   | `src/pages/Settings.tsx` | ✅ |
| SMS           | `old/application/modules/sms`        | _not yet implemented_ | ❌ |
| SNW           | `old/application/modules/snw`        | _not yet implemented_ | ❌ |
| Team          | `old/application/modules/team`       | `src/pages/Teams.tsx` | ⚠️ uses static data |
| Volunteer     | `old/application/modules/volunteer`  | _not yet implemented_ | ❌ |
| Voter         | `old/application/modules/voter`      | _not yet implemented_ | ❌ |

Additional React pages that have no direct legacy equivalent:

| React Page | Purpose |
|------------|---------|
| `src/pages/Campaigns.tsx` | Campaign management placeholder |
| `src/pages/CampaignReports.tsx` | Reporting placeholder |
| `src/pages/Analytics.tsx` | Analytics dashboard placeholder |
| `src/pages/Index.tsx` | Landing page |
| `src/pages/NotFound.tsx` | 404 handler |

> **Note:** Many legacy modules do not yet have React counterparts or are represented only by static mock data. API integration, localization, and accessibility work remain to be completed across the application.

