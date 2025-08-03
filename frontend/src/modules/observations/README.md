# Observations Module

Manages election observations and violations.

## Endpoints
- `GET /ec/observations` – list observations with optional `type` and `committee_id` filters.
- `POST /ec/observations` – create observation.
- `PUT /ec/observations/{id}` – update observation.
- `DELETE /ec/observations/{id}` – remove observation.

### Fields
- `observer` (string, required)
- `committee_id` (string, optional)
- `type` (violation | note | complaint)
- `description` (string)
- `image` (file, optional)
