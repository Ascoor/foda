# Unified Delivery Plan — FODA Election Management Platform

> **آخر تحديث / Last Updated:** 2025-10-10  
> **Prepared by:** mrask (Delivery Oversight)

This document consolidates the previously separate FODA roadmap, progress report, and execution checklist into a single living plan. It balances Arabic and English context so that technical and delivery stakeholders can share the same source of truth.

---

## 1. Executive Summary / الملخص التنفيذي
- **Overall Progress:** ~46% of the five-phase delivery program is complete. Stage 3 (analytics & intelligence) is leading, while Stage 2 (dynamic maps & live operations) is the critical blocker.
- **Immediate Focus:** finish the real data pipeline for geo maps, ship the forgotten password and session hardening flows, and unlock the live reporting channel.
- **Risks to Track:** reliance on mock map data, absence of CI/CD, and missing security hardening.

---

## 2. Phase Progress Snapshot / حالة المراحل الحالية

| Phase | Description | Completion | Status | Key Notes |
|-------|-------------|------------|--------|-----------|
| Phase 1 | Foundations & platform setup | **85%** | Near complete | Laravel API, Sanctum auth, and the React shell are stable; security hardening remains. |
| Phase 2 | Dynamic operations & mapping | **35%** | Behind schedule | RBAC is wired, but maps still use mock data and live reports are missing. |
| Phase 3 | Analytics & field intelligence | **80%** | Advanced | Analytics dashboards, notifications, and activities timeline are live; strategic PDF/Excel reports pending. |
| Phase 4 | Professional release capabilities | **15%** | Initial | CSV exports exist; mobile app, AI insights, and user admin are not started. |
| Phase 5 | Performance, QA, and release | **15%** | Initial | Lazy loading and caching partially enabled; CI/CD and security audits outstanding. |

> **Methodology:** ratios are derived from sub-task states (done = 1, in progress = 0.5, pending = 0).

---

## 3. Phase Detail / تفاصيل كل مرحلة

### Phase 1 — Foundations & Architecture (Weeks 1–8)
- ✅ **Completed:**
  - Laravel backend with Sanctum and Spatie Permission for roles.
  - React + TypeScript frontend with Tailwind/shadcn design system and shared contexts.
  - Unified error/loading UX via `SafeDataRenderer` and logging services.
  - REST APIs shipping for core entities (agents, activities, analytics, …).
- ⚠️ **Improving:** strengthen authentication (rate limiting, session monitoring) and extend frontend caching beyond analytics.
- ⏳ **Remaining:** security alerting (account lockouts, audit reviews).

### Phase 2 — Dynamic Operations & Mapping (Weeks 9–14)
- ✅ **Completed:** RBAC wired end-to-end (backend middleware + dynamic sidebar), improved login UX with localized error states.
- ⚠️ **In Progress:** UX polish across map/report surfaces, theme/RTL support in place but visuals need refinement.
- ⏳ **Remaining:** connect Leaflet map to real `/ec/geo-areas` data with live refresh, build Forgot/Reset password flow, and introduce live reports over WebSockets/Pusher.

### Phase 3 — Analytics & Intelligence (Weeks 15–20)
- ✅ **Completed:** analytics module with cached metrics, activities timeline with pagination/export, live notification center with Echo hooks, and full Arabic/English i18n coverage.
- ⏳ **Remaining:** ship strategic reporting exports (PDF/Excel) across backend + frontend.

### Phase 4 — Professional Release (Weeks 21–28)
- ✅ **Completed:** early CSV export for geographic datasets.
- ⚠️ **Preparing:** groundwork for mobile field app, AI insights, and advanced user administration.
- ⏳ **Remaining:** deliver mobile client (React Native), intelligence engine, and management console enhancements.

### Phase 5 — Hardening & Go-Live (Weeks 29–34)
- ✅ **Completed:** lazy loading (`React.lazy`) on heavy modules, API caching on client/server, initial frontend test suite (Vitest + Testing Library for dashboard).
- ⏳ **Remaining:** CI/CD workflows, comprehensive security testing (E2E, scanning), performance optimisations for media and Redis caching.

---

## 4. Timeline & Milestones / الجدول الزمني

| Weeks | Phase | Milestone | Status |
|-------|-------|-----------|--------|
| 9–10 | Phase 2 | Real data-powered geo maps | ⏳ Delayed |
| 11–12 | Phase 2 | Forgotten password + session hardening | ⏳ Delayed |
| 13–14 | Phase 2 | Live reporting channel & UX polish | ⏳ Delayed |
| 15–18 | Phase 3 | Analytics dashboards + notifications | ✅ Delivered |
| 19–20 | Phase 3 | Strategic PDF/Excel reports | ⏳ Pending |
| 21–24 | Phase 4 | Mobile app & AI insights foundations | ⏳ Not started |
| 25–28 | Phase 4 | Advanced export & user admin | ⏳ Not started |
| 29–34 | Phase 5 | Performance, security, CI/CD | ⚠️ Partially started |

---

## 5. Key Performance Indicators / مؤشرات الأداء الرئيسية

### Phase 2
- [ ] Geo map connected to `/ec/geo-areas` (0% — mock data still in use).
- [ ] Full authentication lifecycle (Forgot/Reset + session protection) (40% — UI present, backend routes missing).
- [ ] Role-based access end-to-end (80% — enforcement active, admin UX outstanding).
- [ ] Live reports under 15s latency (0% — channel not implemented).

### Phase 3
- [x] Interactive analytics dashboard with live metrics (100%).
- [ ] Strategic export suite (0%).
- [x] Activities management with alerts & pagination (100%).
- [x] Real-time notification centre with filters (100%).

### Phase 5
- [ ] 50% performance uplift (15% — caching/lazy loading partially adopted).
- [ ] 100% automated test coverage (20% — unit tests only).
- [ ] Operational CI/CD workflow (0%).
- [ ] Security hardening roadmap executed (10% — Sanctum + RBAC only).

---

## 6. Risks & Mitigations / المخاطر والحلول

| Risk | Impact | Priority | Mitigation |
|------|--------|----------|------------|
| Reliance on mock geo data | Blocks field coverage visibility | High | Finish `/ec/geo-areas` integration and swap map data source within the sprint. |
| Missing live reporting channel | Limits election-day situational awareness | High | Design Laravel Echo channel + WebSocket client as part of Stage 2 deliverables. |
| No CI/CD workflow | Delays releases, increases human error | Medium | Ship minimal GitHub Actions (lint, build, tests) before Phase 5 hardening. |
| Limited security controls | Exposes sensitive voter data | Medium | Add rate limiting, audit logs, and schedule a dedicated security review post Stage 2 closure. |

---

## 7. Next Sprint Focus (10–17 Oct 2025)
1. Integrate geo-area API responses into the Leaflet map and validate backend data freshness.
2. Deliver Forgot/Reset password flow across frontend, Laravel routes, and transactional email stubs.
3. Prototype live reporting endpoint plus polling/WebSocket client for the dashboard.
4. Draft GitHub Actions workflow covering linting, builds, and automated tests for both stacks.
5. Catalogue the security backlog (rate limiting, audit trail, session analytics) ready for implementation.

---

## 8. References & Supporting Material / مراجع داعمة
- 📄 [Technical Audit](AUDIT_Elections360.md) — infra & code quality gaps.
- 📄 [CRUD API Review](CRUD_API_REVIEW.md) — endpoint inventory.
- 📄 [README.md](README.md) — architecture & setup (English).
- 📄 [README_AR.md](README_AR.md) — Arabic platform overview.
- 📄 [README_UNIFIED.md](README_UNIFIED.md) — bilingual deployment instructions.

> This plan supersedes the previous `FODA_PLAN.md` and `FODA_PROGRESS_REPORT.md`. All future updates should be made here to avoid fragmentation.
