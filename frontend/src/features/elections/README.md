# Elections Module

Manages election records including creation, updating and viewing details.

## Endpoints
- `GET /ec/elections` – list elections with optional `search`, `page`, `per_page`, and `status` filters.
- `POST /ec/elections` – create a new election.
- `GET /ec/elections/{id}` – get election details.
- `PUT /ec/elections/{id}` – update election.
- `DELETE /ec/elections/{id}` – delete election.

### Fields
- `name` (string, required)
- `type` (`presidential | parliamentary | local | referendum`, required)
- `start_date` (string, required)
- `end_date` (string, required)
- `description` (string, optional)
