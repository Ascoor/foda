# Changelog

## [2025-03-07] Documentation review & consolidation
- Updated `ARCHITECTURE.md` to reflect the live Laravel 10 + React 18 stack and the current service layering.
- Refreshed `DATA_FLOW.md` with the actual Axios/Sanctum pipeline and caching touchpoints.
- Corrected `README_AR.md` links/versions and introduced a unified logic overview in `APP_LOGIC_REVIEW.md`.
- Removed the obsolete `laravel10-upgrade-findings.json` artifact after confirming fixes landed in code.

## [2025-02-15] Frontend maintenance sweep
- Consolidated static media under `src/assets` and updated modules to consume bundled imports for reliable cache busting.
- Replaced legacy CSS helpers with Tailwind plugin utilities and trimmed unused `App.css` styles.
- Reduced external font payload to core Inter/Noto families and documented the asset/testing workflow.

## [2024-10-14] Frontend sync prep
- Sketched API type generation workflow to align frontend endpoints with the Elections360 schema.
- Identified automation tasks (`generate:types`, sync scripts) to revisit once API contracts stabilise.
