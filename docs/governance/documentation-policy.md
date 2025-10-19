---
title: "Documentation Policy"
author: "Knowledge Management"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Documentation Governance Policy

## Purpose
- Establish mandatory standards for all Elections360 documentation assets.
- Ensure every artifact remains discoverable, versioned, and audit-ready.

## Metadata Requirements
- Every Markdown, YAML, or JSON document within `docs/` must begin with the following front matter:
  ```yaml
  ---
  title: "Document Title"
  author: "Team or Owner"
  last_updated: "YYYY-MM-DD"
  version: "v1.0"
  status: "Active"
  ---
  ```
- New documents or updates must bump the `last_updated` date and adjust `version` when semantic changes occur.
- Files lacking metadata are rejected during review and tracked in the audit log.

## Review Cadence
- Conduct a documentation audit every 90 days using `codex docs audit --path docs/`.
- Capture findings in `docs/Documentation_Audit_Report.md`, including remediation owners and due dates.
- Archive superseded documents or major rewrites under `docs/legacy` with clear deprecation notes.

## Contribution Workflow
1. Propose changes via pull request referencing affected documents and sections.
2. Run spellcheck/lint tasks (when available) and update relevant indices (`docs/_index.yaml`, README links).
3. Update `Removed_Docs_Log.md` when retiring or relocating files, including rationale.
4. Secure approval from the Documentation Steward (rotating role within Knowledge Management).

## Enforcement
- Continuous integration will fail if documents lack metadata headers or break lint rules (to be implemented).
- Quarterly review meetings assess adherence, assign backlog items, and adjust policy language as needed.

## Next Actions
1. Automate metadata validation via pre-commit hooks or CI checks.
2. Publish a reviewer checklist referencing this policy for onboarding.
3. Extend policy coverage to design assets and diagram repositories.
4. Record escalation paths for urgent documentation fixes (e.g., compliance requests).
