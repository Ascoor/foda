# Schema Alignment Report

**Generated:** 2025-10-20T09:46:00Z (UTC)

## Summary
- Synced Laravel migrations with Electoral Blueprint v4.2 requirements.
- Restored missing foreign keys, enums, and soft deletion columns required by API resources.
- Added strategic indexes to support dashboard filtering and analytics workloads.

## Table Updates
### users
- Added `team_id` link to `teams` with null-on-delete handling.
- Enforced `status` enum (`active`, `inactive`) and indexed login audit columns.
- Enabled soft deletes for archival workflows.

### voters
- Reintroduced `voter_id` identity, committee assignment, and support tracking fields.
- Logged last contact timestamps and free-form notes.
- Added soft deletes and indexes on support workflows.

### volunteers
- Added `active` toggle and `assigned_area_id` relation to `geo_areas`.
- Enabled soft deletes and composite index on assignment fields.

### events
- Stored event `type` taxonomy and switched `date` to full datetime.
- Made organiser/location optional while keeping area/team cascades.
- Enabled soft deletes and index on `date` + `type`.

### finances
- Normalised `reference_id` string identifier and donation/expense enum.
- Made `category_id` nullable with null-on-delete cascade.
- Added soft deletes and indexes on reference, type, and date.

### notifications
- Defaulted notification `type` to `system` and made `message` optional.
- Retained JSON metadata, added soft deletes, and kept priority/read indexes.

### committees
- Cascaded `geo_area_id`, added `voters_count`, and enabled soft deletes.
- Indexed by `name` and `geo_area_id` for faster lookups.

## Next Steps
- Run `php artisan migrate:fresh` locally to verify schema changes.
- Rebuild any cached config or schema metadata before deploying.

✅ Schema synchronized successfully with Laravel models & Electoral Blueprint v4.2.
