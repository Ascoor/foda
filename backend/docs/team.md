# Team API

## List Teams
`GET /api/v1/teams`

## Create Team
`POST /api/v1/teams`

Required fields: `name`, `area_id`, `supervisor_id`

## Show Team
`GET /api/v1/teams/{id}`

## Update Team
`PUT /api/v1/teams/{id}`

## Delete Team
`DELETE /api/v1/teams/{id}`

## Assign Volunteers
`POST /api/v1/teams/{id}/volunteers`

Body: `{ "volunteer_ids": [1,2] }`

## Remove Volunteer
`DELETE /api/v1/teams/{team}/volunteers/{volunteer}`

