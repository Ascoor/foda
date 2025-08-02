# Legacy CodeIgniter Audit

This document provides a detailed audit of the legacy CodeIgniter application located in the `/old` directory. It covers project structure, separation of concerns, data flow and business logic, as well as code quality observations.

## 1. Project Structure

```
old/
├── .htaccess
├── Ecms_database_tables.sql         # Database schema snapshot
├── index.php                        # Front controller
├── uploads/                         # User-uploaded files
├── common/                          # Shared frontend assets (CSS, JS, images)
└── application/
    ├── config/                      # Framework and library configuration
    ├── libraries/                   # Custom libraries (Bcrypt, Ion_auth, Upload, Email)
    ├── language/                    # Internationalisation files
    ├── third_party/MX               # HMVC extensions
    ├── modules/                     # Feature modules (see below)
    ├── views/auth/                  # Authentication templates
    └── ...                          # cache, hooks, logs etc.
```

### Modules Directory
Each module follows an HMVC structure with `controllers`, `models` and `views` folders. The main modules are:

| Module | Controllers | Models | Views (UI) |
| ------ | ----------- | ------ | ---------- |
| **area** | `area.php` | `area_model.php` | `area.php`, `add_new.php` |
| **auth** | `auth.php` | – (uses Ion_auth library) | `/application/views/auth/...` |
| **event** | `event.php` | `event_model.php` | `event.php`, `add_new.php` |
| **finance** | `finance.php` | `finance_model.php` | `financial_report.php`, `expense.php`, `add_expense_view.php`, `expense_category.php`, `add_expense_category.php` |
| **home** | `home.php` | `home_model.php` | `dashboard.php`, `home.php`, `footer.php`, `permission.php` |
| **profile** | `profile.php` | `profile_model.php` | `profile.php` |
| **settings** | `settings.php` | `settings_model.php` | `settings.php` |
| **sms** | `sms.php` | `sms_model.php` | `sendview.php`, `sms.php`, `settings.php` |
| **snw** | `snw.php` | `snw_model.php` | `snw.php`, `add_new.php` |
| **team** | `team.php` | `team_model.php` | `team.php`, `teamdetails.php`, `add_new.php` |
| **volunteer** | `volunteer.php` | `volunteer_model.php` | `volunteer.php`, `add_new.php` |
| **voter** | `voter.php` | `voter_model.php` | `voter.php`, `add_new.php` |

## 2. Separation of Concerns

* **Front‑End (Views/Assets):**
  * Located under each module's `views` directory and in `common/` assets. Views mix HTML with embedded PHP for data output and frequently include inline JavaScript/jQuery and CSS references.
  * Shared layout pieces such as `home/dashboard` and `home/footer` are loaded by many controllers, creating cross‑module coupling.

* **Back‑End (Controllers/Models/Libraries):**
  * Controllers orchestrate requests, enforce authentication, perform form validation, and often call multiple models.
  * Models wrap database access using CodeIgniter's Query Builder; some controllers still perform direct `$this->db` queries instead of delegating to models.
  * Custom libraries such as `Ion_auth`, `Bcrypt`, and `Upload` handle authentication, hashing, and file uploads.

* **Cross‑Layer Dependencies:**
  * Controllers rely heavily on `Ion_auth` for login checks and role-based permissions.
  * Many controllers load views from other modules (e.g., most modules load `home/dashboard` and `home/footer`), leading to tight coupling between presentation layers across modules.
  * The `sms` controller pulls in models from `area`, `voter`, `team`, and `volunteer` modules to collect recipients before invoking the Clickatell API.

## 3. Business Logic & Data Flow

### Authentication
1. **View** `views/auth/login.php` displays login form.
2. **Controller** `auth.php` validates credentials using `form_validation` and `Ion_auth->login`.
3. On success, user data is stored in session; on failure, flash messages are set and the user is redirected back.

### Area Management (CRUD example)
1. **View** `area/add_new.php` posts to `area/addNew`.
2. **Controller** `area.php` validates input and calls `area_model` to insert or update records.
3. **Model** `area_model.php` performs database operations on the `area` table.
4. After completion, controller sets flashdata messages and redirects back to `area` index.

### Voter Registration with File Upload
1. **View** `voter/add_new.php` collects voter information and uploads a photo.
2. **Controller** `voter.php` validates input, handles file upload via the `Upload` library, registers a user in Ion_auth (using a hardcoded default password), and writes voter data through `voter_model`.
3. **Model** `voter_model.php` persists voter details and links to the Ion_auth user record.

### SMS Sending
1. **View** `sms/sendview.php` submits message and selection criteria.
2. **Controller** `sms.php` gathers recipient phone numbers through `voter_model`, `volunteer_model`, or `team_model` based on user choice.
3. SMS credentials are retrieved via `sms_model`; message dispatch uses `file_get_contents` to call Clickatell’s HTTP API.
4. Sent messages are optionally logged in the database.

### Finance/Expense Tracking
1. **Views** `finance/expense.php`, `add_expense_view.php` etc. display forms and tables.
2. **Controller** `finance.php` enforces role checks, validates input, and delegates to `finance_model`.
3. **Model** `finance_model.php` handles CRUD for expense records and categories.

## 4. Code Quality & Modularity Observations

* Controllers often contain data access logic (`$this->db->get_where`), undermining model responsibilities.
* Many forms rely on `xss_clean` in validation rules; this approach is deprecated in modern CodeIgniter versions.
* Hardcoded values are present (e.g., constant default password in `voter.php`).
* `split()` is used for filenames in `voter.php`, which is deprecated in PHP 5.3+; `explode()` should be used.
* Views intermix PHP, HTML, and JavaScript, and include inline scripts that manipulate DOM or make AJAX requests, making them difficult to maintain.
* SMS messages are concatenated directly into a query string without URL encoding, risking malformed requests or injection via crafted input.
* Some controllers reference views that are missing (e.g., `voter/voterDetails` expects a `details` view that does not exist), indicating potential maintenance issues.
* File uploads lack thorough validation and sanitisation; uploaded files are saved under `uploads/` with partially transformed names.

## 5. Recommendations

1. **Strengthen MVC Separation**
   * Move all database queries from controllers into their respective models.
   * Introduce dedicated service layers or repositories for complex workflows (e.g., SMS dispatch) to decouple controllers from multiple models.

2. **Improve Front‑End Structure**
   * Adopt a templating/layout system to avoid repeating `home/dashboard` and `home/footer` inclusions across controllers.
   * Separate inline JavaScript into external files under `common/js` and load via view templates.

3. **Enhance Security**
   * Replace deprecated `xss_clean` and `split()` functions with modern equivalents.
   * Avoid hardcoded passwords; generate secure random values and require user‑defined credentials.
   * URL‑encode SMS messages and validate phone numbers before sending.
   * Use more robust file upload handling (randomised filenames, strict MIME checking, and storage outside webroot).

4. **Modernisation**
   * Upgrade to a supported CodeIgniter or migrate to a contemporary framework (e.g., Laravel, Symfony) for long‑term maintainability.
   * Implement Composer for dependency management and adopt PSR‑4 autoloading.
   * Introduce unit and integration tests to cover critical workflows.

5. **Documentation & Clean‑up**
   * Document each module’s API and database schema.
   * Remove unused code and ensure all referenced views and assets exist.

This audit should serve as a foundation for refactoring and gradual migration away from the legacy structure while preserving business functionality.

