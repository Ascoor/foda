# Elections Campaigns Platform

A production-ready monorepo for running Egyptian election campaigns. The backend (Laravel 10, PHP 8.2) exposes a scoped API secured by Sanctum. The frontend (React 18 + TypeScript + Vite) renders authenticated campaign dashboards with RTL-friendly UI.

## 🗂️ Monorepo Layout

```text
apps/
  backend -> ../backend  # Laravel API (symlink for tooling compatibility)
  frontend -> ../frontend # React client (symlink for tooling compatibility)
backend/                  # Laravel 10 source
frontend/                 # React + TypeScript source
```

## 🧱 Domain Model

| Entity     | Description |
|------------|-------------|
| Area       | Hierarchical geographic unit (parent/child tree). |
| Campaign   | Scoped to a child area, owned by a user, has `draft`, `active`, or `archived` status. |
| Election   | Child of a campaign, has `upcoming`, `running`, or `closed` phase with schedule. |
| Membership | Binds users to either an area or a campaign with `admin`, `manager`, or `viewer` roles. |

Access to campaigns/elections is the union of a user’s memberships:
- **Area scope** grants access to all campaigns/elections in that area and descendants.
- **Campaign scope** grants access to a single campaign and its elections.

## 🚀 Getting Started

### Backend (Laravel API)

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Demo credentials (password `password` for all):
- `admin@example.com`
- `manager@example.com`
- `viewer@example.com`

The seeder (`DemoElectionSeeder`) creates:
- 2 parent areas (Cairo & Alexandria) with 4 child areas each.
- 5 campaigns per child area with random statuses and Unsplash covers.
- 2–4 elections per campaign with randomized schedules/phases.
- Memberships wired per the accounts above.

### Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The client expects the API at `http://127.0.0.1:8000/api/v1` (configurable via `VITE_API_URL`).

## 🔐 Authentication & Authorization

- Laravel Sanctum issues bearer tokens via `/api/v1/auth/login`.
- Refresh tokens transparently by calling `/api/v1/auth/refresh`.
- `scope.membership` middleware resolves effective areas/campaigns on every request.
- Policies (`CampaignPolicy`, `ElectionPolicy`) enforce role-aware permissions.

## 🧾 API Surface

Versioned routes live under `/api/v1`. Highlights:

| Method | Route | Notes |
|--------|-------|-------|
| POST   | `/auth/login` | Obtain Sanctum token. Rate limited (`login`). |
| GET    | `/auth/me` | Current user, memberships, resolved scopes. |
| GET    | `/campaigns` | Filter by status, area, search. Rate limited (`campaigns`). |
| POST   | `/campaigns` | Create campaign (area admins). |
| POST   | `/campaigns/{id}/archive` | Archive campaign (admins/managers). |
| GET    | `/campaigns/{id}/elections` | List elections scoped to viewer. |
| POST   | `/campaigns/{id}/elections` | Create election (admins/managers). |

The OpenAPI contract is published at [`backend/openapi.yaml`](apps/backend/openapi.yaml).

## 🛠️ Services & Middleware

- `ScopeService` caches resolved area/campaign sets per user (tagged cache `scopes`).
- `CampaignService` & `ElectionService` encapsulate CRUD, filtering, and cache invalidation.
- `ResolveMembershipScope` middleware attaches resolved scopes onto the request container.

## 🧪 Testing

```bash
cd backend
php artisan test
```

Feature coverage includes:
- Authentication flow (`AuthTest`).
- Campaign listing scoped to memberships (`CampaignScopingTest`).
- Election visibility for campaign viewers (`ElectionScopingTest`).

## 📦 Tooling & Observability

- Horizon-ready queue config (Redis) and Telescope-friendly scaffolding (enable in local `.env`).
- Tagged caches for campaigns (`campaigns`) and elections (`elections:campaign:{id}`).
- Rate limiters for login and campaign listing.

## 📸 Frontend UX Notes

- Embla carousel + framer-motion for campaign cards.
- Zustand store syncs URL params with active area/campaign/election.
- RTL-aware Tailwind tokens; shadcn/ui components themed via shared config.
- Protected routes guard unauthenticated users and redirect to `/login`.

## 📘 Additional Scripts

```bash
# Backend artisan helpers
php artisan horizon      # Queue dashboard
php artisan migrate:fresh --seed

# Frontend quality gates
npm run lint
npm run test
```

Happy campaigning! 🇪🇬
