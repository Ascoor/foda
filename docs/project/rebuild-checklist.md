---
title: "Repository Rebuild Checklist"
author: "Knowledge Management"
last_updated: "2024-05-20"
version: "v1.0"
status: "Active"
---

# Repository Rebuild Checklist

Use this checklist when reorganizing the Elections360 repository or recovering from a structural drift. It combines documentation, code, and automation touchpoints so the rebuild stays consistent across teams.

## 1. Preparation

- [ ] Confirm backups of `frontend/`, `frontend-new/`, and `backend/` have been archived.
- [ ] Review [`project/folder-structure.md`](folder-structure.md) to understand the target layout.
- [ ] Run `scripts/clean_docs.sh` to normalize Markdown formatting before moving files.
- [ ] Export the current dependency graph (e.g., `npm ls`, `composer show`) for post-migration verification.

## 2. Frontend Alignment

- [ ] Audit `frontend/` for obsolete feature modules and move deprecated assets into `docs/legacy/` if documentation is required.
- [ ] Sync shared utilities between `frontend/` and `frontend-new/` to avoid drift.
- [ ] Update `frontend/package.json` and `frontend/vite.config.ts` paths if directories are renamed.
- [ ] Re-run lint and build commands (`npm run lint`, `npm run build`) to ensure imports resolve after the move.

## 3. Backend Alignment

- [ ] Validate PSR-4 namespaces in `backend/composer.json` reflect any new folder names.
- [ ] Regenerate optimized autoload files via `composer dump-autoload`.
- [ ] Check Laravel config caches (`php artisan config:clear`) when moving environment-specific files.
- [ ] Verify that route definitions in `routes/api.php` and `routes/web.php` still reference existing controllers.

## 4. Documentation Sync

- [ ] Update `docs/README.md` navigation to include any new or renamed sections.
- [ ] Add or adjust entries in `_index.yaml` so automation can crawl the updated tree.
- [ ] Document removed files in `Removed_Docs_Log.md` with reasons and replacement paths.
- [ ] Capture migration notes and assignment owners in `Documentation_Audit_Report.md`.

## 5. Automation & Scripts

- [ ] Review `scripts/` for path-specific logic (e.g., CLI wrappers, cleanup tasks) and update references.
- [ ] If new scripts are introduced, provide metadata headers or inline comments describing usage.
- [ ] Test `start.sh` to confirm both frontend and backend launch from their new locations.

## 6. Validation

- [ ] Run the full CI pipeline or local equivalent to confirm tests, builds, and linters pass.
- [ ] Perform a smoke test of core flows: authentication, dashboard load, and campaign management.
- [ ] Ensure documentation metadata headers reflect the new update date.
- [ ] Share a summary of the rebuild in the team channel, linking to pull requests and updated docs.

## 7. Post-Migration Tasks

- [ ] Schedule a retrospective to capture lessons learned.
- [ ] Update onboarding materials to reference the new structure.
- [ ] Tag the repository with a release or milestone once verification is complete.
- [ ] Plan the next documentation audit to keep the structure aligned.
