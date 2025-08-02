# SWOT API

SWOT (Strengths, Weaknesses, Opportunities, Threats) analyses can be attached to
areas, teams or volunteers. The following endpoints provide CRUD operations and a
simple reporting endpoint.

## Endpoints

### List SWOTs
- `GET /api/v1/swots`

### Create SWOT
- `POST /api/v1/swots`
- Body example:
```json
{
  "entity_type": "team",
  "entity_id": 1,
  "strengths": "خبرة قوية",
  "weaknesses": "نقص التمويل",
  "opportunities": "فرص تدريب",
  "threats": "منافسة"
}
```

### Show SWOT
- `GET /api/v1/swots/{id}`

### Update SWOT
- `PUT /api/v1/swots/{id}`

### Delete SWOT
- `DELETE /api/v1/swots/{id}`

### Aggregated Report
- `GET /api/v1/swots/report?entity_type=team&entity_ids[]=1&entity_ids[]=2`
- Query parameters:
  - `entity_type` (required): `area`, `team` or `volunteer`
  - `entity_ids[]` (optional): limit results to these entity IDs
- Example response:
```json
{
  "data": [
    {
      "id": 1,
      "entity_type": "team",
      "entity_id": 1,
      "strengths": "Strong leadership",
      "weaknesses": "Limited budget",
      "opportunities": "Training",
      "threats": "Competition",
      "created_by": 1,
      "created_at": "2024-08-02T00:00:00.000000Z",
      "updated_at": "2024-08-02T00:00:00.000000Z"
    }
  ]
}
```

## Relations
- SWOTs attach to `area`, `team`, and `volunteer` models via a polymorphic relation.
- Each model exposes a `swots()` relation to access linked analyses.

## Notes
- `entity_type` accepts `area`, `team`, or `volunteer`.
- Requires authentication via Sanctum.
