# Legacy System Inventory

This document provides an overview of the legacy CodeIgniter application archived under `/old`.

## Core Modules
The application is organised into the following modules located in `old/application/modules`:

- **Area** (`area`)
- **Authentication & Authorization** (`auth`)
- **Events** (`event`)
- **Finance** (`finance`)
- **Home** (`home`)
- **Profile** (`profile`)
- **Settings** (`settings`)
- **SMS Integration** (`sms`)
- **SWOT (SNW)** (`snw`)
- **Teams** (`team`)
- **Volunteers** (`volunteer`)
- **Voters** (`voter`)

Each module follows a typical CRUD structure with controllers, models and views to create, read, update and delete records. Validation is handled through CodeIgniter's `form_validation` library.

## Authentication and Roles
User authentication and role-based access control are implemented via the [Ion_auth](https://github.com/benedmunds/CodeIgniter-Ion-Auth) library. Controllers load the `Ion_auth` library to ensure users are logged in and belong to the required roles before executing any module actions.

All requests enter the system through the `auth` module. Modules typically redirect unauthenticated users to `auth/login` and check group membership using `$this->ion_auth->in_group()`.

## SMS Integration
Mass messaging is handled through the Clickatell API. The `sms` module sends requests to Clickatell's HTTP endpoint using `file_get_contents` to deliver messages.

## Third‑Party Libraries and Dependencies
- **Ion_auth** for authentication and authorization
- **Clickatell HTTP API** for SMS delivery

## Notes
The legacy CodeIgniter project is preserved intact inside the `/old` directory for future reference and migration work.
