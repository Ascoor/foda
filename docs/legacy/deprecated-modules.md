---
title: "Deprecated Modules"
author: "Knowledge Management"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Deprecated Modules & Documents

## Purpose
- Track modules and documentation that have been superseded or removed from the active knowledge base.

## Deprecated Items
| Item | Original Location | Replacement | Notes |
| --- | --- | --- | --- |
| Legacy execution plan (Arabic) | `docs/EXECUTION_PLAN_AR.md` | `docs/legacy/migration-guide.md` | Consolidated into migration guidance with bilingual summary. |
| Standalone integration docs | `docs/INTEGRATION/*.md` | `docs/shared/integrations.md` | Command references unified for easier maintenance. |
| Feature-level READMEs | `frontend/src/features/*/README.md` | `docs/frontend/feature-guides.md` | Content migrated to the feature matrix. |
| Backend domain markdown set | `backend/docs/*.md` | `docs/backend/endpoints-reference.md` | Endpoint descriptions merged into a single reference. |
| Architecture snapshot (legacy) | `docs/ARCHITECTURE.md` | `docs/architecture/system-overview.md` | Updated with current Laravel 10 + React 18 stack details. |
| Data flow notes | `docs/DATA_FLOW.md` | `docs/architecture/data-lifecycle.md` | Combined with lifecycle commands and queue notes. |

## Retirement Checklist
- Archived copies stored in version control history; no separate archive required.
- References updated in README index and audit report.
- Future requests for deprecated content should direct stakeholders to this table for context.

## Next Actions
1. Evaluate whether roadmap sections belong in active governance docs or remain legacy after next review.
2. Add migration entries when modules are sunset (e.g., analytics placeholders replaced by real dashboards).
3. Track removal approvals within `Removed_Docs_Log.md` for compliance evidence.
4. Audit translations to ensure legacy Arabic content remains accessible where needed.
