# Home Dashboard API

## Dashboard Stats
`GET /api/v1/home`

Query parameters:
- `from` (optional, date): start date for voter registration statistics.
- `to` (optional, date): end date (must be on or after `from`).

Response fields:
- `areas`: Total number of areas.
- `volunteers`: Total number of volunteers.
- `voters`: Total number of voters within the selected period.
- `teams`: Total number of teams.
- `events`: Total number of events.
- `registrations`: Array of `{ "month": "YYYY-MM", "count": number }` for new voter registrations per month.

## Heatmap
`GET /api/v1/home/heatmap`

Returns list of area coordinates as floats `{ "lat": number, "lng": number }` for map visualisations.
