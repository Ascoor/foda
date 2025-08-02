# Home Dashboard API

## Dashboard Stats
`GET /api/v1/home`

Response fields:
- `areas`: Total number of areas.
- `volunteers`: Total number of volunteers.
- `voters`: Total number of voters.
- `teams`: Total number of teams.
- `events`: Total number of events.
- `registrations`: Array of `{ "month": "YYYY-MM", "count": number }` for new voter registrations per month.

## Heatmap
`GET /api/v1/home/heatmap`

Returns list of area coordinates `{ "lat": x, "lng": y }` for map visualisations.
