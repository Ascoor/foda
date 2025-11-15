# Changelog

## [Unreleased]
- Initialises the changelog file for backend releases.

## [2025-11-15] CAMP-REORG-API-ROUTES-002
- Replaced volunteer, donation, and expense route resources with role-aware, campaign-prefixed endpoints.
- Added dedicated controllers, requests, and services for geographic scopes and committees.
- Removed legacy `/api/v1/ec/*`, `roles`, and `sms/settings` routes.
- Introduced nested analytics routes alongside global analytics endpoints.
- Enforced Sanctum + `role:*` middleware across notifications, areas, and activities.
- Documented the new surface area in `README.md` and `docs/api-route-refactor.md` and added integration tests for the new controllers.
