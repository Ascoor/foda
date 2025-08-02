# Legacy Frontend Blueprint

This document maps the views, forms, components, and controller actions in the legacy CodeIgniter application located in `/old`.

## Global Layout & Partials
- **Layout:** `home/dashboard.php` provides the header, navigation, and sidebar.
- **Footer:** `home/footer.php` includes closing markup and scripts.
- Most module views load these two partials for consistent layout.

## Modules & Views

### Area
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `area/views/area.php` | `/area` | dashboard, footer | Add Area (`area/addNew` → POST); Edit Area (`area/addNew` → POST via modal, data from `area/editAreaByJason`) | name (text), description (textarea), id (hidden) |
| `area/views/add_new.php` | `/area/addNewView` | dashboard, footer | Area Form (`area/addNew` → POST) | name (text), description (textarea), id (hidden) |

### Event
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `event/views/event.php` | `/event` | dashboard, footer | Add Event (`event/addNew` → POST); Edit Event (`event/addNew` → POST via modal, data from `event/editEventByJason`) | organiser, location, contact, date, subject, description, guests, id (hidden) |
| `event/views/add_new.php` | `/event/addNewView` | dashboard, footer | Event Form (`event/addNew` → POST) | area (select), organiser, location, contact, date, subject, description, guests, id (hidden) |

### Finance
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `finance/views/expense.php` | `/finance/expense` | dashboard, footer | Add Expense (`finance/addExpense` → POST); Edit Expense (`finance/addExpense` → POST via modal) | category (select), amount, id (hidden) |
| `finance/views/add_expense_view.php` | `/finance/addExpenseView` | dashboard, footer | Expense Form (`finance/addExpense` → POST) | category (select), amount, id (hidden) |
| `finance/views/expense_category.php` | `/finance/expenseCategory` | dashboard, footer | Add Category (`finance/addExpenseCategory` → POST); Edit Category (`finance/addExpenseCategory` → POST via modal) | category (text), description (text), id (hidden) |
| `finance/views/add_expense_category.php` | `/finance/addExpenseCategory` | dashboard, footer | Category Form (`finance/addExpenseCategory` → POST) | category (text), description (text), id (hidden) |
| `finance/views/financial_report.php` | `/finance/financialReport` | dashboard, footer | Date Range (`finance/financialReport` → POST) | date_from, date_to |

### Team
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `team/views/team.php` | `/team` | dashboard, footer | Add Team (`team/addNew` → POST); Edit Team (`team/addNew` → POST via modal); Add Member (`team/addTeamMember` → POST) | name, area (select), members (multi-select), task, id (hidden) |
| `team/views/add_new.php` | `/team/addNewView` | dashboard, footer | Team Form (`team/addNew` → POST) | name, area (select), members (multi-select), task, id (hidden) |
| `team/views/teamdetails.php` | `/team/teamdetails` | dashboard, footer | Add Team Member (`team/addTeamMember` → POST); Edit Team (`team/addNew` → POST via modal) | members[] (multi-select), name, area, task, id (hidden), team_id (hidden) |

### Voter
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `voter/views/voter.php` | `/voter` | dashboard, footer | Add Voter (`voter/addNew` → POST); Edit Voter (`voter/addNew` → POST via modal) | area (select), voter_id, name, email, address, phone, birthdate, bloodgroup (select), img_url (file), id (hidden), p_id (hidden) |
| `voter/views/add_new.php` | `/voter/addNewView` | dashboard, footer | Voter Form (`voter/addNew` → POST) | area (select), voter_id, name, email, address, phone, birthdate, bloodgroup (select), img_url (file), id (hidden), p_id (hidden) |

### Volunteer
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `volunteer/views/volunteer.php` | `/volunteer` | dashboard, footer | Add Volunteer (`volunteer/addNew` → POST); Edit Volunteer (`volunteer/addNew` → POST via modal); SMS (`sms/send` via buttons) | name, email, address, phone, area (select), profile, img_url (file), id (hidden), p_id (hidden) |
| `volunteer/views/add_new.php` | `/volunteer/addNewView` | dashboard, footer | Volunteer Form (`volunteer/addNew` → POST) | name, email, address, phone, area (select), profile, img_url (file), id (hidden) |

### Profile
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `profile/views/profile.php` | `/profile` | dashboard, footer | Profile Form (`profile/addNew` → POST) | name, password, email, id (hidden) |

### Settings
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `settings/views/settings.php` | `/settings` | dashboard, footer | Settings Form (`settings/update` → POST) | system name, title, address, phone, email, currency, buyer (hidden), p_code (hidden), id (hidden) |

### SMS
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `sms/views/sms.php` | `/sms` | dashboard, footer | (unused modal forms copied from Area) | name, description, id (hidden) |
| `sms/views/sendview.php` | `/sms/sendView` | dashboard, footer | Send SMS (`sms/send` → POST); Send to All Voters (`sms/sendVoter` → POST); Send to Voters by Area (`sms/sendVoterAreaWise` → POST); Send to All Volunteers (`sms/sendVolunteer` → POST); Send to Volunteers by Area (`sms/sendVolunteerAreaWise` → POST) | radio selection (allvoter/allvolunteer), message textarea, id (hidden); message textarea + optional area_id hidden for area-wise forms |
| `sms/views/settings.php` | `/sms/settings` | dashboard, footer | SMS Settings (`sms/addNewSettings` → POST) | username, password, api_id, id (hidden) |

### SNW (Campaign Analysis)
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `snw/views/snw.php` | `/snw` | dashboard, footer | Add Analysis (`snw/addNew` → POST via modal); Edit Analysis (`snw/addNew` → POST via modal) | type (hidden), topic, note, id (hidden) |
| `snw/views/add_new.php` | `/snw/addNewView` | dashboard, footer | Analysis Form (`snw/addNew` → POST) | type (select), topic, note, id (hidden) |

### Home
| View | Route | Components | Forms | Notes |
|------|-------|-----------|-------|-------|
| `home/views/home.php` | `/home` | dashboard, footer | — | dashboard with counts and links |
| `home/views/permission.php` | `/home/permission` | none | — | static access-denied page |

### Authentication (public views)
| View | Route | Components | Forms (action → method) | Fields |
|------|-------|-----------|-------------------------|--------|
| `views/auth/login.php` | `/auth/login` | none | Login (`auth/login` → POST); Forgot Password (`auth/forgot_password` → POST modal) | identity, password; email (modal) |
| `views/auth/forgot_password.php` | `/auth/forgot_password` | none | Forgot Password (`auth/forgot_password` → POST) | email |
| `views/auth/reset_password.php` | `/auth/reset_password/<code>` | none | Reset Password (`auth/reset_password/<code>` → POST) | new_password, new_password_confirm, user_id (hidden), csrf (hidden) |

## Controller Interaction
- Each module's controller loads `home/dashboard` and the module view, then `home/footer` for layout.
- Form submissions post to `addNew`/`update` methods within the respective controller.
- AJAX endpoints such as `editAreaByJason`, `editEventByJason`, `editVoterByJason` return JSON for populating edit forms.

## Data Flow Summary
User → View/Form → Controller Method → Model/DB → Redirect back to list view with flash message.

