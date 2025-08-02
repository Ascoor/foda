# Finance API

## List Finances
`GET /api/v1/finances`

Optional query:
- `reference_id`: filter by related operation (campaign, volunteer, report).

## Create Finance
`POST /api/v1/finances`

Fields:
- `amount` (number, required)
- `type` (string, required, `income` or `expense`)
- `date` (YYYY-MM-DD, required)
- `description` (string, optional)
- `reference_id` (integer, optional)

## Show Finance
`GET /api/v1/finances/{id}`

## Update Finance
`PUT /api/v1/finances/{id}`

Accepts same fields as create.

## Delete Finance
`DELETE /api/v1/finances/{id}`
