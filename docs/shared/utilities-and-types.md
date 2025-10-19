---
title: "Utilities and Types"
author: "Frontend Guild"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Shared Utilities & Types

## Purpose
- Catalogue helper libraries and type definitions exposed under `frontend/src/shared` and `frontend/src/types`.
- Clarify ownership to reduce duplication when building new modules.

## HTTP & Data Access
- `frontend/src/shared/lib/api.ts` – Axios instance with Sanctum token injection, retry helpers, and error normalization.
- `frontend/src/shared/lib/endpoints.ts` – Central map of REST endpoints consumed by feature modules.
- `frontend/src/shared/lib/safeData.ts` – Guards for nullable arrays/objects returned by backend responses.
- `frontend/src/shared/lib/utils.ts` – Formatting helpers (dates, numbers) shared across analytics and reporting modules.

## Realtime & Integrations
- `frontend/src/shared/lib/echo.ts` – Placeholder for Laravel Echo integration when websocket broadcasting is enabled.
- `frontend/src/shared/integrations/supabase` – Contains Supabase client setup for analytics experiments.
- `frontend/src/shared/lib/logging.ts` – Wraps console telemetry, toggled by environment flags.

## Type Definitions
- `frontend/src/types` – Global TypeScript declarations for API responses (elections, voters, committees, etc.).
- Feature-specific types under `frontend/src/features/<module>/types.ts` should import shared primitives when possible.
- Use Zod schemas alongside TypeScript types to enforce runtime validation for complex payloads.

## Best Practices
- Export new utilities via `frontend/src/shared/index.ts` to simplify imports.
- Keep environment-specific configuration (keys, URLs) in `frontend/src/config` rather than utility modules.
- Document JSON schema or Zod updates in pull requests and sync them with backend resources.

## Next Actions
1. Generate TypeScript types from Laravel API Resources automatically (OpenAPI/Typebox workflow).
2. Publish lint rules enforcing imports from shared utilities to avoid drift.
3. Expand Supabase integration notes once analytics experiments go live.
4. Add usage samples for formatting helpers in `docs/frontend/feature-guides.md` to encourage reuse.
