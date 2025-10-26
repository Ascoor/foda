---
title: "Integrations"
author: "Platform Engineering"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Integration Commands & External Services

## Purpose
- Centralize integration-related artisan commands and external service coordination.
- Replace the previous `docs/INTEGRATION/*.md` collection with a streamlined reference.

## Artisan Command Catalog
| Command | Description | Output |
| --- | --- | --- |
| `php artisan integration:verify` | Validates schema relationships, frontend types, and Arabic dataset coverage. | `storage/logs/integration_report.md` |
| `php artisan api:profile --top=10` | Benchmarks frequently used API endpoints. | `storage/logs/api_profile.md` |
| `php artisan lifecycle:test` | Simulates campaign/volunteer/voter lifecycles including soft deletes. | `storage/logs/lifecycle_report.md` |
| `php artisan logs:unify` | Merges `schema_audit.md`, `factory_audit.md`, and `sync.log` into a unified report. | `storage/logs/system_unified_report.md` |
| `php artisan generate:arabic-test-data` | Seeds localized fixtures for QA scenarios. | Appends entries to `factory_audit.md`. |

## External Providers
- **SMS** – Twilio (or configured provider) handled by `App\\Services\\SmsService`; rate limits configured in `SmsSetting`.
- **Supabase** – Experimental analytics data source consumed via `frontend/src/shared/integrations/supabase` utilities.
- **Maps/Geo** – Mapbox or Leaflet integrations handled through shared map components (TBD) with credentials stored in `.env`.

## Operational Guidance
- Run the command suite above after schema migrations or major frontend releases to ensure parity.
- Archive generated reports quarterly as part of compliance evidence.
- Document API credentials and rotation schedules in the internal secrets manager, not in source control.

## Next Actions
1. Automate integration command execution in CI with threshold-based alerts.
2. Document webhook endpoints and retry strategies for SMS providers.
3. Expand geo-integration docs once tile services are finalized.
4. Add monitoring dashboards that track artisan command durations and failures.
