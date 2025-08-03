# ElectionCircle API

This backend provides RESTful endpoints for core election management entities. It is structured around modern modules that support the new React frontend and multilingual features.

## Main Entities
- Elections
- Geo Areas
- Committees
- Voters
- Candidates
- Agents
- Volunteers
- Observations
- Campaigns
- Settings

## Relationships
- Election has many Geo Areas and Candidates
- Geo Area has many Committees
- Committee has many Voters, Agents and Observations
- Candidate has many Agents and Volunteers
- Volunteer has many Observations

## Listing Parameters
Index endpoints support a common set of query parameters:

| Parameter | Description |
|-----------|-------------|
| `search`  | Text search across name and other configured columns |
| `sort_by` | Column to sort by |
| `order`   | Sort direction (`asc` or `desc`) |
| Any other field | Filter by exact value |

## Example Endpoints
```
GET /api/ec/elections
POST /api/ec/voters
GET /api/ec/voters?search=ahmed&committee_id=5&sort_by=created_at&order=desc
```

All endpoints return JSON responses. Authorization is guarded by the `manage-electioncircle` gate which allows `admin` and `manager` roles.

