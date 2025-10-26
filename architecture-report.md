# Architecture Report: Unified `frontend`

## 1. Legacy `frontend` Overview

The original `frontend` already provided a modular layout layer (`src/app/layouts/dashboard-layout.tsx`) with animated transitions and a placeholder-driven routing table (`src/app/routes/index.tsx`) that guarded access through `useAuth` while delegating unfinished modules to `createPlaceholderPage`.【F:frontend/src/app/layouts/dashboard-layout.tsx†L1-L47】【F:frontend/src/app/routes/index.tsx†L1-L112】

Its feature set leaned heavily on analytics, operations, and administrative suites (`src/features/analytics`, `src/features/volunteers`, `src/features/voters`, `src/features/settings`), but many directories exposed only building blocks (tables, forms, charts) without page shells. Shared infrastructure was rich: advanced contexts for authentication and notifications (`src/shared/contexts/AuthContext.tsx`, `src/shared/contexts/NotificationContext.tsx`), a large UI kit exporting Tailwind/Framer components (`src/shared/ui/index.ts`), and a powerful Axios wrapper with caching/offline support (`src/shared/lib/api.ts`).【F:frontend/src/features/analytics/DashboardCharts.tsx†L1-L78】【F:frontend/src/features/volunteers/VolunteerForm.tsx†L1-L117】【F:frontend/src/shared/contexts/AuthContext.tsx†L1-L205】【F:frontend/src/shared/lib/api.ts†L1-L160】

Styling combined Tailwind with an extensive design-token sheet (`src/theme/theme.css`) and bespoke animations (`src/styles/animations.css`). The Tailwind config extended dozens of shadcn/Radix primitives and custom glassmorphism utilities.【F:frontend/src/theme/theme.css†L1-L200】【F:frontend/tailwind.config.ts†L1-L200】

## 2. `frontend-new` Architecture Summary

A lighter, productized stack existed in `frontend-new`, captured in `docs/legacy/frontend-new-architecture.md`. It emphasized focused feature pages (donations, messages, GOTV) with dedicated hooks/services, a slimmer Tailwind palette, and simplified context graph (auth, language, role, notifications, theme). The routing layer already wired production-grade pages for `/dashboard`, `/voters`, `/volunteers`, `/field-tours`, `/messages`, `/donations`, `/analytics`, `/gotv`, `/settings`, and `/volunteer`, highlighting the gap between the placeholder-heavy legacy shell and the new UI/UX vision.【F:docs/legacy/frontend-new-architecture.md†L1-L44】【F:docs/legacy/frontend-new-architecture.md†L46-L62】

## 3. Structural Differences

- **Routing:** Legacy routes deferred most destinations to placeholders, while `frontend-new` shipped complete implementations, including a volunteer-only portal. The unified router now consumes the production pages and volunteer guard.【F:frontend/src/app/routes/index.tsx†L9-L108】【F:docs/legacy/frontend-new-architecture.md†L46-L62】
- **Features:** `frontend-new` introduced end-to-end modules (donations, messages, field tours, GOTV, volunteer tasking) absent from the legacy tree. These modules have been transplanted into `frontend/src/features` with their hooks and services.【F:frontend/src/features/donations/donations-page.tsx†L1-L28】【F:frontend/src/features/messages/messages-page.tsx†L1-L34】【F:frontend/src/features/gotv/gotv-page.tsx†L1-L46】
- **Shared Layers:** The legacy stack already had comprehensive contexts. We bridged naming conventions (`auth-context.ts`, `language-context.ts`, etc.) and introduced the role context plus a realtime stub to support the new modules’ expectations.【F:frontend/src/shared/contexts/auth-context.ts†L1-L1】【F:frontend/src/shared/contexts/role-context.tsx†L1-L14】【F:frontend/src/shared/hooks/use-realtime.ts†L1-L26】
- **API Access:** `frontend-new` relied on an axios client with DTO mapping; the unified code now exposes `src/shared/api/config.ts` and `dtos.ts` while still syncing tokens with the legacy Axios wrapper.【F:frontend/src/shared/api/config.ts†L1-L61】【F:frontend/src/shared/api/dtos.ts†L1-L78】

## 4. Component & Page Inventory

- **Analytics:** `analytics-page.tsx` orchestrates KPI tiles, voter stats, volunteer progress, and heat map charts via dedicated components and the `useAnalytics` hook, backed by typed services for DTO translation.【F:frontend/src/features/analytics/analytics-page.tsx†L1-L35】【F:frontend/src/features/analytics/hooks/use-analytics.ts†L1-L40】【F:frontend/src/features/analytics/services/analytics-service.ts†L1-L65】
- **Volunteers:** The new page combines statistics, list, and task assignment modules, with hooks normalizing API responses and forms managing dynamic fields.【F:frontend/src/features/volunteers/volunteers-page.tsx†L1-L31】【F:frontend/src/features/volunteers/hooks/use-volunteers.ts†L1-L42】【F:frontend/src/features/volunteers/components/volunteer-form.tsx†L1-L211】
- **Voters:** Table, filters, and detail dialogs provide CRUD and interaction logging, with services mapping DTOs into strongly typed entities.【F:frontend/src/features/voters/voters-page.tsx†L1-L44】【F:frontend/src/features/voters/components/voter-table.tsx†L1-L149】【F:frontend/src/features/voters/services/voter-service.ts†L1-L108】
- **Donations & Messages:** Each module exposes cohesive pages coupled with hooks (`useDonations`, `useMessages`) and service layers that encapsulate serialization and optimistic updates.【F:frontend/src/features/donations/donations-page.tsx†L1-L27】【F:frontend/src/features/donations/hooks/use-donations.ts†L1-L42】【F:frontend/src/features/messages/messages-page.tsx†L1-L35】【F:frontend/src/features/messages/hooks/use-messages.ts†L1-L52】
- **Field Tours & GOTV:** Specialized panels manage scheduling and turnout alerts, leveraging services that produce notification payloads consumable by the shared context.【F:frontend/src/features/field-tours/field-tours-page.tsx†L1-L44】【F:frontend/src/features/field-tours/hooks/use-field-tours.ts†L1-L41】【F:frontend/src/features/gotv/gotv-page.tsx†L1-L45】【F:frontend/src/features/gotv/services/gotv-service.ts†L1-L69】
- **Settings:** Campaign administration now lives in `settings-page.tsx` combining user management, configuration, and permissions sub-panels with dedicated hooks/services.【F:frontend/src/features/settings/settings-page.tsx†L1-L28】【F:frontend/src/features/settings/hooks/use-settings.ts†L1-L49】【F:frontend/src/features/settings/services/settings-service.ts†L1-L90】
- **Volunteer Portal:** `/volunteer` surfaces the standalone volunteer shell while staying inside the auth guard infrastructure.【F:frontend/src/features/volunteer/volunteer-app.tsx†L1-L11】【F:frontend/src/app/routes/index.tsx†L59-L86】

## 5. Services, State & Contexts

- **Auth & Role:** `AuthContext` now normalizes a primary `role` alongside `roleNames`, enabling the role bridge in `AppProviders` to feed `RoleContext` consumers.【F:frontend/src/shared/contexts/AuthContext.tsx†L12-L112】【F:frontend/src/app/providers/index.tsx†L1-L61】
- **Notifications:** The context supports both legacy and new modules—IDs can be strings, camel/snake timestamps are normalized, and a `push` alias coexists with `pushNotification` for backwards compatibility.【F:frontend/src/shared/contexts/NotificationContext.tsx†L1-L115】【F:frontend/src/shared/contexts/NotificationContext.tsx†L175-L244】
- **API Client:** The new `apiClient` mirrors `frontend-new` behavior while delegating token persistence to the legacy helper, ensuring both stacks remain synchronized.【F:frontend/src/shared/api/config.ts†L1-L61】
- **Hooks:** `use-realtime.ts` offers a safe no-op bridge until real-time integrations are reinstated, satisfying the new hook signatures without breaking legacy consumers.【F:frontend/src/shared/hooks/use-realtime.ts†L1-L26】

## 6. Theme & Styling Comparison

The legacy theme retains an expansive variable set for glassmorphism and RTL support (`src/theme/theme.css`), while the imported modules leverage lighter semantic tokens. `docs/legacy/frontend-new-architecture.md` captures the slimmer token files (`tokens.ts`, `global.css`, `animations.css`) that informed the merged design choices. Tailwind now balances the original plugin-heavy config with the lean color semantics from the new stack.【F:frontend/src/theme/theme.css†L1-L200】【F:frontend/tailwind.config.ts†L1-L200】【F:docs/legacy/frontend-new-architecture.md†L64-L72】

## 7. Unified Architecture & Final Structure

The merged `frontend/src/features` tree now contains full implementations for analytics, voters, volunteers, donations, field tours, GOTV, messages, settings, and volunteer portal pages, eliminating placeholder routes. Routing enforces role-aware guards, and shared layers expose consistent context aliases across legacy and migrated code. The unified structure can be summarized as:

- `src/app` — providers with role bridge and fully wired routes.【F:frontend/src/app/providers/index.tsx†L1-L137】【F:frontend/src/app/routes/index.tsx†L1-L108】
- `src/features` — consolidated feature modules with pages, hooks, and services for every dashboard route.【F:frontend/src/features/analytics/index.ts†L1-L3】【F:frontend/src/features/gotv/index.ts†L1-L3】
- `src/shared` — bridged contexts (`auth-context.ts`, `language-context.ts`, `theme-context.ts`, `notification-context.ts`, `role-context.tsx`), realtime hook, API client, and UI exports including error boundary and role gate.【F:frontend/src/shared/contexts/role-context.tsx†L1-L14】【F:frontend/src/shared/ui/index.ts†L1-L62】
- `docs/legacy/frontend-new-architecture.md` — preserves the reference blueprint of the superseded `frontend-new` codebase for historical context.【F:docs/legacy/frontend-new-architecture.md†L1-L72】

## 8. Change Log

- Migrated production-ready pages, hooks, and services from `frontend-new` into `frontend/src/features`, replacing placeholder routes with working modules.【F:frontend/src/app/routes/index.tsx†L9-L108】【F:frontend/src/features/messages/messages-page.tsx†L1-L35】
- Added shared API surface, role-aware contexts, realtime stub, and UI exports to satisfy the new modules’ expectations.【F:frontend/src/shared/api/config.ts†L1-L61】【F:frontend/src/shared/hooks/index.ts†L1-L10】
- Extended providers with a role bridge and normalized auth payloads to expose `user.role` for guard logic.【F:frontend/src/app/providers/index.tsx†L1-L137】【F:frontend/src/shared/contexts/AuthContext.tsx†L12-L112】
- Archived the `frontend-new` blueprint under `docs/legacy` and removed the redundant source directory to enforce a single `frontend` entry point.【F:docs/legacy/frontend-new-architecture.md†L1-L72】
