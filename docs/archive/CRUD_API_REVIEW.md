# CRUD API Review

This report compares frontend API calls with backend Laravel routes to verify CRUD support, authentication usage, and error handling.

| Module | Operation | Frontend (URL & Method) | Backend (URL & Method) | Match | Notes |
|--------|-----------|------------------------|------------------------|-------|-------|
| Elections | List | GET `/ec/elections` | GET `/api/ec/elections` | ✅ | - |
| Elections | Create | POST `/ec/elections` | POST `/api/ec/elections` | ✅ | - |
| Elections | Details | GET `/ec/elections/{id}` | GET `/api/ec/elections/{id}` | ✅ | - |
| Elections | Update | PUT `/ec/elections/{id}` | PUT `/api/ec/elections/{id}` | ✅ | - |
| Elections | Delete | DELETE `/ec/elections/{id}` | DELETE `/api/ec/elections/{id}` | ✅ | - |
| Committees | List | GET `/ec/committees` | GET `/api/ec/committees` | ✅ | - |
| Committees | Create | POST `/ec/committees` | POST `/api/ec/committees` | ✅ | - |
| Committees | Details | GET `/ec/committees/{id}` | GET `/api/ec/committees/{id}` | ✅ | - |
| Committees | Update | PUT `/ec/committees/{id}` | PUT `/api/ec/committees/{id}` | ✅ | - |
| Committees | Delete | DELETE `/ec/committees/{id}` | DELETE `/api/ec/committees/{id}` | ✅ | - |
| Candidates | List | GET `/ec/candidates` | GET `/api/ec/candidates` | ✅ | - |
| Candidates | Create | POST `/ec/candidates` | POST `/api/ec/candidates` | ✅ | - |
| Candidates | Details | GET `/ec/candidates/{id}` | GET `/api/ec/candidates/{id}` | ✅ | - |
| Candidates | Update | PUT `/ec/candidates/{id}` | PUT `/api/ec/candidates/{id}` | ✅ | - |
| Candidates | Delete | DELETE `/ec/candidates/{id}` | DELETE `/api/ec/candidates/{id}` | ✅ | - |
| Voters | List | GET `/ec/voters` | GET `/api/ec/voters` | ✅ | - |
| Voters | Create | POST `/ec/voters` | POST `/api/ec/voters` | ✅ | - |
| Voters | Details | GET `/ec/voters/{id}` | GET `/api/ec/voters/{id}` | ✅ | - |
| Voters | Update | PUT `/ec/voters/{id}` | PUT `/api/ec/voters/{id}` | ✅ | - |
| Voters | Delete | DELETE `/ec/voters/{id}` | DELETE `/api/ec/voters/{id}` | ✅ | - |
| Agents | List | *(mock data)* | GET `/api/ec/agents` | ❌ | Frontend uses static data; no API call |
| Agents | Create | *(mock data)* | POST `/api/ec/agents` | ❌ | Needs implementation |
| Agents | Details | *(mock data)* | GET `/api/ec/agents/{id}` | ❌ | Needs implementation |
| Agents | Update | *(mock data)* | PUT `/api/ec/agents/{id}` | ❌ | Needs implementation |
| Agents | Delete | *(mock data)* | DELETE `/api/ec/agents/{id}` | ❌ | Needs implementation |
| Volunteers | List | *(mock data)* | GET `/api/ec/volunteers` | ❌ | Frontend uses static data |
| Volunteers | Create | *(mock data)* | POST `/api/ec/volunteers` | ❌ | Needs implementation |
| Volunteers | Details | *(mock data)* | GET `/api/ec/volunteers/{id}` | ❌ | Needs implementation |
| Volunteers | Update | *(mock data)* | PUT `/api/ec/volunteers/{id}` | ❌ | Needs implementation |
| Volunteers | Delete | *(mock data)* | DELETE `/api/ec/volunteers/{id}` | ❌ | Needs implementation |
| Observations | List | *(mock data)* | GET `/api/ec/observations` | ❌ | Frontend uses static data |
| Observations | Create | *(mock data)* | POST `/api/ec/observations` | ❌ | Needs implementation |
| Observations | Details | *(mock data)* | GET `/api/ec/observations/{id}` | ❌ | Needs implementation |
| Observations | Update | *(mock data)* | PUT `/api/ec/observations/{id}` | ❌ | Needs implementation |
| Observations | Delete | *(mock data)* | DELETE `/api/ec/observations/{id}` | ❌ | Needs implementation |
| Campaigns | List | *(mock data)* | GET `/api/ec/campaigns` | ❌ | Frontend uses static data |
| Campaigns | Create | *(mock data)* | POST `/api/ec/campaigns` | ❌ | Needs implementation |
| Campaigns | Details | *(mock data)* | GET `/api/ec/campaigns/{id}` | ❌ | Needs implementation |
| Campaigns | Update | *(mock data)* | PUT `/api/ec/campaigns/{id}` | ❌ | Needs implementation |
| Campaigns | Delete | *(mock data)* | DELETE `/api/ec/campaigns/{id}` | ❌ | Needs implementation |
| GeoAreas | List | *(mock data)* | GET `/api/ec/geo-areas` | ❌ | Frontend uses static data |
| GeoAreas | Create | *(mock data)* | POST `/api/ec/geo-areas` | ❌ | Needs implementation |
| GeoAreas | Details | *(mock data)* | GET `/api/ec/geo-areas/{id}` | ❌ | Needs implementation |
| GeoAreas | Update | *(mock data)* | PUT `/api/ec/geo-areas/{id}` | ❌ | Needs implementation |
| GeoAreas | Delete | *(mock data)* | DELETE `/api/ec/geo-areas/{id}` | ❌ | Needs implementation |
| Settings | List | GET `/v1/settings` | GET `/api/v1/settings` | ✅ | Uses global settings route |
| Settings | Create | — | POST `/api/v1/settings` | ❌ | Not implemented in frontend |
| Settings | Update | PUT `/v1/settings` | PUT `/api/v1/settings` | ✅ | - |
| Settings | Delete | — | DELETE `/api/v1/settings/{id}` | ❌ | Not implemented in frontend |

## Authentication & Error Handling
- Frontend requests made through `src/lib/api.ts` automatically attach the Bearer token and return rejected promises on error.
- Modules relying on mock data bypass authentication and lack consistent error handling.

## Recommendations
- Replace mock implementations (Agents, Volunteers, Observations, Campaigns, GeoAreas) with real API calls to the corresponding `/api/ec/*` endpoints.
- For Settings, confirm whether election-circle `/api/ec/settings` endpoints are required and implement missing create/delete operations if needed.
- Standardize error handling across modules using a shared helper and ensure all calls require an auth token.
