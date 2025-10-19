---
title: "API Design"
author: "Backend Platform"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# API Design Overview

## Purpose
- Document REST conventions for the Laravel `/api/v1` namespace consumed by the Elections360 frontend.
- Centralize entity coverage, request patterns, and response guarantees for cross-team alignment.

## Core Principles
- **Resource-oriented URLs** grouped by domain: elections, geo areas, committees, voters, candidates, agents, volunteers, observations, campaigns, analytics, and settings.
- **Authentication** via Laravel Sanctum bearer tokens; tokens managed by `AuthController` and stored in HTTP-only cookies or secure storage.
- **Validation** handled by FormRequest classes or inline `$request->validate()` rules with consistent `{ code, message, details }` error envelopes (standardization in progress).
- **Pagination** uses Laravel's cursor/length-aware pagination with `page`, `per_page`, `links`, and `meta` keys returned by API Resources.
- **Localization** optional `Accept-Language` header controlling Arabic/English labels for user-facing strings.

## Endpoint Families
| Domain | Endpoint Prefix | Key Operations |
| --- | --- | --- |
| Elections | `/api/v1/elections` | List, create, update, publish schedules, manage participants. |
| Geo Areas | `/api/v1/areas` | CRUD operations with `committee`/`zone` relationships and coordinate metadata. |
| Committees | `/api/v1/committees` | Manage committee rosters, attach voters/agents, and synchronize area coverage. |
| Voters | `/api/v1/voters` | CRUD with filters (`search`, `committee_id`, `status`), CSV import/export hooks. |
| Candidates | `/api/v1/candidates` | Manage candidate biographies, campaign assignments, and volunteer links. |
| Agents | `/api/v1/agents` | Assign agents to committees, generate assignments, export rosters. |
| Volunteers | `/api/v1/volunteers` | Manage volunteer lifecycle, assignments, and skills catalogue. |
| Observations | `/api/v1/observations` | Log field observations and violations with attachments and workflow states. |
| Finance | `/api/v1/finances` | Track income/expenses, reference campaigns, and produce ledger exports. |
| SMS | `/api/v1/sms` | Send or schedule messages, inspect delivery status, and manage rate limits. |
| Settings | `/api/v1/settings` | Retrieve/update configuration toggles consumed by the frontend admin module. |

## Request & Response Patterns
- **Filtering:** Query parameters such as `search`, `committee_id`, `type`, `date_from`, `date_to`, and `status` are consistently supported across list endpoints.
- **Sorting:** `sort_by` and `order` optional for major list endpoints; defaults documented in API Resource classes.
- **Relationships:** `include[]` parameter planned for embedding related resources (`area`, `team`, `assigned_to`).
- **Error Handling:** Standardize to `422` for validation failures, `403` for policy denials, and `404` for missing resources with descriptive `details` arrays.

## Service Layer Touchpoints
- Controllers delegate to dedicated services (`VolunteerService`, `SmsService`, `FinanceService`) to encapsulate business rules and transactional logic.
- Events emitted (`ActivityCreated`, `VolunteerAssigned`) trigger notifications and analytics cache invalidation.
- Jobs queue planned for heavy operations (SMS retries, export generation) pending worker rollout.

## Next Actions
1. Publish OpenAPI (Swagger) specs generated via `l5-swagger` with examples sourced from API Resources.
2. Finalize shared error envelope utilities and update frontend `SafeDataRenderer` usage accordingly.
3. Expand integration tests to cover filters, sorting, and localization branches for each endpoint family.
4. Document webhook schemas for outbound integrations (SMS providers, reporting partners).
