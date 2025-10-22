---
title: "Frontend Audit Command Reference"
author: "Frontend Platform Team"
last_updated: "2025-10-22"
version: "v1.0"
status: "Active"
---

# Frontend Audit Command Reference

This project sometimes requires a comprehensive review of the `frontend-new` application to understand file usage, configuration health, and folder organization. When the `ai-inspect` CLI is available in your environment, you can trigger a deep scan with the following command:

```bash
npx ai-inspect frontend-new --analyze --unused --structure --config --optimize --refactor --report detailed
```

## What the command does

| Phase | Purpose | Details |
| --- | --- | --- |
| `analyze` | Reads source files | Scans directories such as `src/`, `components/`, `pages/`, `assets/`, `hooks/`, and `utils/` to map dependencies between modules. |
| `unused` | Detects unused assets | Flags components, pages, styles, and static assets that are imported but not referenced by the application. |
| `structure` | Summarizes layout | Produces a hierarchy report for key folders like `components/`, `layouts/`, `services/`, `store/`, and `theme/`. |
| `config` | Reviews configuration | Inspects project config files (`.env`, `vite.config.ts`, `tailwind.config.ts`, `package.json`, etc.) to highlight inconsistencies or unused values. |
| `optimize` | Suggests performance tweaks | Recommends strategies such as lazy loading, tree shaking, and code splitting. |
| `refactor` | Offers structural improvements | Suggests reorganizing modules and consolidating similar components or utilities. |
| `report detailed` | Generates documentation | Outputs a Markdown or HTML report that aggregates findings, unused assets, dependency graphs, and proposed folder structures. |

> **Note:** The `ai-inspect` package is not bundled with this repository. If the command fails, install or link the CLI in your environment before running the scan, or substitute your preferred auditing tool.

## Suggested project layout

Below is an example layout that the inspection report may recommend:

```
frontend-new/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── utils/
├── assets/
├── theme/
├── public/
├── tests/
├── scripts/
└── docs/
```

## Follow-up actions

- Schedule the audit as part of the quarterly documentation review cycle.
- Capture follow-up tasks from the generated report in the issue tracker.
- Share the detailed report with the frontend and platform teams for review.

## Related resources

- [Frontend Feature Guides](feature-guides.md)
- [Routing Structure](routing-structure.md)
- [UI Components](ui-components.md)
- [Documentation Audit Report](../Documentation_Audit_Report.md)
