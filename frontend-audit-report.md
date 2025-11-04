# Frontend Audit Report

## Overview
- **Footprint & structure.** The audit catalogued 156 React components across contexts, features, UI primitives, and routes using the new static-analysis scripts (`component-inventory.json`). Feature modules dominate the tree (47 feature shells and 70 feature-level components) while only four page-level exports exist, signalling a monolithic dashboard-first topology that lacks clear page segmentation.【108d33†L1-L18】
- **State providers stack.** `App.tsx` nests seven global providers (query client, feature flags, auth, campaign, theme, language, notifications) around the router; there is no Suspense or error boundary at the shell level, so any provider failure bubbles to a white screen.【F:frontend/src/App.tsx†L1-L42】
- **Routing bottlenecks.** `features/app/routes.tsx` eagerly imports every feature screen and wraps 21 dashboard routes in `NavGuard` without lazy loading, producing a large initial bundle and re-render churn on guard updates.【F:frontend/src/features/app/routes.tsx†L63-L245】【6feb88†L1-L9】【964f66†L1-L2】
- **TanStack Query usage.** 25 query/mutation hooks were detected, but 11 have undefined or dynamically built `queryKey`s and only one sets `staleTime`, undermining cache stability and re-fetch control.【3eaa62†L1-L2】【557c7d†L1-L2】【ecde57†L1-L2】
- **Internationalisation & RTL.** The scan surfaced 79 missing keys per locale, 107 unused keys, and 82 duplicate `t()` usages. Several UI surfaces (e.g., Live Operations map, geo-area controls) ship hardcoded English strings and directional classes (`mr-*/ml-*`), breaking RTL parity.【b77bd0†L1-L4】【e5d052†L1-L4】【6ad64b†L1-L2】【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L224-L355】【F:frontend/src/infrastructure/shared/ui/enhanced-geo-areas-list.tsx†L141-L168】
- **Design system drift.** Only 14 components consume Radix primitives and merely one component is memoized; 84 components expose no typed props, hinting at reuse gaps and prop drilling without memoization.【e4a9de†L1-L2】【16721f†L1-L2】【ad2e8b†L1-L2】
- **Dependency hygiene.** Madge flagged 40+ orphaned barrel files and depcheck reported unused runtime deps (`@types/jest`, `leaflet.heat`, `pusher-js`) plus a missing `geojson` runtime import that currently falls back to a stub heat-layer shim.【F:dependency-analysis.json†L1900-L1932】【F:dependency-analysis.json†L1985-L2007】【F:frontend/src/infrastructure/shared/vendor/leaflet-heat-stub.ts†L1-L29】
- **Performance headroom.** The production build still emits a 718 kB `vendor` chunk and 356 kB `react-core` chunk even after manual chunking; the generated `frontend/dist/analyze.html` highlights the need for route-level splitting and icon pruning.【76aac8†L1-L17】
- **Leaflet experience.** Live map data is fetched imperatively per mount, toasts use raw API strings, and there is no retry strategy. Lazy-loading the canvas helps, but the parent card still renders English-only UI copy and exposes reset buttons without locale-aware labels.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L85-L343】
- **Tooling deliverables.** New scripts under `frontend/scripts/` automate dependency, component, route, query, and i18n audits; outputs land at the repo root (`component-inventory.json`, `routes-map.json`, `queries-map.json`, `i18n-coverage.json`, `dependency-analysis.json`).

### Top 10 Recommendations
1. **Introduce route-level code splitting and suspense guards**—wrap feature imports in `React.lazy`/`Suspense` and add error boundaries inside `features/app/routes.tsx` to cut the 718 kB vendor payload and improve crash resilience.【F:frontend/src/features/app/routes.tsx†L63-L245】【76aac8†L1-L17】
2. **Normalize TanStack Query keys** by centralizing `campaignId` and other identifiers (e.g., build a `useStableCampaignKey` helper) and configure sensible `staleTime`/`gcTime` defaults in `App.tsx`.【F:frontend/src/App.tsx†L1-L42】【557c7d†L1-L2】
3. **Fill the i18n gaps**—populate the 79 missing keys per locale and eliminate the 107 unused entries; replace hardcoded English copy in map dashboards and filters with `t()` lookups.【b77bd0†L1-L4】【e5d052†L1-L4】【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L224-L355】
4. **Adopt logical direction utilities** (e.g., Tailwind `ms/me` or `rtl:` variants) to replace `mr-*/ml-*` in shared UI such as `EnhancedGeoAreasList`, preventing mirrored layouts in RTL mode.【F:frontend/src/infrastructure/shared/ui/enhanced-geo-areas-list.tsx†L141-L168】
5. **Prune or wire orphaned barrel files** uncovered by Madge—most `index.ts` barrels under `features/*` are unused and can be removed or referenced explicitly to avoid skewed import maps.【F:dependency-analysis.json†L1900-L1932】
6. **Install the real `leaflet.heat` plugin and geojson typings** to replace the stub shim and satisfy depcheck’s missing dependency warnings before map heat layers hit production.【F:dependency-analysis.json†L1985-L2007】【F:frontend/src/infrastructure/shared/vendor/leaflet-heat-stub.ts†L1-L29】
7. **Broaden memoization & prop typing**—introduce `React.memo`/`useMemo` around expensive feature tables and annotate props for the 84 untyped components to reduce unnecessary re-renders.【ad2e8b†L1-L2】【16721f†L1-L2】
8. **Automate a11y linting** by wiring `@axe-core/react` (dev-only) and adding high-level checks for focus order within complex cards such as `LiveOperationsMap` filters.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L224-L355】
9. **Reconcile translation usage** by deleting the 82 duplicate keys surfaced in `i18n-coverage.json` and consolidating common copy into shared namespaces.【6ad64b†L1-L2】
10. **Document and enforce query conventions** via lint rules or custom ESLint plugin so that new hooks include `enabled`, `placeholderData`, and loader states; the current 25 hooks lack uniform patterns.【3eaa62†L1-L2】【557c7d†L1-L2】

## Inventory
- **Component counts.** 156 exports detected; category split: contexts (6), feature shells (47), feature components (70), pages (4), shared utilities (13), UI primitives (14), routes (2).【aaaa43†L1-L2】【108d33†L1-L18】
- **Prop coverage.** 84 components expose zero inferred props (often relying on implicit `children`), leaving consumers without typings for configuration.【ad2e8b†L1-L2】 
- **Hook usage.** `useTranslation` is imported in 61 components, indicating most copy is localized but also explaining the volume of duplicate keys; core React hooks follow (`useState` 42, `useEffect` 31).【df0767†L1-L20】
- **Memoization.** Only one export is memoized, suggesting many list/grid renderers will re-render on parent state changes.【16721f†L1-L2】
- **Radix/shadcn adoption.** 14 components leverage Radix primitives and many rely on custom Tailwind classes, signalling partial but inconsistent usage of the design system.【e4a9de†L1-L2】

Generated file: `component-inventory.json`.

## Routing Map
- **Static imports.** All dashboard routes import feature modules eagerly; none set `lazy`, `loader`, or `errorElement`, so they block the main chunk and surface runtime errors globally.【F:frontend/src/features/app/routes.tsx†L63-L245】【964f66†L1-L2】
- **Guards.** 21 child routes sit behind `NavGuard` in addition to the top-level `ProtectedRoute`, compounding re-render cost when navigation context updates.【F:frontend/src/features/app/routes.tsx†L75-L243】【6feb88†L1-L9】
- **Shell instrumentation.** `RouterShell` is wrapped in `BarbaTransitionProvider` without Suspense boundaries, and `MainLayoutWrapper` re-computes `data-barba-namespace` on every render, which could be memoized.【F:frontend/src/features/app/routes.tsx†L35-L115】

Generated file: `routes-map.json`.

## State & Query
- **Hook inventory.** 25 TanStack Query hooks were detected across features (`queries-map.json`).【3eaa62†L1-L2】
- **Key stability.** 11 hooks omit a `queryKey` (or build it lazily in the options object), preventing cache deduping and causing refetch storms; only one sets `staleTime`, meaning most queries revert to defaults.【557c7d†L1-L2】【ecde57†L1-L2】
- **Campaign context.** `CampaignContext` stores the identifier in module state + `localStorage` but downstream queries such as `ElectionsList` do not incorporate `campaignId` in their keys or API params, so switching campaigns risks stale data.【F:frontend/src/infrastructure/shared/contexts/CampaignContext.tsx†L23-L52】【F:frontend/src/infrastructure/shared/lib/campaign.ts†L3-L67】【F:frontend/src/features/features/elections/List.tsx†L33-L64】【F:frontend/src/features/features/elections/api.ts†L17-L24】
- **Manual fetching.** Some map screens (e.g., `LiveOperationsMap`) manage async state with `useEffect` rather than Query, bypassing retries, caching, and error surfaces.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L85-L155】

Generated file: `queries-map.json`.

## Performance
- **Bundle output.** Latest production build emits `dist/analyze.html` plus a 718 kB `vendor` chunk, 356 kB `react-core`, and 287 kB `charts-core`—all above modern thresholds, largely because every feature is bundled into the dashboard shell.【76aac8†L1-L17】
- **Leaflet heatmap.** `LiveOperationsMapCanvas` imports `leaflet.heat` via a stub; without the actual plugin the heat layer is a no-op, and even when installed it should be dynamically imported to keep the default bundle lean.【F:frontend/src/features/features/dashboard/components/LiveOperationsMapCanvas.tsx†L1-L158】【F:frontend/src/infrastructure/shared/vendor/leaflet-heat-stub.ts†L1-L29】
- **Memoization gaps.** Only one memoized component plus 84 prop-less exports leads to repeated recalculation during state changes (e.g., filters in `LiveOperationsMap`).【16721f†L1-L2】【ad2e8b†L1-L2】【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L204-L355】
- **Static routing.** No `React.lazy` or `Suspense` on route elements, preventing code-splitting at navigation boundaries.【F:frontend/src/features/app/routes.tsx†L63-L245】

Generated file: `frontend/dist/analyze.html`.

## A11y
- **Dev tooling.** No `@axe-core/react` or related tooling is wired in the Vite app; adding it in development would catch regressions automatically.【F:frontend/package.json†L7-L73】
- **Copy semantics.** Live map cards use plain English strings (“Live field operations”, “Reset”, “Loading map overlays…”) without translation, and the filter legend uses color-only cues—screen readers receive no context for badge semantics.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L214-L355】
- **Focus order.** Filter buttons and `Select` controls are rendered inside decorative `div` wrappers without additional focus indicators; pair with focus rings from shadcn (`focus-visible:ring`) for clearer keyboard affordances.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L244-L312】
- **Map controls.** Leaflet popups include raw numbers without headings; use semantic markup (`<dl>`/`<dt>`) to make stats understandable to screen readers.【F:frontend/src/features/features/dashboard/components/LiveOperationsMapCanvas.tsx†L129-L155】

## i18n / RTL
- **Coverage.** 79 keys missing in each locale, 107 unused, 82 duplicates—cleaning them will shrink bundles and improve runtime fallback behaviour.【b77bd0†L1-L4】【e5d052†L1-L4】【6ad64b†L1-L2】
- **Hardcoded strings.** Map dashboards, CTA buttons, and filters render English text; use `t()` across `LiveOperationsMap` and marketing pages to respect locale switching.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L224-L355】
- **Directional classes.** Buttons in `EnhancedGeoAreasList` apply `mr-1/ml-1` which flip incorrectly in RTL. Replace with logical properties (`me-1`, `ms-1`) or variant utilities tied to `dir` state.【F:frontend/src/infrastructure/shared/ui/enhanced-geo-areas-list.tsx†L141-L168】
- **Language provider.** `LanguageProvider` updates `<html dir>` and caches the choice, so adding CSS logical props will finish RTL support.【F:frontend/src/infrastructure/shared/contexts/LanguageContext.tsx†L38-L107】

Generated file: `i18n-coverage.json`.

## UI / Design System
- **Shadcn usage.** Many feature cards recreate gradients and glass morphism manually instead of using shadcn wrappers (e.g., `LiveOperationsMap`, `EnhancedGeoAreasList`), leading to inconsistent paddings and focus styles.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L224-L355】【F:frontend/src/infrastructure/shared/ui/enhanced-geo-areas-list.tsx†L141-L206】
- **Badge semantics.** Status badges on the map rely on color to convey meaning; swap to `Badge` variants with icons or text for clarity.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L235-L352】
- **Prop typing.** Absence of prop interfaces (84 components) suggests many components rely on implicit prop spreading, making design tokens harder to enforce; add typed prop objects with union literals for variant control.【ad2e8b†L1-L2】

## Leaflet / Maps
- **Data lifecycle.** `LiveOperationsMap` fetches committees and activities imperatively without retries or background refresh; migrate to TanStack Query with `keepPreviousData` and `refetchInterval` so map motion stays fluid.【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L85-L155】
- **Heat layer dependency.** `leaflet.heat` is missing—depcheck lists it unused/missing yet the canvas expects `L.heatLayer`; install the real plugin and remove the stub guard once verified.【F:dependency-analysis.json†L1985-L2007】【F:frontend/src/infrastructure/shared/vendor/leaflet-heat-stub.ts†L1-L29】
- **RTL direction.** Leaflet respects container direction; ensure surrounding wrappers set `dir` via LanguageContext to avoid flipped tiles and check `MapContainer` inherits this context.【F:frontend/src/infrastructure/shared/contexts/LanguageContext.tsx†L66-L82】【F:frontend/src/features/features/dashboard/components/LiveOperationsMapCanvas.tsx†L113-L158】

## Security
- **Campaign scoping.** `buildCampaignUrl` falls back to campaign "1" when `localStorage` is unavailable; ensure backend permissions align so stale IDs don’t leak data, and guard API responses with schema validation before toasting messages.【F:frontend/src/infrastructure/shared/lib/campaign.ts†L3-L67】【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L100-L148】
- **Form validation.** Election forms rely on `zod` but submit handlers mutate data without server-side error guards (e.g., `createElection` errors bubble to console). Wrap mutations in `try/catch` and surface toast errors for robustness.【F:frontend/src/features/features/elections/List.tsx†L33-L181】【F:frontend/src/features/features/elections/Form.tsx†L31-L140】

## Auto-Fixes Applied
- Added a conditional `rollup-plugin-visualizer` integration in `vite.config.ts` and generated `frontend/dist/analyze.html` for bundle inspection.【F:frontend/vite.config.ts†L1-L41】【76aac8†L1-L17】
- Authored reusable audit scripts (`frontend/scripts/*.ts`) to emit component, route, query, i18n, and dependency reports (see `frontend/scripts/dist/` output).【F:frontend/scripts/scan-components.ts†L1-L206】【F:frontend/scripts/scan-routes.ts†L1-L113】【F:frontend/scripts/scan-queries.ts†L1-L106】【F:frontend/scripts/scan-i18n.ts†L1-L125】【F:frontend/scripts/analyze-deps.ts†L1-L121】

## Action Plan
| Priority | Effort | Scope | Recommendation |
| --- | --- | --- | --- |
| High | Medium | `features/app/routes.tsx`, feature modules | Wrap heavy routes in `React.lazy`/`Suspense`, add route-level error boundaries, and split vendor chunks to shrink the 700 kB+ payload.【F:frontend/src/features/app/routes.tsx†L63-L245】【76aac8†L1-L17】 |
| High | Medium | Query hooks (`features/**`), `CampaignContext` | Create a shared query-key helper that injects `campaignId`, add default `staleTime`/`gcTime`, and migrate manual fetches (maps) onto TanStack Query with `keepPreviousData`.【F:frontend/src/infrastructure/shared/contexts/CampaignContext.tsx†L23-L52】【F:frontend/src/features/features/elections/List.tsx†L33-L64】 |
| High | High | `src/infrastructure/i18n/locales/*.json`, map/dashboard screens | Populate missing translation keys, remove unused entries, and replace hardcoded English strings plus directional classes with localized, logical equivalents.【b77bd0†L1-L4】【e5d052†L1-L4】【F:frontend/src/features/features/dashboard/components/LiveOperationsMap.tsx†L224-L355】 |
| Medium | Medium | `frontend/scripts/`, package deps | Install real `leaflet.heat` + `geojson`, remove orphan barrels flagged by Madge, and document dep hygiene to keep `dependency-analysis.json` clean.【F:dependency-analysis.json†L1900-L2007】 |
| Medium | Low | Shared UI components | Replace `mr-/ml-` with logical spacing utilities and introduce memoization/typed props on shared lists to improve RTL and rendering performance.【F:frontend/src/infrastructure/shared/ui/enhanced-geo-areas-list.tsx†L141-L168】【ad2e8b†L1-L2】 |
| Medium | Low | Tooling | Wire `@axe-core/react` in development and add vitest/pa11y smoke checks to catch a11y regressions automatically.【F:frontend/package.json†L7-L73】 |
