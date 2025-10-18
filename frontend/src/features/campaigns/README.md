# Campaigns Module

Handles outreach campaigns and bulk messaging.

## Endpoints
- `GET /ec/campaigns` – list campaigns.
- `POST /ec/campaigns` – create campaign.
- `PUT /ec/campaigns/{id}` – update campaign.
- `DELETE /ec/campaigns/{id}` – delete campaign.
- `POST /ec/campaigns/{id}/send` – send campaign messages.

### Fields
- `name` (string, required)
- `message` (string, required)
