---
title: "Endpoints Reference"
author: "Backend Platform"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# REST Endpoints Reference

## Purpose
- Provide a consolidated overview of REST endpoints that replace the scattered markdown files under `backend/docs`.
- Surface filters, payloads, and notes for frontend contract alignment.

## Endpoint Catalog
| Domain | Methods | Filters / Payload Highlights | Notes |
| --- | --- | --- | --- |
| Elections | `GET`, `POST`, `PUT`, `DELETE /api/v1/elections` | Query: `status`, `cycle`, `search`; Payload: `name`, `start_date`, `end_date`, `description`. | Governs election lifecycle management. |
| Geo Areas | `GET`, `POST`, `PUT`, `DELETE /api/v1/areas` | Query: `search`, `election_id`; Payload: `name`, `description`, `coordinates`. | Coordinates stored as GeoJSON string for mapping. |
| Committees | `GET`, `POST`, `PUT`, `DELETE /api/v1/committees` | Query: `area_id`, `type`; Payload: `name`, `area_id`, `contact_person`. | Supports roster exports and assignment endpoints. |
| Voters | `GET`, `POST`, `PUT`, `DELETE /api/v1/voters` | Query: `search`, `committee_id`, `status`; Payload: `full_name`, `national_id`, `committee_id`. | Bulk CSV import/export pipeline planned. |
| Candidates | `GET`, `POST`, `PUT`, `DELETE /api/v1/candidates` | Payload: `name`, `party`, `biography`, `media_links`. | Supports linking to campaigns and volunteers. |
| Agents | `GET`, `POST`, `PUT`, `DELETE /api/v1/agents` | Query: `committee_id`, `status`; Payload: `name`, `contact`, `committee_id`, `candidate_id`. | Assignment endpoints issue notifications via `AssignAgent` events. |
| Volunteers | `GET`, `POST`, `PUT`, `DELETE /api/v1/volunteers` | Query: `name`, `team_id`; Payload: `name`, `email`, `phone`, `team_id`. | `team_id` optional; skill tags tracked in pivot tables. |
| Observations | `GET`, `POST`, `PUT`, `DELETE /api/v1/observations` | Query: `type`, `committee_id`, `status`; Payload: `observer`, `type`, `description`, attachments. | Files processed via Laravel media library (planned). |
| Campaigns | `GET`, `POST`, `PUT`, `DELETE /api/v1/campaigns` | Payload: `name`, `goal`, `budget`, `start_date`, `end_date`. | Under active development; align with automation flows. |
| Finance | `GET`, `POST`, `PUT`, `DELETE /api/v1/finances` | Query: `reference_id`, `type`, `date_from`, `date_to`; Payload: `amount`, `type`, `date`, `description`. | Supports ledger exports and analytics integration. |
| SMS | `GET`, `POST`, `PUT`, `DELETE /api/v1/sms` | Payload: `recipient`, `body`, `send_at`; Query: `status`, `campaign_id`. | Rate limited by `SmsService` configuration. |
| Settings | `GET`, `PUT /api/v1/settings` | Payload: `key`, `value`, `type`. | Maintains feature toggles and system configuration. |
| Authentication | `/api/v1/auth/login`, `/logout`, `/me` | Payload: `email`, `password`; Response includes Sanctum token and user roles. | Logout revokes previous tokens for security. |

## Response Shape
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 250
  },
  "links": {
    "next": "https://.../api/v1/resource?page=2"
  }
}
```

## Integration Notes
- Use `frontend/src/shared/lib/endpoints.ts` as the source of truth for URL definitions.
- Most POST/PUT endpoints accept JSON; file uploads use multipart forms with presigned storage planned.
- Webhooks for SMS delivery receipts and analytics ingestion pending specification.

## Next Actions
1. Generate Postman collection exports directly from this table to aid QA.
2. Align naming conventions with `docs/frontend/feature-guides.md` module matrix.
3. Add example payloads per endpoint once JSON schema definitions are generated.
4. Track deprecations in `docs/legacy/deprecated-modules.md` to avoid stale references.
