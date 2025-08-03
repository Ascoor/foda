# Volunteer & Voter Module Mapping

| Legacy View/Feature | React Component/Page | API Endpoint | Status |
|---------------------|----------------------|-------------|--------|
| `volunteer.php` listing | `src/pages/Volunteers.tsx` & `VolunteerTable` | `GET /api/v1/volunteers` | list + search implemented |
| `add_new.php` (volunteer) | `VolunteerForm` in dialog | `POST /api/v1/volunteers` | implemented |
| `editVolunteer` action | same `VolunteerForm` with `PUT /api/v1/volunteers/{id}` | edit implemented |
| `delete` volunteer | `VolunteerTable` delete button | `DELETE /api/v1/volunteers/{id}` | implemented |
| `volunteer search` | new search input in `Volunteers.tsx` -> `GET /api/v1/volunteers?name=` | implemented |
| `voter.php` listing | `src/pages/Voters.tsx` | `GET /api/v1/voters` | list + search implemented |
| `add_new.php` (voter) | dialog form in `Voters.tsx` | `POST /api/v1/voters` | implemented |
| `editVoter` action | dialog form with `PUT /api/v1/voters/{id}` | implemented |
| `delete` voter | table delete button | `DELETE /api/v1/voters/{id}` | implemented |
| `voterDetails` (missing view) | `VoterDetails` component | `GET /api/v1/voters/{id}` | component available |
| voter import/export | `Voters.tsx` buttons | `POST /api/v1/voters/import`, `GET /api/v1/voters/export` | implemented |

## TODO
- Build dedicated details pages and integrate `VoterDetails`.
- Add team/area selectors from backend data.
- Backend tests require composer dependencies.
