# Application Audit & Modular Transformation Plan

## 1. Current State Summary

### Strengths
- **Well-factored API access layer.** The front-end wraps Axios with URL normalisation, automatic bearer token propagation and opt-in client caching hooks, reducing duplication across feature modules.【F:frontend/src/shared/lib/api.ts†L9-L183】
- **Centralised navigation model.** Route rendering relies on a single navigation mapper with visibility rules for roles, feature flags, device types and auth state, ensuring consistent sidebar, breadcrumb and guard behaviour.【F:frontend/src/nav/nav.map.ts†L1-L197】【F:frontend/src/app/routes.tsx†L61-L199】
- **Rich feature toggle support.** Feature flags are parsed from environment variables or runtime sets and exposed through a dedicated context, enabling gradual feature rollout without scattering stateful conditionals.【F:frontend/src/shared/contexts/FeatureFlagContext.tsx†L1-L115】
- **Back-end guards critical operations.** Login revokes previous tokens, issues scoped sanctum tokens and records the login timestamp, while protected route groups enforce authentication before exposing domain resources.【F:backend/app/Http/Controllers/Api/V1/AuthController.php†L37-L127】【F:backend/routes/api.php†L50-L123】
- **Domain models encapsulate permissions.** The `User` model leverages Sanctum and Spatie roles while hiding sensitive attributes from serialisation, keeping downstream consumers insulated from password leaks.【F:backend/app/Models/User.php†L9-L65】

### Weaknesses
- **Legacy auth UX hard-codes control flow.** The React login form still pushes directly to `/dashboard`, bypassing the newer navigation defaulting strategy and central redirect helper, which leads to inconsistent landing destinations.【F:frontend/src/legacy/components/auth/LoginForm.tsx†L40-L48】
- **Registration policy is implicit.** The registration request authorises everyone (`authorize(): true`) and depends entirely on the route middleware to enforce admin-only creation, making policy drift harder to detect during refactors.【F:backend/app/Http/Requests/RegisterRequest.php†L9-L21】
- **Password reset email delivery unfinished.** The password controller still carries a TODO about configuring mail settings, signalling the workflow may silently fail in production without infrastructure follow-up.【F:backend/app/Http/Controllers/Api/V1/PasswordController.php†L13-L62】
- **Monolithic API route file.** The v1 route definition stretches hundreds of lines mixing analytics, elections and integration endpoints, complicating discoverability and making it harder to scope rate limiting or middleware per domain.【F:backend/routes/api.php†L5-L149】

### Risks
- **Session leakage across browser contexts.** The API wrapper shares a process-wide Axios instance and mutates global defaults, so embedding the SDK in external sites could unintentionally attach election tokens to other hosts without careful isolation.【F:frontend/src/shared/lib/api.ts†L11-L105】
- **Admin onboarding surface.** Because registration relies on middleware, any future route duplication that omits `role:admin` could expose self-service admin account creation if the request object continues to authorise blindly.【F:backend/app/Http/Requests/RegisterRequest.php†L9-L21】
- **Stalled notification UX.** Login and register flows still live under `legacy/` with bespoke validation, so future marketing-driven redesigns risk diverging from the shared auth context unless the module boundary is enforced.【F:frontend/src/legacy/components/auth/LoginForm.tsx†L19-L188】

## 2. Module Map

### Front-end
| Module | Responsibilities | Boundaries & Dependencies |
| --- | --- | --- |
| **App Shell (`src/app`)** | Router shell, route tree wiring, layout composition and guard orchestration.【F:frontend/src/app/routes.tsx†L1-L199】 | Depends on legacy layout components, navigation utilities and auth guard context. |
| **Auth Module (`src/modules/auth`)** | Session bootstrap, token normalisation, storage resilience, React context provider and auth API orchestration.【F:frontend/src/modules/auth/auth.service.ts†L1-L78】【F:frontend/src/modules/auth/AuthContext.tsx†L1-L148】【F:frontend/src/modules/auth/token-storage.ts†L1-L36】 | Consumes shared Axios client; exported hooks consumed by legacy UI and new navigation logic. |
| **Navigation (`src/nav`)** | Derives sidebar/top/breadcrumb nodes, telemetry, visibility checks and surface filtering from a declarative config.【F:frontend/src/nav/nav.map.ts†L1-L197】 | Depends on feature-flag and auth contexts; used by guards and layouts. |
| **Feature Flags (`src/shared/contexts/FeatureFlagContext.tsx`)** | Parses runtime flag sets, exposes enable/disable/toggle helpers and guards for conditional UI rendering.【F:frontend/src/shared/contexts/FeatureFlagContext.tsx†L12-L115】 | Independent provider consumed throughout features; uses navigation schema types. |
| **Legacy Auth UI (`src/legacy/pages/Auth`, `components/auth`)** | Forms for login/register/forgot password with marketing styling, bridging into the modular auth provider.【F:frontend/src/legacy/components/auth/LoginForm.tsx†L19-L188】【F:frontend/src/legacy/pages/Auth/Register.tsx†L1-L126】 | Consumes `useAuth` hook; slated for redesign under modular plan. |

### Back-end
| Module | Responsibilities | Boundaries & Dependencies |
| --- | --- | --- |
| **Auth & Profile (`App\Http\Controllers\Api\V1\AuthController`, `ProfileController`, `PasswordController`)** | Sanctum token lifecycle, profile updates and password reset flows, including validation envelopes.【F:backend/app/Http/Controllers/Api/V1/AuthController.php†L37-L175】【F:backend/app/Http/Controllers/Api/V1/PasswordController.php†L13-L62】 | Depends on requests, resources, Laravel password broker; exposed under `/api/v1`. |
| **Domain APIs (Activities, Elections, Automation, etc.)** | CRUD endpoints grouped under sanctum middleware for election operations, reporting, integrations and automation.【F:backend/routes/api.php†L64-L123】 | Coupled through shared route group; each controller handles its aggregate root. |
| **User & Permissions (`App\Models\User`)** | Aggregates Sanctum tokens, role assignments and related associations for notifications, SMS and teams.【F:backend/app/Models/User.php†L9-L65】 | Relies on Spatie roles, HasApiTokens; referenced across controllers and policies. |

## 3. Transformation Strategy

### Phased Migration Roadmap
1. **Phase 1 – Authentication foundation (In progress).** Extract auth session management into a dedicated module with storage/service boundaries, update consumers and add regression tests. Completed by introducing `src/modules/auth` with resilient token handling and a context provider built on modular services.【F:frontend/src/modules/auth/auth.service.ts†L1-L78】【F:frontend/src/modules/auth/AuthContext.tsx†L1-L148】【F:frontend/src/modules/auth/__tests__/auth.transforms.test.ts†L1-L45】
2. **Phase 2 – Navigation & layout modularisation.** Promote navigation config, guards and layout shell into a `modules/navigation` package, surface typed guards for marketing and post-auth experiences, and migrate legacy layouts to consume the shared module. Estimate: 1.5 engineer-weeks (front-end) including snapshot updates and storybook coverage.
3. **Phase 3 – Domain slice decomposition.** Break the monolithic API route file into per-domain providers (e.g., `routes/api/auth.php`, `routes/api/elections.php`), introduce Laravel route caching hints and consolidate request validation and policies per namespace. Estimate: 2 engineer-weeks (back-end) including regression tests.
4. **Phase 4 – UX convergence & marketing handoff.** Replace `legacy` auth screens with composable feature pages built on the new module, integrate nav-aware redirects and consolidate form validation logic (1 engineer-week). Parallel effort to wire feature-flag driven experiments into marketing flows.
5. **Phase 5 – Observability & performance.** Instrument axios layer with request metrics, add server-side rate limiting per module, and introduce background jobs for long-running exports/imports. Estimate: 2 engineer-weeks split between FE/BE.

### Resource Estimate & Risk Mitigation
- **Resourcing:** ~6.5 engineer-weeks across three phases after the initial auth refactor (2.5 FE, 2.5 BE, 1.5 shared). QA allocation of 1 tester-week per milestone is recommended.
- **Risk controls:**
  - Maintain contract tests for auth token extraction and storage to catch regressions early.【F:frontend/src/modules/auth/__tests__/auth.transforms.test.ts†L1-L45】【F:frontend/src/modules/auth/__tests__/token-storage.test.ts†L1-L32】
  - Adopt feature-flag rollouts for navigational changes to allow staged user exposure using the existing context.【F:frontend/src/shared/contexts/FeatureFlagContext.tsx†L12-L115】
  - Introduce automated policy assertions ensuring registration stays restricted even when routes evolve, mitigating implicit authorisation drift.【F:backend/app/Http/Requests/RegisterRequest.php†L9-L21】

## 4. Timeline & Milestones

| Milestone | Target | Scope | Owners |
| --- | --- | --- | --- |
| **M1 – Auth module shipped** | Week 1 | Land `src/modules/auth`, migrate consumers, add unit tests (complete).【F:frontend/src/modules/auth/AuthContext.tsx†L1-L148】【F:frontend/src/modules/auth/__tests__/token-storage.test.ts†L1-L32】 | Front-end platform team |
| **M2 – Navigation package** | Week 3 | Extract navigation module, update layouts, ship smoke tests and documentation. | Front-end platform + Design systems |
| **M3 – API route decomposition** | Week 5 | Split Laravel routes per domain, align middleware stacks, add contract tests. | Back-end services |
| **M4 – Legacy auth sunset** | Week 7 | Replace legacy pages with modular screens, unify redirect logic, QA release. | Front-end platform + Product design |
| **M5 – Observability enhancements** | Week 9 | Instrument telemetry, configure rate limiting, final performance review. | Cross-functional guild |

The phased approach keeps auth as the foundational module, progressively modularises navigation and API layers, and culminates with UX convergence and operational hardening.
