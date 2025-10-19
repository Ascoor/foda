# Blueprint reference for the normalized campaign schema

This directory contains the canonical table definitions that power the schema synchronizer.  
The blueprints align with the normalized data model that emerged from the structural review of
existing migrations and the product roadmap for the campaign management platform.

The design groups entities into functional domains:

| Domain | Key tables | Purpose |
| --- | --- | --- |
| Identity & access | `users`, `profiles`, `roles`, `permissions`, `permission_role`, `teams` | Manage accounts, personal details, hierarchical teams, and granular authorization. |
| Elections & campaigns | `elections`, `candidates`, `campaigns`, `geo_areas`, `committees`, `agents` | Capture the election calendar, candidate roster, campaign configuration, and geographic footprint down to the committee level. |
| Field operations | `volunteers`, `voters`, `activities`, `events`, `messages`, `notifications` | Coordinate outreach teams, log interactions with voters, schedule field events, and deliver communications. |
| Finance & analytics | `expense_categories`, `finances`, `analytics_snapshots`, `settings` | Track spending and donations, surface KPIs for dashboards, and centralize operational configuration. |

## Relationship highlights

- **Campaign centric** – `campaigns` act as the hub for volunteers, voters, events, activities,
  finance records, and messaging.  Each campaign can optionally link to a `candidate` and to the
  primary `geo_area` where it operates.
- **Geographic hierarchy** – `geo_areas` uses a parent → child chain so that governorates,
  districts, and committees can be navigated easily.  Committees reference both the campaign they
  support and the geographic boundary they occupy, while `agents` register the people who steward
  every committee on the ground.
- **People-first records** – `users` carry authentication and team placement, whereas `profiles`
  store sensitive personal data.  Volunteers may be linked to user accounts, but can also be
  tracked independently when needed.  Voters retain support status, most recent contact, and field
  notes so the outreach team always has context.
- **Unified communications** – The `messages` table consolidates SMS, email, and other outbound
  channels by using polymorphic recipient columns.  In-app updates still flow through `notifications`
  to keep team members aware of assignments and campaign progress.
- **Financial transparency** – `expense_categories` normalizes chart-of-account values while
  `finances` documents every monetary movement with references to the campaign, category, and the
  staff member who logged it.

## Using the blueprints

Run the schema synchronizer to inspect or rebuild tables based on these definitions:

```bash
php artisan schema:sync            # Inspect differences
php artisan schema:sync --apply    # Apply updates using the canonical blueprints
php artisan schema:sync --apply --cleanup   # Apply updates and drop extra tables
```

Each blueprint enables timestamps by default unless otherwise noted (for example, the `permission_role`
pivot).  Soft deletes are explicitly enabled on operational tables that benefit from recovery and auditing.
