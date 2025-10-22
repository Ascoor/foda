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
 ┣ vite.config.ts
 ┗ README.md
```

Use this structure as a reference when reorganizing the codebase after reviewing the generated report.
