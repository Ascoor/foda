# SWOT API

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

## Notes
- `entity_type` accepts `area`, `team`, or `volunteer`.
- Requires authentication via Sanctum.
