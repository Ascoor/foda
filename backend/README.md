# Backend API

This Laravel 10 service powers the FODA campaign operations platform. The API surface is organised under `/api/v1` and is now grouped by campaign-centric resources (campaigns, geographic scopes, committees, volunteers, finance, polling logistics, analytics, notifications, and integrations). Every route listed below is protected by Sanctum and the role middleware noted in the tables.

## Authentication & profile

| Method | Route | Controller | Roles |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | `AuthController@login` | public |
| `POST` | `/api/v1/auth/logout` | `AuthController@logout` | authenticated |
| `POST` | `/api/v1/auth/refresh` | `AuthController@refresh` | authenticated |
| `GET` | `/api/v1/auth/me` | `AuthController@me` | authenticated |
| `POST` | `/api/v1/auth/register` | `AuthController@register` | authenticated |
| `GET` | `/api/v1/profile` | `ProfileController@show` | authenticated |
| `PUT` | `/api/v1/profile` | `ProfileController@update` | authenticated |
| `POST` | `/api/v1/profile/avatar` | `ProfileController@updateAvatar` | authenticated |
| `PATCH` | `/api/v1/profile/password` | `ProfileController@updatePassword` | authenticated |
| `POST` | `/api/v1/password/forgot` | `PasswordController@forgot` | public |
| `POST` | `/api/v1/password/reset` | `PasswordController@reset` | public |

## Campaigns

| Method | Route | Description | Roles |
| --- | --- | --- | --- |
| `GET` | `/api/v1/campaigns` | List campaigns visible to the user. | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `POST` | `/api/v1/campaigns` | Create a campaign. | campaign_manager |
| `GET` | `/api/v1/campaigns/{campaign}` | Show campaign with geographic scopes & committees. | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `PUT` | `/api/v1/campaigns/{campaign}` | Update campaign metadata. | campaign_manager |
| `DELETE` | `/api/v1/campaigns/{campaign}` | Archive a campaign. | campaign_manager |

Nested resources beneath `/api/v1/campaigns/{campaign}`:

### Geographic scopes

| Method | Route | Description | Roles |
| --- | --- | --- | --- |
| `GET` | `/geographic-scopes` | Paginated list with optional filters (`parent_id`, `level`, `search`). | campaign_manager, area_coordinator, viewer |
| `POST` | `/geographic-scopes` | Create a scope with optional parent. | campaign_manager, area_coordinator |
| `GET` | `/geographic-scopes/{geographic_scope}` | Show a scope (children + committees eager loaded). | campaign_manager, area_coordinator, viewer |
| `PUT` | `/geographic-scopes/{geographic_scope}` | Update metadata, level, or hierarchy. | campaign_manager, area_coordinator |
| `DELETE` | `/geographic-scopes/{geographic_scope}` | Remove the scope tree. | campaign_manager |

### Committees

| Method | Route | Description | Roles |
| --- | --- | --- | --- |
| `GET` | `/committees` | Paginated committees (filter via `geographic_scope_id`). | campaign_manager, area_coordinator, committee_supervisor, viewer |
| `GET` | `/committees/geo` | GeoJSON collection for heat-map views. | campaign_manager, area_coordinator, committee_supervisor, viewer |
| `POST` | `/committees` | Create a committee and link to a scope. | campaign_manager, area_coordinator |
| `GET` | `/committees/{committee}` | Show details. | campaign_manager, area_coordinator, committee_supervisor, viewer |
| `PUT` | `/committees/{committee}` | Update metadata or scope. | campaign_manager, area_coordinator |
| `DELETE` | `/committees/{committee}` | Delete a committee. | campaign_manager |

### Volunteers

| Method | Route | Roles |
| --- | --- | --- |
| `GET` | `/volunteers` | campaign_manager, area_coordinator, committee_supervisor, volunteer, viewer |
| `POST` | `/volunteers` | campaign_manager, area_coordinator, committee_supervisor |
| `GET` | `/volunteers/{volunteer}` | campaign_manager, area_coordinator, committee_supervisor, volunteer, viewer |
| `PUT` | `/volunteers/{volunteer}` | campaign_manager, area_coordinator, committee_supervisor |
| `DELETE` | `/volunteers/{volunteer}` | campaign_manager, area_coordinator, committee_supervisor |

### Finance

| Method | Route | Description | Roles |
| --- | --- | --- | --- |
| `GET` | `/donations` | List donations. | campaign_manager, finance, viewer |
| `POST` | `/donations` | Record a donation. | campaign_manager, finance |
| `GET` | `/donations/{donation}` | Show a donation. | campaign_manager, finance, viewer |
| `PUT` | `/donations/{donation}` | Update a donation. | campaign_manager, finance |
| `DELETE` | `/donations/{donation}` | Remove a donation. | campaign_manager, finance |
| `GET` | `/expenses` | List expenses. | campaign_manager, finance, viewer |
| `POST` | `/expenses` | Record an expense. | campaign_manager, finance |
| `GET` | `/expenses/{expense}` | Show an expense. | campaign_manager, finance, viewer |
| `PUT` | `/expenses/{expense}` | Update an expense. | campaign_manager, finance |
| `DELETE` | `/expenses/{expense}` | Remove an expense. | campaign_manager, finance |

### Logistics & dashboards

| Method | Route | Description | Roles |
| --- | --- | --- | --- |
| `GET` | `/polling-days` | List polling days. | campaign_manager, area_coordinator, committee_supervisor, viewer |
| `POST` | `/polling-days` | Create polling day. | campaign_manager, area_coordinator |
| `GET` | `/polling-days/{polling_day}` | Show polling day. | campaign_manager, area_coordinator, committee_supervisor, viewer |
| `PUT` | `/polling-days/{polling_day}` | Update polling day. | campaign_manager, area_coordinator |
| `DELETE` | `/polling-days/{polling_day}` | Delete polling day. | campaign_manager, area_coordinator |
| `GET` | `/activities` | Campaign-scoped activity feed. | campaign_manager, area_coordinator, committee_supervisor, volunteer, viewer |
| `GET` | `/activities/recent` | Geo feed for maps. | campaign_manager, area_coordinator, committee_supervisor, volunteer, viewer |
| `GET` | `/automation/config` | Automation configuration. | campaign_manager, area_coordinator |
| `PUT` | `/automation/config` | Save automation configuration. | campaign_manager, area_coordinator |
| `POST` | `/automation/config/{task}/trigger` | Execute automation task manually. | campaign_manager |
| `GET` | `/home` & `/dashboard` | Campaign dashboard summary. | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `GET` | `/home/heatmap` | Heatmap feed for the active campaign. | campaign_manager, area_coordinator, committee_supervisor, viewer |
| `GET` | `/dashboard-stats` | Dashboard metrics bundle. | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `GET` | `/settings/key/{key}` | Fetch a keyed setting. | campaign_manager |
| `PUT/PATCH` | `/settings` | Bulk update existing keys. | campaign_manager |
| `REST` | `/settings` | CRUD over platform settings (campaign scoped, non-UI). | campaign_manager |

## Analytics endpoints

Analytics responses can be fetched globally (via `X-Campaign-ID`) or through the new nested namespace.

| Method | Route | Roles |
| --- | --- | --- |
| `GET` | `/api/v1/analytics/overview` | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `GET` | `/api/v1/analytics/timeseries` | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `GET` | `/api/v1/analytics/forecast` | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `GET` | `/api/v1/campaigns/{campaign}/analytics/overview` | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `GET` | `/api/v1/campaigns/{campaign}/analytics/timeseries` | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |
| `GET` | `/api/v1/campaigns/{campaign}/analytics/forecast` | campaign_manager, area_coordinator, committee_supervisor, finance, viewer |

## Notifications, areas, and external data

| Method | Route | Roles |
| --- | --- | --- |
| `GET` | `/api/v1/notifications` | campaign_manager, area_coordinator, committee_supervisor, volunteer, viewer |
| `POST` | `/api/v1/notifications/read-all` | campaign_manager, area_coordinator, committee_supervisor, volunteer |
| `PATCH` | `/api/v1/notifications/{notification}/read` | campaign_manager, area_coordinator, committee_supervisor, volunteer |
| `REST` | `/api/v1/areas` | campaign_manager, area_coordinator, committee_supervisor, viewer |
| `GET` | `/api/v1/integrations/geo-areas` | authenticated |
| `GET` | `/api/v1/integrations/elections/summary` | authenticated |
| `GET` | `/api/v1/integrations/elections/live-results` | authenticated |
| `GET` | `/api/v1/integrations/maps/configuration` | authenticated |

## Route refactor summary

See [`docs/api-route-refactor.md`](docs/api-route-refactor.md) for the detailed before/after map, removed legacy endpoints, and the migration notes for front-end engineers. The refactor removes the legacy `/api/v1/ec/*` namespaces, consolidates committee/volunteer/finance routes under the campaign prefix, and introduces dedicated controllers plus validation for geographic scopes and committees.

### Legacy compatibility layer

Some client builds in the monorepo still call the deprecated `/api/v1/ec/campaigns` endpoints. A lightweight alias now proxies those routes to the canonical `/api/v1/campaigns` controllers (including the new `POST /api/v1/campaigns/{campaign}/send` action) so legacy UI flows can function while the front-end migrates to the new namespace.

## Testing & tooling

```bash
# install dependencies
composer install

# refresh autoloaded classes
composer dump-autoload

# execute feature tests
php artisan test

# list API routes
php artisan route:list --path=api/v1
```

## Changelog

Updates are tracked in [`CHANGELOG.md`](CHANGELOG.md); the current release documents the CAMP-REORG-API-ROUTES-002 consolidation and new role-aware middleware strategy.
