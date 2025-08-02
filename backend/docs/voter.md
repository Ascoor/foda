# Voter API

Endpoints:

- `GET /api/v1/voters` – List voters. Supports filters `name`, `area_id`, `voter_id`.
- `POST /api/v1/voters` – Create voter.
- `GET /api/v1/voters/{id}` – Show voter details.
- `PUT /api/v1/voters/{id}` – Update voter.
- `DELETE /api/v1/voters/{id}` – Delete voter.
- `POST /api/v1/voters/import` – Import voters from CSV file (field: `file`).
- `GET /api/v1/voters/export` – Export voters to CSV.

Legacy reference: `old/application/modules/voter/models/voter_model.php`.
