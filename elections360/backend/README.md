# Elections360 API

Laravel-based REST API powering the Elections360 platform. The application exposes resources for voters, committees, agents, reports, activities, and areas with Sanctum-powered authentication and API tokens.

## Getting Started

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

The API is served from `http://127.0.0.1:8000` by default. Sanctum protects the `/api` routes, so remember to authenticate requests with a personal access token.

## Available Resources

All routes are registered inside `routes/api.php` and return JSON resources:

- `GET /api/voters` – paginated voters with related areas and committees.
- `GET /api/committees` – committees and their agents/voters.
- `GET /api/agents` – assigned agents and committee details.
- `GET /api/reports` – operational reports attached to areas and agents.
- `GET /api/activities` – scheduled field activities.
- `GET /api/areas` – hierarchical areas with child regions and committees.

POST, PUT/PATCH, and DELETE endpoints are available for each resource to manage data during development.

## Real-time & Maps

The project ships with ready-to-configure Pusher credentials (`BROADCAST_DRIVER=pusher`) and geographic data seeded through `AreaSeeder` to support mapping features in the frontend.
