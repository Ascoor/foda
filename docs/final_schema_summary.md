# Final Schema Summary

## ERD Overview
- **Elections** own many campaigns and geo areas; campaigns optionally link back to their election for shared analytics contexts.【F:backend/database/migrations/2024_01_10_000010_create_elections_table.php†L13-L32】【F:backend/database/migrations/2024_01_10_000050_create_geo_areas_table.php†L14-L36】
- **Campaigns** are the core scope for most operational tables (polling days, teams, volunteers, voters, committees, finances, events, analytics, communications). Each of these tables carries a `campaign_id` foreign key with cascading updates and `restrictOnDelete` to preserve history.【F:backend/database/migrations/2024_01_10_000020_create_campaigns_table.php†L13-L36】【F:backend/database/migrations/2024_01_10_000200_create_activities_table.php†L15-L44】
- **Users** participate in campaigns via the `campaign_user` pivot (role, status, permissions) while retaining global accounts. External identity providers are tracked in the `auths` table.【F:backend/database/migrations/2014_10_12_000000_create_users_table.php†L13-L42】【F:backend/database/migrations/2024_01_10_000270_create_campaign_user_table.php†L13-L31】【F:backend/database/migrations/2024_01_10_000250_create_auths_table.php†L13-L30】
- **Geo areas** and **committees** organize voters and volunteers geographically; pivot tables (`campaign_area`) tie geo areas to specific campaigns with unique composite keys.【F:backend/database/migrations/2024_01_10_000060_create_committees_table.php†L13-L36】【F:backend/database/migrations/2024_01_10_000290_create_campaign_area_table.php†L13-L29】
- **Engagement artifacts** (activities, events, notifications, sms, observations, SWOT analyses, analytics snapshots) all reference campaigns and applicable subject entities with JSON metadata for extensibility.【F:backend/database/migrations/2024_01_10_000200_create_activities_table.php†L15-L44】【F:backend/database/migrations/2024_01_10_000210_create_automation_tasks_table.php†L13-L30】【F:backend/database/migrations/2024_01_10_000220_create_analytics_snapshots_table.php†L13-L33】【F:backend/database/migrations/2024_01_10_000170_create_sms_table.php†L13-L35】

## Campaign Scoping Model
- Every campaign-scoped table enforces `campaign_id` foreign keys with `cascadeOnUpdate` and `restrictOnDelete`, preventing orphaned operational records when campaigns are removed while still allowing campaign renames or ID shifts.【F:backend/database/migrations/2024_01_10_000090_create_volunteers_table.php†L15-L35】【F:backend/database/migrations/2024_01_10_000140_create_finances_table.php†L14-L34】
- Soft deletes are applied to long-lived campaign assets such as campaigns, teams, volunteers, committees, agents, voters, events, notifications, SMS logs, SWOT entries, and observations so that audit trails remain recoverable without cluttering day-to-day queries.【F:backend/database/migrations/2024_01_10_000020_create_campaigns_table.php†L25-L33】【F:backend/database/migrations/2024_01_10_000090_create_volunteers_table.php†L29-L33】【F:backend/database/migrations/2024_01_10_000150_create_notifications_table.php†L27-L32】【F:backend/database/migrations/2024_01_10_000190_create_observations_table.php†L31-L36】
- Composite unique indexes exist on all campaign pivot/association tables (`campaign_user`, `campaign_volunteer`, `campaign_area`, `campaign_polling_days`) to enforce uniqueness per campaign context.【F:backend/database/migrations/2024_01_10_000270_create_campaign_user_table.php†L25-L27】【F:backend/database/migrations/2024_01_10_000280_create_campaign_volunteer_table.php†L24-L26】【F:backend/database/migrations/2024_01_10_000290_create_campaign_area_table.php†L24-L26】【F:backend/database/migrations/2024_01_10_000030_create_campaign_polling_days_table.php†L22-L24】
- Shared lookup/reference tables (areas, geo areas, elections, settings) remain campaign-agnostic so they can be reused across elections or multiple campaigns as required by regional deployments.【F:backend/database/migrations/2024_01_10_000040_create_areas_table.php†L13-L35】【F:backend/database/migrations/2024_01_10_000230_create_settings_table.php†L13-L33】

## Table Highlights
### Elections & Campaigns
- `elections` capture type, schedule, and metadata for each electoral process.【F:backend/database/migrations/2024_01_10_000010_create_elections_table.php†L13-L32】
- `campaigns` link to elections (nullable), include lifecycle timing, spatial bounding box, status, and soft deletes for archival recovery.【F:backend/database/migrations/2024_01_10_000020_create_campaigns_table.php†L13-L33】
- `campaign_polling_days` enumerate major and auxiliary polling windows per campaign with uniqueness on the campaign/date pair.【F:backend/database/migrations/2024_01_10_000030_create_campaign_polling_days_table.php†L13-L24】

### Geography & Organization
- `areas` store hierarchical administrative divisions with parent references and indexes on parent/level and codes for fast lookups.【F:backend/database/migrations/2024_01_10_000040_create_areas_table.php†L13-L34】
- `geo_areas` map geospatial geometry, campaign ownership, and optional election scope for mapping integrations.【F:backend/database/migrations/2024_01_10_000050_create_geo_areas_table.php†L13-L37】
- `committees` sit at the intersection of campaigns and geo areas with chairperson references and soft deletes.【F:backend/database/migrations/2024_01_10_000060_create_committees_table.php†L13-L35】
- `teams` belong to campaigns, may be assigned to areas, and include supervisor user references alongside soft deletes and campaign/name indexes.【F:backend/database/migrations/2024_01_10_000080_create_teams_table.php†L13-L33】

### People & Participation
- `users` remain global accounts; campaign membership and roles are modeled in `campaign_user` with timestamps and JSON permissions payloads.【F:backend/database/migrations/2014_10_12_000000_create_users_table.php†L13-L42】【F:backend/database/migrations/2024_01_10_000270_create_campaign_user_table.php†L13-L31】
- `volunteers` and `agents` carry campaign/committee/team assignments plus soft deletes and composite uniqueness on campaign/email for deduplication.【F:backend/database/migrations/2024_01_10_000090_create_volunteers_table.php†L15-L33】【F:backend/database/migrations/2024_01_10_000100_create_agents_table.php†L13-L34】
- `voters` attach to campaigns, committees, and areas with support/turnout metrics and soft deletes to support canvassing insights.【F:backend/database/migrations/2024_01_10_000110_create_voters_table.php†L13-L37】
- `campaign_volunteer` captures cross-campaign volunteer assignments with unique constraints and tag metadata.【F:backend/database/migrations/2024_01_10_000280_create_campaign_volunteer_table.php†L13-L27】

### Engagement & Operations
- `activities` log voter interactions with geographic context, support scores, and user attribution; indexed by campaign/reporting time.【F:backend/database/migrations/2024_01_10_000200_create_activities_table.php†L15-L44】
- `events` coordinate campaign events tied to areas and teams with soft deletes.【F:backend/database/migrations/2024_01_10_000120_create_events_table.php†L13-L34】
- `automation_tasks` store scheduled workflows with JSON configuration for marketing automations.【F:backend/database/migrations/2024_01_10_000210_create_automation_tasks_table.php†L13-L32】
- `notifications` and `sms` maintain outbound communication logs, each scoped to campaigns with soft deletes and delivery metadata.【F:backend/database/migrations/2024_01_10_000150_create_notifications_table.php†L13-L32】【F:backend/database/migrations/2024_01_10_000170_create_sms_table.php†L13-L35】
- `observations` and `swots` deliver qualitative intelligence with polymorphic-like entity references and soft deletes.【F:backend/database/migrations/2024_01_10_000180_create_swots_table.php†L13-L33】【F:backend/database/migrations/2024_01_10_000190_create_observations_table.php†L13-L36】
- `analytics_snapshots` provide periodic metrics keyed by campaign/election with JSON payloads.【F:backend/database/migrations/2024_01_10_000220_create_analytics_snapshots_table.php†L13-L33】

### Finance & Settings
- `expense_categories` and `finances` enforce campaign ownership and indexing for reporting by date/category.【F:backend/database/migrations/2024_01_10_000130_create_expense_categories_table.php†L13-L31】【F:backend/database/migrations/2024_01_10_000140_create_finances_table.php†L14-L32】
- `settings`, `profiles`, `homes`, and `auths` capture application configuration, user profile details, homepage modules, and OAuth credentials, respectively.【F:backend/database/migrations/2024_01_10_000230_create_settings_table.php†L13-L34】【F:backend/database/migrations/2024_01_10_000240_create_profiles_table.php†L13-L33】【F:backend/database/migrations/2024_01_10_000260_create_homes_table.php†L13-L32】【F:backend/database/migrations/2024_01_10_000250_create_auths_table.php†L13-L30】

## Relationship & Scope Notes
- Every campaign-aware Eloquent model ships with `scopeInCampaign` and `scopeSearch` helpers to standardize filtering across APIs (see `App\Models\Campaign`, `Volunteer`, `Team`, `Activity`, and others).【F:backend/app/Models/Campaign.php†L56-L89】【F:backend/app/Models/Volunteer.php†L63-L101】
- Pivot relations (`campaign_user`, `campaign_volunteer`, `campaign_area`) are exposed through belongsToMany definitions on `Campaign`, `User`, `Volunteer`, and `GeoArea` for consistent assignment workflows.【F:backend/app/Models/Campaign.php†L97-L111】【F:backend/app/Models/User.php†L79-L118】
- Soft-deleted records default to being excluded from queries, but scopes like `withinWindow` and `status` on relevant models facilitate temporal filtering without bypassing deletion flags.【F:backend/app/Models/AutomationTask.php†L68-L101】【F:backend/app/Models/Event.php†L72-L109】

## Operational Runbook
1. **Migrations** execute chronologically, beginning with Laravel defaults (permissions, users, passwords, jobs, tokens) followed by the canonical 2024 schema files (`create_elections_table` through `create_election_settings_table`).【F:backend/database/migrations/2014_10_11_000001_create_permission_tables.php†L13-L123】【F:backend/database/migrations/2024_01_10_000310_create_election_settings_table.php†L13-L33】
2. **Seeders** run via `DatabaseSeeder`: roles/permissions, core data (admin, base election/campaign, expense categories, settings, SMS credentials), then optional demo fixtures when `--demo` is supplied.【F:backend/database/seeders/DatabaseSeeder.php†L11-L20】【F:backend/database/seeders/CoreDataSeeder.php†L18-L79】【F:backend/database/seeders/DemoDataSeeder.php†L18-L107】

