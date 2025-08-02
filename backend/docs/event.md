# Event API

## List Events
`GET /api/v1/events`

Optional query parameters:
- `date` (YYYY-MM-DD)
- `area_id`
- `team_id`

## Show Event
`GET /api/v1/events/{id}`

## Create Event
`POST /api/v1/events`

Required fields: `name`, `organiser`, `location`, `date`, `area_id`, `team_id`

Optional fields: `description`, `event_id`

## Update Event
`PUT /api/v1/events/{id}`

## Delete Event
`DELETE /api/v1/events/{id}`

## Upcoming Events
`GET /api/v1/events/upcoming`

Returns events with a date on or after today.
