# Committees Module

This module manages election committees.

## Endpoints
- `GET /ec/committees` – list committees with optional `search`, `page`, `per_page`, and `geo_area_id` filters.
- `POST /ec/committees` – create a new committee.
- `GET /ec/committees/{id}` – get committee details.
- `PUT /ec/committees/{id}` – update committee.
- `DELETE /ec/committees/{id}` – delete committee.
- `POST /ec/committees/{id}/members` – assign members to a committee.

### Fields
- `name` (string, required)
- `location` (string, required)
- `geo_area_id` (string, required)

### Example
```ts
import { createCommittee } from './api';

await createCommittee({
  name: 'Main Committee',
  location: 'Cairo',
  geo_area_id: '1'
});
```
