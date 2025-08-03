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

## Example Endpoints
```
GET /api/ec/elections
POST /api/ec/voters
GET /api/ec/voters/search?q=ahmed
```

All endpoints return JSON responses. Authorization is guarded by the `manage-electioncircle` gate which allows `admin` and `manager` roles.

