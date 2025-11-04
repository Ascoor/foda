# Navigation System

This folder contains the config-first navigation layer used across the dashboard. A single `nav.config.ts` file is the source of truth for the sidebar, top navigation, breadcrumbs and route guards.

## Files

- `nav.schema.ts` – Type definitions for navigation items, roles, feature flags and telemetry events.
- `nav.config.ts` – Declarative navigation tree with i18n keys, ordering and visibility rules.
- `nav.map.ts` – Pure utilities that transform the config into UI-ready trees, breadcrumb trails and guards.
- `__tests__/` – Unit and snapshot tests that validate visibility logic, telemetry and breadcrumb mapping.

## Adding a new page in under 60 seconds

1. **Declare the item** in `nav.config.ts`.
   ```ts
   {
     id: "reports.trends",
     i18nKey: "navigation.reports_trends",
     path: "/reports/trends",
     order: 30,
     surfaces: ["sidebar", "breadcrumb"],
     visibility: { roles: ["manager", "admin"], flagsAny: ["betaReports"] },
   }
   ```
   Use the `surfaces` array to decide where the item should appear (`sidebar`, `top`, `breadcrumb`). Leave it empty to fall back to sensible defaults.

2. **Add translations** for the new `i18nKey` in `src/i18n/locales/en.json` (and other locales).

3. **Create the route** in `src/app/routes.tsx` by pointing it to the relevant React component. Wrap the element with the provided guard (e.g. `<NavGuard path="/reports/trends">`).

4. **Use the breadcrumbs** if needed – components can call `getBreadcrumbTrail(location.pathname, ctx)` or rely on the shared hook exposed by the layout.

Navigation state, telemetry and badges are all derived from the config – no extra wiring is necessary.
