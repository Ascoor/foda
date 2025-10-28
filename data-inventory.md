# Data Inventory

This document captures the current front-end data contracts for the unified navigation modules. Each section links the TypeScript
model, the consuming UI, and the API endpoint. Use this as the source of truth when aligning DTOs with the backend.

## Elections (`src/types/Election.ts`, `features/elections`)

| Field | Type | Source | API Contract | Notes |
| ----- | ---- | ------ | ------------ | ----- |
| `uuid` | `string` | `BaseEntity` | `GET /crm/elections` | Primary identifier.
| `name` | `string` | `Election` | `GET /crm/elections` | Displayed in lists and breadcrumbs.
| `code` | `string` | `Election` | `GET /crm/elections` | Unique campaign code, used for search.
| `status` | `ElectionStatus` | `Election` | `GET /crm/elections` | Values: `draft`, `scheduled`, `active`, `archived`.
| `cycle_year` | `number` | `Election` | `GET /crm/elections` | Used in KPI cards.
| `phases` | `ElectionPhase[]` | `Election` | `GET /crm/elections/:id` | Drives timeline visualisations.
| `default_geo_scope` | `string \| null` | `Election` | `GET /crm/elections/:id` | Links to `GeoArea.uuid`.

## Geo Areas (`src/types/GeoArea.ts`, `features/geo-areas`)

| Field | Type | Source | API Contract | Notes |
| ----- | ---- | ------ | ------------ | ----- |
| `uuid` | `string` | `BaseEntity` | `GET /crm/geo-areas` | Primary identifier.
| `name` | `string` | `GeoArea` | `GET /crm/geo-areas` | Listed in dashboard cards.
| `code` | `string` | `GeoArea` | `GET /crm/geo-areas` | Used for import/export.
| `type` | `GeoAreaType` | `GeoArea` | `GET /crm/geo-areas` | Values: `country`, `state`, `district`, `municipality`, `ward`, `precinct`.
| `parent_uuid` | `string \| null` | `GeoArea` | `GET /crm/geo-areas` | Builds hierarchy tree.
| `boundary` | `GeoBoundary` | `GeoArea` | `GET /crm/geo-areas/:id` | GeoJSON polygon for maps.
| `population` | `number \| null` | `GeoArea` | `GET /crm/geo-areas/:id` | Drives heat maps / coverage.

## Committees (`src/types/Committee.ts`, `features/committees`)

| Field | Type | Source | API Contract | Notes |
| ----- | ---- | ------ | ------------ | ----- |
| `uuid` | `string` | `BaseEntity` | `GET /crm/committees` | Primary identifier.
| `name` | `string` | `Committee` | `GET /crm/committees` | Display label in lists.
| `type` | `CommitteeType` | `Committee` | `GET /crm/committees` | Values: `central`, `regional`, `local`.
| `geo_area_uuid` | `string \| null` | `Committee` | `GET /crm/committees` | Links to `GeoArea` record.
| `location` | `string \| null` | `Committee` | `GET /crm/committees/:id` | Used in detail map card.
| `contact_email` | `string \| null` | `Committee` | `GET /crm/committees/:id` | Primary contact.
| `contact_phone` | `string \| null` | `Committee` | `GET /crm/committees/:id` | Primary hotline.

## Voters (`src/types/Voter.ts`, `features/voters`)

| Field | Type | Source | API Contract | Notes |
| ----- | ---- | ------ | ------------ | ----- |
| `uuid` | `string` | `BaseEntity` | `GET /crm/voters` | Primary identifier.
| `full_name` | `string` | `Voter` | `GET /crm/voters` | Displayed in table and detail header.
| `national_id` | `string` | `Voter` | `GET /crm/voters` | Used for dedupe + search.
| `gender` | `'male' \| 'female' \| 'other'` | `Voter` | `GET /crm/voters` | Drives filters and analytics.
| `birth_date` | `string` | `Voter` | `GET /crm/voters/:id` | ISO-8601 date.
| `status` | `VoterStatus` | `Voter` | `GET /crm/voters` | Values: `active`, `inactive`, `suspended`, `deceased`, `moved`.
| `election_uuid` | `string` | `Voter` | `GET /crm/voters` | Links record to election.
| `geo_area_uuid` | `string \| null` | `Voter` | `GET /crm/voters` | Normalised geography link.
| `committee_uuid` | `string \| null` | `Voter` | `GET /crm/voters` | Polling assignment.
| `contact` | `VoterContact` | `Voter` | `GET /crm/voters/:id` | Structured contact payload.
| `mobile` | `string \| null` | `Voter` | `GET /crm/voters` | Quick actions.
| `tags` | `string[] \| undefined` | `Voter` | `GET /crm/voters/:id` | Segmentation labels.

REST actions handled in `features/voters/api.ts` map to:
- `GET /crm/voters` (paginated list with `meta.total`)
- `GET /crm/voters/:id`
- `POST /crm/voters`
- `PUT /crm/voters/:id`
- `DELETE /crm/voters/:id`

## Field Agents (`src/types/Agent.ts`, `features/agents`)

| Field | Type | Source | API Contract | Notes |
| ----- | ---- | ------ | ------------ | ----- |
| `uuid` | `string` | `BaseEntity` | `GET /ops/agents` | Primary identifier.
| `full_name` | `string` | `Agent` | `GET /ops/agents` | Display name.
| `code` | `string` | `Agent` | `GET /ops/agents` | Badge / credential ID.
| `status` | `'active' \| 'standby' \| 'inactive'` | `Agent` | `GET /ops/agents` | Controls badge tone.
| `assignment.type` | `AgentAssignmentType` | `Agent` | `GET /ops/agents/:id` | `polling_station`, `field`, `digital`.
| `assignment.geo_area_uuid` | `string \| null` | `Agent` | `GET /ops/agents/:id` | Links to field map.
| `assignment.committee_uuid` | `string \| null` | `Agent` | `GET /ops/agents/:id` | Committee pairing.
| `contact_number` | `string \| null` | `Agent` | `GET /ops/agents` | Dialer integration.
| `notes` | `string \| null` | `Agent` | `GET /ops/agents/:id` | Internal commentary.

## Volunteers (`src/types/Volunteer.ts`, `features/volunteers`)

| Field | Type | Source | API Contract | Notes |
| ----- | ---- | ------ | ------------ | ----- |
| `uuid` | `string` | `BaseEntity` | `GET /ops/volunteers` | Primary identifier.
| `full_name` | `string` | `Volunteer` | `GET /ops/volunteers` | Display name.
| `status` | `VolunteerStatus` | `Volunteer` | `GET /ops/volunteers` | `active`, `onboarding`, `inactive`.
| `assigned_committee_uuid` | `string \| null` | `Volunteer` | `GET /ops/volunteers/:id` | Committee placement.
| `skills` | `string[] \| undefined` | `Volunteer` | `GET /ops/volunteers/:id` | Training tags.
| `availability` | `VolunteerAvailability \| undefined` | `Volunteer` | `GET /ops/volunteers/:id` | `weekdays`, `hours_per_week`.
| `notes` | `string \| null` | `Volunteer` | `GET /ops/volunteers/:id` | Internal commentary.

## Campaigns & Automation (`src/types/Campaign.ts`, `features/campaigns`)

| Field | Type | Source | API Contract | Notes |
| ----- | ---- | ------ | ------------ | ----- |
| `uuid` | `string` | `BaseEntity` | `GET /campaigns` | Primary identifier.
| `name` | `string` | `Campaign` | `GET /campaigns` | Display label.
| `status` | `CampaignStatus` | `Campaign` | `GET /campaigns` | `draft`, `active`, `paused`, `completed`.
| `starts_at` | `string` | `Campaign` | `GET /campaigns` | ISO-8601 start timestamp.
| `ends_at` | `string` | `Campaign` | `GET /campaigns` | ISO-8601 end timestamp.
| `owner_uuid` | `string` | `Campaign` | `GET /campaigns` | User responsible.
| `goals` | `CampaignGoal[]` | `Campaign` | `GET /campaigns/:id` | Metric target definitions.
| `activities` | `Activity[] \| undefined` | `Campaign` | `GET /campaigns/:id` | Field activations, reused by Observations.
| `budget` | `number \| null` | `Campaign` | `GET /campaigns/:id` | Financial oversight.

## Observations & Field Reports (`src/types/Activity.ts`, `features/observations`)

| Field | Type | Source | API Contract | Notes |
| ----- | ---- | ------ | ------------ | ----- |
| `uuid` | `string` | `BaseEntity` | `GET /ops/observations` | Observation identifier.
| `campaign_uuid` | `string` | `Activity` | `GET /ops/observations` | Campaign link.
| `type` | `ActivityType` | `Activity` | `GET /ops/observations` | `door_knock`, `phone_bank`, `rally`, `training`, `fundraising`, `digital`.
| `status` | `ActivityStatus` | `Activity` | `GET /ops/observations` | `planned`, `in_progress`, `completed`, `cancelled`.
| `scheduled_for` | `string` | `Activity` | `GET /ops/observations` | Field scheduling.
| `geo_area_uuid` | `string \| null` | `Activity` | `GET /ops/observations/:id` | Location pivot.
| `assigned_volunteer_uuids` | `string[] \| undefined` | `Activity` | `GET /ops/observations/:id` | Participant list.
| `metrics` | `Record<string, number> \| undefined` | `Activity` | `GET /ops/observations/:id` | Custom telemetry (e.g. contacts_made).

---

**Pagination & Metadata**
- List endpoints (`/crm/voters`, `/crm/committees`, `/ops/agents`, etc.) follow `{ data: T[], meta: { total, per_page, current_page } }` with a fallback to `{ data: T[] }`. Ensure both shapes remain supported until backend is harmonised.
- Filters accept camelCase query params that map directly to the TypeScript filter interfaces (e.g. `VoterFilters`).

**Runtime validation**
- All request helpers rely on `@shared/lib/api`. When introducing new DTOs, define the TypeScript interface in `src/types` and extend the corresponding Zod schema in `@shared/lib/validation` (to be implemented) to guarantee runtime parity.
