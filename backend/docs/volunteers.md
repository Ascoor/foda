# Volunteer API

## List Volunteers
`GET /api/v1/volunteers`

Query params: `name`, `team_id`

## Create Volunteer
`POST /api/v1/volunteers`

Required fields: `name`
Optional fields: `email`, `phone`, `team_id`

Example:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123456",
  "team_id": 1
}
```

## Show Volunteer
`GET /api/v1/volunteers/{id}`

## Update Volunteer
`PUT /api/v1/volunteers/{id}`

## Delete Volunteer
`DELETE /api/v1/volunteers/{id}`

