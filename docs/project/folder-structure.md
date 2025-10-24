---
title: "Repository Folder Structure"
author: "Knowledge Management"
last_updated: "2024-05-20"
version: "v1.0"
status: "Active"
---

# Repository Folder Structure

This guide explains the expected layout for the Elections360 monorepo after the documentation overhaul. Use it when auditing, rebuilding, or onboarding new contributors to ensure the repository stays aligned with the approved architecture.

## Top-Level Directories

| Directory | Purpose | Steward |
| --- | --- | --- |
| `frontend/` | Production React + TypeScript application served to end users. | Frontend Platform |
| `frontend-new/` | Experimental rewrite workspace for large-scale refactors. | Frontend Platform |
| `backend/` | Laravel 8 API powering authentication, data orchestration, and integrations. | Backend Platform |
| `docs/` | Centralized documentation hub for architecture, delivery processes, and governance. | Knowledge Management |
| `home/` | Static assets for the marketing microsite used in demos. | Growth & Comms |
| `scripts/` | Automation helpers for documentation cleanup and environment setup. | Developer Experience |
| `start.sh` | Helper script to boot backend and frontend services together. | Developer Experience |

## Frontend (`frontend/`)

```
frontend/
 ┣ src/
 ┃ ┣ components/        # Shared UI widgets (Radix UI + shadcn)
 ┃ ┣ contexts/          # React context providers (auth, language, theme)
 ┃ ┣ hooks/             # Custom hooks and TanStack Query bindings
 ┃ ┣ i18n/              # i18next configuration and locale bundles
 ┃ ┣ lib/               # API client (`api.ts`) and shared utilities
 ┃ ┣ modules/           # Feature domains (agents, campaigns, voters, etc.)
 ┃ ┣ pages/             # Route-level components (Login, Dashboard, etc.)
 ┃ ┗ App.tsx            # Application shell with router and providers
 ┣ public/
 ┣ package.json
 ┗ vite.config.ts
```

## Frontend Rewrite (`frontend-new/`)

The `frontend-new/` workspace tracks the audit-driven restructure. Keep the following baseline so the AI-assisted inspection report remains accurate.

```
frontend-new/
 ┣ src/
 ┃ ┣ app/
 ┃ ┣ components/
 ┃ ┣ features/
 ┃ ┣ layouts/
 ┃ ┣ hooks/
 ┃ ┣ utils/
 ┃ ┣ assets/
 ┃ ┗ styles/
 ┣ tests/
 ┣ public/
 ┣ package.json
 ┗ vite.config.ts
```

> See [`docs/frontend-analysis.md`](../frontend-analysis.md) for the inspection command that validates this layout.

## Backend (`backend/`)

```
backend/
 ┣ app/
 ┃ ┣ Http/Controllers/
 ┃ ┣ Models/
 ┃ ┗ Policies/
 ┣ database/
 ┃ ┣ migrations/
 ┃ ┗ seeders/
 ┣ routes/
 ┃ ┣ api.php
 ┃ ┗ web.php
 ┣ composer.json
 ┗ artisan
```

## Documentation (`docs/`)

```
docs/
 ┣ architecture/
 ┣ backend/
 ┣ frontend/
 ┣ governance/
 ┣ legacy/
 ┣ project/
 ┣ shared/
 ┣ Documentation_Audit_Report.md
 ┣ README.md
 ┗ _index.yaml
```

All Markdown or YAML files under `docs/` must include the governance metadata header defined in [`governance/documentation-policy.md`](../governance/documentation-policy.md).

## Static Site (`home/`)

```
home/
 ┗ html/
    ┣ assets/
    ┣ css/
    ┗ index.html
```

## Automation (`scripts/`)

```
scripts/
 ┣ clean_docs.sh   # Strips trailing whitespace and duplicate blank lines in docs/
 ┗ setup_env.sh    # Prepares local dev dependencies
```

## Maintenance Tips

1. Run `scripts/clean_docs.sh` before committing large documentation changes.
2. Record any directory additions or removals in `docs/Documentation_Audit_Report.md` during audits.
3. Update this guide whenever a new top-level workspace is introduced.
4. Mirror structural updates in `_index.yaml` to keep the documentation index synchronized.
