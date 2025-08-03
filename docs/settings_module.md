# Settings Module

This module provides a small configuration system shared between the React frontend and the Laravel backend.

## API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/api/v1/settings` | Fetch all settings |
| `PUT`/`PATCH` | `/api/v1/settings` | Update one or many settings at once |
| `GET` | `/api/v1/settings/key/{key}` | Retrieve a single setting by key |

`PUT`/`PATCH` accepts a JSON object where keys correspond to existing setting keys. Only provided keys are modified.

## Example cURL

```bash
curl -X PUT /api/v1/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"site_name":"Demo","enable_notifications":true}'
```

## Frontend Usage

The settings page at `/settings` loads all settings using React Query and renders a dynamic form grouped by categories. Only changed fields are sent back to the API.

## Test Checklist

- [ ] `/api/v1/settings` returns a list of settings
- [ ] Updating without permission returns `403`
- [ ] Updating with permission persists new values
- [ ] Settings page loads and displays form fields
- [ ] Editing values and clicking **Save** updates the backend and shows success

## Extending

1. **Database** – add a new row in the `settings` table with `key`, `value`, `type`, and optional `description`.
2. **Frontend** – append a field definition in `SETTINGS_SCHEMA` inside `src/pages/Settings.tsx` to expose it in the UI.
3. The dynamic form and bulk update endpoint will handle the rest.
