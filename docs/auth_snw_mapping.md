# Auth & SNW Migration Mapping

This document maps legacy CodeIgniter views and controllers to the new React pages and Laravel API endpoints.

## Authentication

| Legacy View / Controller | React Page / Component | API Endpoint | Status |
|--------------------------|------------------------|--------------|--------|
| `application/views/auth/login.php` | `frontend/src/pages/Login.tsx` | `POST /api/v1/login` | Migrated |
| `auth/logout` (no view) | handled via `lib/auth.logout` | `POST /api/v1/logout` | Migrated |
| `application/views/auth/forgot_password.php` | `frontend/src/pages/ForgotPassword.tsx` | `POST /api/v1/forgot-password` | New in Laravel |
| `application/views/auth/reset_password.php` | `frontend/src/pages/ResetPassword.tsx` | `POST /api/v1/reset-password` | New in Laravel |
| `auth/profile` | `frontend/src/pages/Profile.tsx` | `GET /api/v1/profile` & `PUT /api/v1/profile` | Migrated |

## SNW / SWOT

| Legacy View / Controller | React Page / Component | API Endpoint | Status |
|--------------------------|------------------------|--------------|--------|
| `modules/snw/views/snw.php` | `frontend/src/pages/Swot.tsx` | `GET /api/v1/swots` | Migrated |
| `modules/snw/views/add_new.php` | form inside `Swot.tsx` | `POST /api/v1/swots` | Migrated |
| `snw/edit` | dialog in `Swot.tsx` | `PUT /api/v1/swots/{id}` | Migrated |
| `snw/delete` | action in `Swot.tsx` | `DELETE /api/v1/swots/{id}` | Migrated |
| (no direct legacy report view) | report section in `Swot.tsx` | `GET /api/v1/swots/report` | Migrated |
| (show details) | *TODO: SwotDetails component* | `GET /api/v1/swots/{id}` | Pending |

## Outstanding TODOs

- Implement `SwotDetails` page for viewing a single record.
- Configure mail delivery for password reset emails.
- Add more comprehensive frontend tests and integrate into CI.
