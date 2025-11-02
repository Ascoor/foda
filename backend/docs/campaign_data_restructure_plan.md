# Campaign-Centric Data Restructure Plan

## High-Level Orientation
The global catalog remains focused on immutable identities and reference data. `users`, `volunteers` (persons), and the geo hierarchy (`geo_areas` plus legacy `areas`) stay campaign-agnostic so they can power authentication, staffing pools, and shared lookup tables across every campaign instance. These tables continue to be managed by the platform core team and only receive indirect campaign context through pivot tables.

Every operational dataset that captures activities, finances, communications, or qualitative work products becomes campaign-local. Committees, agents, voters, events, activities, finances, SWOT entries, SMS batches/messages, notifications that reference operational records, teams, and automation tasks all receive a mandatory `campaign_id` column and indexing so data is isolated per campaign. Campaigns therefore provide the authorization boundary and reporting silo for day-to-day operations.

Three pivot bridges connect global catalogs to campaign context: `campaign_user` (users invited to a campaign with `role`, `status`, `permissions` payload), `campaign_volunteer` (volunteers assigned to a campaign with `assignment`, `shift`, `tags` metadata), and `campaign_area` (geo areas scoped to a campaign with local `alias`/`code`). These tables enforce uniqueness per campaign and surface timestamps for auditing membership churn.


## Migration Rollout Order
1. `2024_10_18_000000_create_campaign_user_table.php`
2. `2024_10_18_000100_create_campaign_volunteer_table.php`
3. `2024_10_18_000200_create_campaign_area_table.php`
4. `2024_10_18_001500_add_campaign_scoping_to_operational_tables.php`
5. `2024_10_18_002000_update_committees_voters_agents_for_campaign.php`

This ordering ensures pivot bridges exist before enforcing campaign constraints on dependent tables, and committees/voters/agents receive their stricter uniqueness rules last to avoid orphan references during backfill.

## Backfill Strategy
1. **Campaign context discovery** – derive `campaign_id` for committees, events, finances, and other operational rows via existing foreign keys (`committees` → `campaigns`, `teams` → `committees`/`areas`, `activities` already referencing `campaigns`). Prepare a mapping table or temporary view for reuse.
2. **Chunked updates** – run an artisan command (e.g., `php artisan campaign:backfill`) that iterates with `chunkById(500)` and performs transactional updates per batch. Use `DB::transaction` and `SELECT ... FOR UPDATE` when updating high-write tables like `activities` to avoid concurrent drift.
3. **Agents backfill guard** – before enforcing `agents_person_unique`, aggregate on `person_id` to detect volunteers serving multiple campaigns. Persist conflicts to an `agent_conflicts` audit table and abort the migration so operators can resolve manually.
4. **SMS/SMS settings** – update records by matching the owning team/activity/committee where possible; fallback to a default campaign flagged in a `backfill_notes` JSON column so teams can review.
5. **Validation sweep** – after population, run consistency checks: `SELECT COUNT(*) WHERE campaign_id IS NULL`, verify `COUNT(DISTINCT voter_uid)` matches per campaign, and compare totals with pre-migration exports. Document results in the deployment log.

## Post-Migration Checklist
- Verify all operational tables expose `campaign_id` with indexes described in the migrations.
- Confirm committees enforce `unique(campaign_id, code)` and voters enforce `unique(campaign_id, voter_uid)`.
- Validate agents have both `unique(campaign_id, person_id)` and the global `unique(person_id)` (or adjust to partial index if the strict rule must be relaxed).
- Ensure `/api/campaigns/{campaign}` routes resolve via the new middleware and that authorization uses the `campaign_user` pivot.
- Run feature tests for agent uniqueness and cross-campaign guards and keep smoke tests for analytics endpoints.

## Rollback Notes
- Drop the foreign keys and indexes introduced in the campaign pivot tables (`campaign_user`, `campaign_volunteer`, `campaign_area`) before dropping the tables themselves.
- Remove `campaign_id` columns from operational tables in the reverse order of the rollout to avoid violating foreign keys during teardown. Restore previous unique constraints on `voters` (`voter_id`) and `committees` (name-based) if they existed.
- Recreate any dropped unique indexes (like `agents_person_unique`) only after repopulating the legacy data model to avoid partial rollbacks leaving residual constraints.
