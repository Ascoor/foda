---
title: "Data Models"
author: "Backend Platform"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Domain Data Models

## Purpose
- Catalog primary Laravel Eloquent models and their relationships.
- Provide backend/frontend engineers with a quick lookup for domain ownership and joins.

## Model Overview
| Model | Relationships | Key Notes |
| --- | --- | --- |
| `Election` (namespace `App\\Models\\ElectionCircle`) | Has many `GeoArea`, `Candidate`, `Campaign`; belongs to `Team` | Central aggregate representing an electoral cycle. |
| `Area` | Has many `Committee`; belongs to `Election` | Stores geographic metadata and coordinates for mapping. |
| `Committee` | Belongs to `Area`; has many `Voter`, `Agent`, `Volunteer`, `Observation` | Core organizing unit for field operations. |
| `Voter` | Belongs to `Committee`; has many `Observation` | Tracks registration status, demographics, and activity logs. |
| `Candidate` | Belongs to `Election`; has many `Agent`, `Volunteer` | Links to campaign records, media assets, and analytics snapshots. |
| `Agent` | Belongs to `Committee`, `Candidate`; pivot with assignments | Handles field responsibilities; assignments tracked via pivot tables. |
| `Volunteer` | Belongs to `Team`; optional relation to `Committee` | Captures skills, availability, and contact info; orchestrated by `VolunteerService`. |
| `Activity` | Belongs to `Committee`, `Volunteer`, `Area`; morphs to related entities | Records field events and timeline updates; drives analytics dashboards. |
| `Finance` | Belongs to `Campaign`/`Committee`; tagged by `ExpenseCategory` | Ledger for income/expense flows with ledger exports. |
| `Team` | Has many `Volunteer`, `Agent`, `Campaign` | Defines organizational units with RBAC scoping. |
| `Sms` / `SmsSetting` | Belongs to `User`, `Campaign`; configures rate limits | Governs outbound communications and provider credentials. |
| `AnalyticsSnapshot` | Belongs to `Election`, `Area` | Stores cached analytics results for dashboards. |
| `User` | Belongs to many `Role`; has many owned models | Managed via Sanctum tokens with Spatie Permission roles. |

## Database Conventions
- Soft deletes enabled on user-facing entities (`Voter`, `Volunteer`, `Agent`, `Observation`).
- All timestamps stored in UTC; conversions handled on the frontend.
- JSON columns used for flexible metadata on campaigns and observations.

## Next Actions
1. Publish ER diagram referencing model relationships in this table.
2. Document pivot tables (committee_agent, volunteer_skills) with column definitions.
3. Add database seed references for critical lookup tables (roles, permissions, categories).
4. Align frontend TypeScript types with backend resources to minimize serialization drift.
