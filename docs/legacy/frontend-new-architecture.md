# frontend-new Architecture Snapshot

## Directory Structure

- `src/app`
  - `layouts/dashboard-layout.tsx` — shell combining header/sidebar with routed content.
  - `providers/index.tsx` — composes React Query, i18next, auth, role, theme, language, and notification providers.
  - `routes/index.tsx` — router wiring landing, login, volunteer portal, and dashboard routes with guards.
- `src/features`
  - `analytics` — includes `analytics-page.tsx`, chart components (`heat-map.tsx`, `volunteer-progress-chart.tsx`, `voter-stats-chart.tsx`), hooks, and an API service for KPIs.
  - `dashboard` — animation-rich dashboard page plus shared cards (`activity-chart.tsx`, `campaign-map.tsx`).
  - `donations` — page with `components/donation-form.tsx`, `donation-list.tsx`, `donation-summary.tsx`, a `use-donations` hook, and REST service helpers.
  - `field-tours` — scheduling UI with `field-tours-page.tsx`, creator/editor components, hooks, and DTO mapping services.
  - `gotv` — GOTV turnout monitors, alerts panel, WebSocket-friendly hooks, and API adapters.
  - `landing` — animated marketing landing page with CTA and feature tiles.
  - `login` — gradient login experience hooking into the auth context.
  - `messages` — outbound messaging workflow (composer, scheduler, history) backed by message services and hooks.
  - `settings` — campaign configuration surface combining users, permissions, and branding panels with supporting hooks/services.
  - `volunteer` — placeholder volunteer mobile shell.
  - `volunteers` — volunteer management (stats, list, form, task assignment) plus data services and hooks.
  - `voters` — voter table, detail dialog, and interaction logging with service mappers.
- `src/i18n`
  - `config.ts` — i18next bootstrap using explicit namespaces.
- `src/shared`
  - `api/config.ts` — axios client factory with auth token handling and response guards.
  - `api/dtos.ts` — DTO contracts for voters, volunteers, donations, GOTV, analytics, and notifications.
  - `contexts` — lightweight contexts for auth, language, notifications, role, and theme.
  - `hooks` — re-exporters (`use-auth`, `use-language`, `use-theme`, `use-role`, `use-realtime`).
  - `ui` — motion-enhanced primitives: button, card, header, sidebar, stat card, notification list, role gate, and error boundary.
- `src/theme`
  - `global.css`, `animations.css`, `colors.ts`, `motion.ts`, `tokens.ts`, and SVG patterns define the lighter design system.

## Routing Highlights

- Landing (`/`) redirects authenticated users straight to `/dashboard`.
- `/login` surfaces the redesigned auth page.
- `/volunteer` exposes the dedicated volunteer shell requiring `role="volunteer"`.
- The protected dashboard routes include `/dashboard`, `/voters`, `/volunteers`, `/field-tours`, `/messages`, `/donations`, `/analytics`, `/gotv`, and `/settings`.

## Services & State

- API helpers rely on `apiClient` with bearer-token interceptors and DTO mappers to normalize shapes.
- Hooks such as `use-donations`, `use-messages`, `use-gotv`, `use-settings`, `use-volunteers`, and `use-voters` orchestrate fetching, optimistic updates, and derived summaries.
- Notification context tracks unread counts and supports push updates from GOTV streams.

## Theming Notes

- Theme tokens enumerate spacing, typography, elevations, radii, and brand colors (`tokens.ts`).
- `global.css` applies Tailwind base layers plus radial gradients, while `animations.css` codifies shared motion curves.
- Tailwind config trims down to core color CSS variables with `hsl(var(--token) / <alpha-value>)` helpers.
