---
title: "Routing Structure"
author: "Frontend Guild"
last_updated: "2024-05-19"
version: "v1.0"
status: "Active"
---

# Routing Structure

## Overview
The router is configured via `frontend/src/app/routes.tsx` using React Router v6's `createBrowserRouter`. Public marketing pages share a shell with protected application routes that require authentication.

## Shell Hierarchy
1. **RouterShell** wraps all routes and renders the `Outlet`.
2. **Public Paths**
   - `/` → `FloatingLandingPage`
   - `/experience` → `FloatingDashboard`
   - `/app` → `AuthRedirect` (decides between login or dashboard based on auth state)
   - `/login` → `Login`
3. **Protected Paths** (nested under `ProtectedRoute` → `MainLayoutWrapper`)
   - `/dashboard` → `EnhancedDashboard`
   - `/elections` / `/elections/:id`
   - `/geo-areas` / `/geo-areas/:id`
   - `/committees` / `/committees/:id`
   - `/voters` / `/voters/:id`
   - `/candidates` / `/candidates/:id`
   - `/agents`
   - `/volunteers`
   - `/observations`
   - `/campaigns`
   - `/automation`
   - `/analytics` (currently renders `ComingSoon`)
   - `/zones/mansoura`
   - `/settings`
   - `*` → `NotFound`
4. **Fallback**
   - Root-level wildcard `*` renders `NotFound` for unmatched marketing routes.

## Navigation Patterns
- Authentication context stored in `AuthContext` controls access to protected branches.
- Layout wrappers provide global navigation, breadcrumb scaffolding, and language toggles.
- Deep links rely on query parameters and URL segments; modules use `useSearchParams` for filter state persistence.

## Future Enhancements
1. Introduce route-based code splitting for heavy modules (analytics, campaigns).
2. Document route guards for role-specific modules once RBAC UI is enabled.
3. Add sitemap generation tied to the marketing routes for SEO.
4. Capture route-to-feature mapping diagrams for onboarding sessions.
