# Legacy Module Migration Prompts

The following prompts help developers migrate each module from the legacy CodeIgniter application (located under `/old`) to the new stack (Laravel API + Vite/React frontend).

Each module includes:

1. **Mapping Table**
2. **Backend Migration Checklist**
3. **Frontend Migration Checklist**
4. **Gap Analysis / Notes**
5. **Test / Verification Checklist**

---

## Module: Area (/modules/area)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/area` | `area.php/index` | `area_model` | `area` | `area.php` | `GET /api/v1/areas` | `AreaListPage` |
| `/area/addNew` | `area.php/addNew` | `area_model` | `area` | `add_new.php` | `POST /api/v1/areas` | `AreaCreateForm` |
| `/area/editArea` | `area.php/editArea` | `area_model` | `area` | `add_new.php` | `PUT /api/v1/areas/{id}` | `AreaEditForm` |
| `/area/delete` | `area.php/delete` | `area_model` | `area` | `area.php` | `DELETE /api/v1/areas/{id}` | `AreaListPage` |
| `/area/editAreaByJason` | `area.php/editAreaByJason` | `area_model` | `area` | `N/A (JSON)` | `GET /api/v1/areas/{id}` | `AreaDetailPage` |

### 2. Backend Migration Checklist
- [ ] All endpoints implemented: list, create, edit, delete, details
- [ ] Business logic and validation rules migrated
- [ ] Permissions/auth preserved (admin only)
- [ ] Old model methods mapped to new services/controllers
- [ ] Data returned in correct format (JSON, status codes, errors)

### 3. Frontend Migration Checklist
- [ ] All required pages/components created (list, create, edit, details)
- [ ] Forms mapped to correct API endpoints
- [ ] UI behaviors (modals, validation, notifications) matched with old app
- [ ] Error/success handling implemented
- [ ] State management for lists, edits, deletions tested

### 4. Gap Analysis / Notes
- Verify JSON helper endpoints (`editAreaByJason`) are still required or can be merged into REST handlers.

### 5. Test / Verification Checklist
- [ ] CRUD flows (create, read, update, delete) tested end-to-end
- [ ] Permission checks verified
- [ ] API returns correct errors on invalid input
- [ ] UI matches legacy functionality
- [ ] No regression from old app features

---

## Module: Authentication & Authorization (/modules/auth)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/auth` | `auth.php/index` | `ion_auth_model` | `users`, `groups`, `users_groups` | `login.php` | `GET /api/v1/auth/status` | `AuthStatusGate` |
| `/auth/login` | `auth.php/login` | `ion_auth_model` | `users` | `login.php` | `POST /api/v1/auth/login` | `LoginPage` |
| `/auth/logout` | `auth.php/logout` | `ion_auth_model` | `users` | `N/A` | `POST /api/v1/auth/logout` | `LogoutButton` |
| `/auth/change_password` | `auth.php/change_password` | `ion_auth_model` | `users` | `change_password.php` | `PUT /api/v1/auth/password` | `ChangePasswordForm` |
| `/auth/forgot_password` | `auth.php/forgot_password` | `ion_auth_model` | `users` | `forgot_password.php` | `POST /api/v1/auth/forgot-password` | `ForgotPasswordForm` |
| `/auth/activate` | `auth.php/activate` | `ion_auth_model` | `users` | `N/A` | `POST /api/v1/auth/activate` | `UserActivationAction` |
| `/auth/deactivate` | `auth.php/deactivate` | `ion_auth_model` | `users` | `N/A` | `POST /api/v1/auth/deactivate` | `UserDeactivationAction` |
| `/auth/create_user` | `auth.php/create_user` | `ion_auth_model` | `users` | `create_user.php` | `POST /api/v1/users` | `UserCreateForm` |
| `/auth/edit_user` | `auth.php/edit_user` | `ion_auth_model` | `users` | `edit_user.php` | `PUT /api/v1/users/{id}` | `UserEditForm` |
| `/auth/create_group` | `auth.php/create_group` | `ion_auth_model` | `groups` | `create_group.php` | `POST /api/v1/groups` | `GroupCreateForm` |
| `/auth/edit_group` | `auth.php/edit_group` | `ion_auth_model` | `groups` | `edit_group.php` | `PUT /api/v1/groups/{id}` | `GroupEditForm` |

### 2. Backend Migration Checklist
- [ ] All authentication endpoints (login, logout, password management) implemented
- [ ] User and group CRUD endpoints implemented
- [ ] Password hashing and token handling aligned with new stack
- [ ] Role/permission checks migrated using Laravel policies or middleware
- [ ] Errors use standardized JSON responses

### 3. Frontend Migration Checklist
- [ ] Login, password reset, and profile screens integrated with API
- [ ] Session/token handling integrated with React state
- [ ] Protected routes redirect unauthenticated users
- [ ] UI messaging for auth errors and success states implemented
- [ ] Admin pages for user/group management accessible only to authorized users

### 4. Gap Analysis / Notes
- Consider consolidating group management into dedicated admin services.
- Evaluate whether account activation flows remain necessary in the new system.

### 5. Test / Verification Checklist
- [ ] Authentication flows tested (login/logout/password)
- [ ] User/group CRUD tested with permission checks
- [ ] API returns proper errors for invalid credentials
- [ ] Frontend routes guard against unauthorized access
- [ ] Regression tests cover session/token handling

---

## Module: Events (/modules/event)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/event` | `event.php/index` | `event_model`, `area_model` | `event` | `event.php` | `GET /api/v1/events` | `EventListPage` |
| `/event/addNew` | `event.php/addNew` | `event_model` | `event` | `add_new.php` | `POST /api/v1/events` | `EventCreateForm` |
| `/event/editEvent` | `event.php/editEvent` | `event_model` | `event` | `add_new.php` | `PUT /api/v1/events/{id}` | `EventEditForm` |
| `/event/eventDetails` | `event.php/eventDetails` | `event_model` | `event` | `details.php` | `GET /api/v1/events/{id}` | `EventDetailPage` |
| `/event/delete` | `event.php/delete` | `event_model` | `event` | `event.php` | `DELETE /api/v1/events/{id}` | `EventListPage` |
| `/event/editEventByJason` | `event.php/editEventByJason` | `event_model` | `event` | `N/A` | `GET /api/v1/events/{id}` | `EventEditForm` |

### 2. Backend Migration Checklist
- [ ] Endpoints for event list, create, update, delete, details implemented
- [ ] Validation for organiser, location, date, etc. migrated
- [ ] Permissions for allowed roles replicated
- [ ] Event-area relationships handled in new schema
- [ ] JSON responses include related area info

### 3. Frontend Migration Checklist
- [ ] Event listing with filters by area
- [ ] Create/edit forms capture all legacy fields
- [ ] Detail view displays full event information
- [ ] Notifications for add/update/delete actions
- [ ] Pagination or infinite scroll tested

### 4. Gap Analysis / Notes
- Assess whether `editEventByJason` is still needed as a separate endpoint.

### 5. Test / Verification Checklist
- [ ] Event CRUD tested end-to-end
- [ ] Role restrictions verified
- [ ] API validation errors surfaced correctly in UI
- [ ] UI mirrors legacy behaviour for guest lists and details
- [ ] Regression tests around event schedules

---

## Module: Finance (/modules/finance)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/finance/expense` | `finance.php/expense` | `finance_model`, `settings_model` | `expense` | `expense.php` | `GET /api/v1/expenses` | `ExpenseListPage` |
| `/finance/addExpense` | `finance.php/addExpense` | `finance_model` | `expense` | `add_expense_view.php` | `POST /api/v1/expenses` | `ExpenseCreateForm` |
| `/finance/editExpense` | `finance.php/editExpense` | `finance_model` | `expense` | `add_expense_view.php` | `PUT /api/v1/expenses/{id}` | `ExpenseEditForm` |
| `/finance/deleteExpense` | `finance.php/deleteExpense` | `finance_model` | `expense` | `expense.php` | `DELETE /api/v1/expenses/{id}` | `ExpenseListPage` |
| `/finance/expenseCategory` | `finance.php/expenseCategory` | `finance_model` | `expense_category` | `expense_category.php` | `GET /api/v1/expense-categories` | `ExpenseCategoryListPage` |
| `/finance/addExpenseCategory` | `finance.php/addExpenseCategory` | `finance_model` | `expense_category` | `add_expense_category.php` | `POST /api/v1/expense-categories` | `ExpenseCategoryCreateForm` |
| `/finance/editExpenseCategory` | `finance.php/editExpenseCategory` | `finance_model` | `expense_category` | `add_expense_category.php` | `PUT /api/v1/expense-categories/{id}` | `ExpenseCategoryEditForm` |
| `/finance/deleteExpenseCategory` | `finance.php/deleteExpenseCategory` | `finance_model` | `expense_category` | `expense_category.php` | `DELETE /api/v1/expense-categories/{id}` | `ExpenseCategoryListPage` |
| `/finance/financialReport` | `finance.php/financialReport` | `finance_model`, `settings_model` | `expense` | `financial_report.php` | `GET /api/v1/financial-report` | `FinancialReportPage` |

### 2. Backend Migration Checklist
- [ ] Expense and category CRUD endpoints implemented
- [ ] Financial report endpoint supports date filters
- [ ] Validation and currency formatting migrated
- [ ] Role-based access (admin/accountant) enforced
- [ ] Responses include totals and category summaries

### 3. Frontend Migration Checklist
- [ ] Expense list with category filter
- [ ] Forms for expense and category create/edit
- [ ] Report page with date range inputs and print/export options
- [ ] Error/success notifications wired to API responses
- [ ] Loading states and pagination handled

### 4. Gap Analysis / Notes
- Determine if expense categories should be seeded or user-defined only.

### 5. Test / Verification Checklist
- [ ] Expense/category CRUD tested end-to-end
- [ ] Report calculations validated
- [ ] Permission checks verified
- [ ] API validation errors displayed in forms
- [ ] Regression tests for currency handling

---

## Module: Home (/modules/home)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/home` | `home.php/index` | `home_model`, `settings_model` | `settings` | `home.php` | `GET /api/v1/dashboard` | `DashboardPage` |
| `/home/permission` | `home.php/permission` | `N/A` | `N/A` | `permission.php` | `GET /api/v1/permission` | `PermissionDeniedPage` |

### 2. Backend Migration Checklist
- [ ] Dashboard endpoint aggregates necessary summary data
- [ ] Permission endpoint or middleware returns proper HTTP codes
- [ ] Authentication required for all dashboard data
- [ ] Replace direct view loads with API JSON
- [ ] Ensure calendar or other widgets ported as needed

### 3. Frontend Migration Checklist
- [ ] Dashboard components consume new API summaries
- [ ] Unauthorized views redirect to permission page
- [ ] Loading/error states for dashboard widgets
- [ ] Calendar and stats visualizations matched to legacy
- [ ] Responsive layout verified

### 4. Gap Analysis / Notes
- Evaluate whether permission page should be replaced by client-side route guarding.

### 5. Test / Verification Checklist
- [ ] Dashboard data loads with valid auth token
- [ ] Unauthorized access returns 403/401
- [ ] UI reflects permission errors properly
- [ ] Regression tests for dashboard widgets
- [ ] No direct server-rendered views remain

---

## Module: Profile (/modules/profile)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/profile` | `profile.php/index` | `profile_model` | `users` | `profile.php` | `GET /api/v1/profile` | `ProfilePage` |
| `/profile/addNew` | `profile.php/addNew` | `profile_model` | `users` | `profile.php` | `PUT /api/v1/profile` | `ProfileEditForm` |

### 2. Backend Migration Checklist
- [ ] User profile retrieval and update endpoints implemented
- [ ] Password change integrated with auth system
- [ ] Upload handling migrated for avatars if used
- [ ] Validation and email uniqueness enforced
- [ ] Responses scoped to authenticated user

### 3. Frontend Migration Checklist
- [ ] Profile page shows current user data
- [ ] Edit form integrates with API for updates
- [ ] Input validation and error messages displayed
- [ ] Avatar upload handled with progress and preview
- [ ] Success toast after update

### 4. Gap Analysis / Notes
- Determine if admin can edit other profiles or only self.

### 5. Test / Verification Checklist
- [ ] Profile retrieval/update tested
- [ ] Password changes verified
- [ ] Unauthorized profile edits blocked
- [ ] UI matches legacy behaviour
- [ ] Regression tests for avatar upload

---

## Module: Settings (/modules/settings)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/settings` | `settings.php/index` | `settings_model` | `settings` | `settings.php` | `GET /api/v1/settings` | `SettingsPage` |
| `/settings/update` | `settings.php/update` | `settings_model` | `settings` | `settings.php` | `PUT /api/v1/settings` | `SettingsEditForm` |

### 2. Backend Migration Checklist
- [ ] Settings retrieval and update endpoints implemented
- [ ] Validation for system name, email, currency, etc.
- [ ] File upload handling for logos if required
- [ ] Admin-only access enforced
- [ ] Cache or config refresh after updates

### 3. Frontend Migration Checklist
- [ ] Settings form bound to API data
- [ ] Client-side validation for required fields
- [ ] Upload components for logo/branding
- [ ] Success/error notifications on save
- [ ] Refresh or re-fetch config after update

### 4. Gap Analysis / Notes
- Check whether purchase code fields are still needed.

### 5. Test / Verification Checklist
- [ ] Settings read/update tested
- [ ] Validation errors handled
- [ ] Admin-only access verified
- [ ] UI reflects updated config immediately
- [ ] Regression tests for logo uploads

---

## Module: SMS Integration (/modules/sms)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/sms/sendVoter` | `sms.php/sendVoter` | `N/A` | `N/A` | `sms.php` | `POST /api/v1/sms/voters` | `SmsVoterForm` |
| `/sms/sendVoterAreaWise` | `sms.php/sendVoterAreaWise` | `N/A` | `N/A` | `sms.php` | `POST /api/v1/sms/voters/area` | `SmsVoterAreaForm` |
| `/sms/sendVolunteer` | `sms.php/sendVolunteer` | `N/A` | `N/A` | `sms.php` | `POST /api/v1/sms/volunteers` | `SmsVolunteerForm` |
| `/sms/sendVolunteerAreaWise` | `sms.php/sendVolunteerAreaWise` | `N/A` | `N/A` | `sms.php` | `POST /api/v1/sms/volunteers/area` | `SmsVolunteerAreaForm` |
| `/sms/sendSmsToSpecificVolunteer` | `sms.php/sendSmsToSpecificVolunteer` | `N/A` | `N/A` | `sms.php` | `POST /api/v1/sms/volunteers/{id}` | `SmsVolunteerDetailForm` |
| `/sms/sendSmsTeamWise` | `sms.php/sendSmsTeamWise` | `N/A` | `N/A` | `sms.php` | `POST /api/v1/sms/teams/{id}` | `SmsTeamForm` |
| `/sms/sendAllTeam` | `sms.php/sendAllTeam` | `N/A` | `N/A` | `sms.php` | `POST /api/v1/sms/teams` | `SmsAllTeamsForm` |
| `/sms/send` | `sms.php/send` | `N/A` | `N/A` | `sms.php` | `POST /api/v1/sms/custom` | `SmsCustomForm` |
| `/sms/sent` | `sms.php/sent` | `N/A` | `sms` | `sent.php` | `GET /api/v1/sms/sent` | `SmsSentListPage` |

### 2. Backend Migration Checklist
- [ ] SMS service integrated (e.g., Clickatell replacement)
- [ ] Rate limiting and batching handled
- [ ] Logs stored for sent messages
- [ ] Permission checks for mass messaging
- [ ] Error handling for provider failures

### 3. Frontend Migration Checklist
- [ ] Forms for each recipient type (voter, volunteer, team)
- [ ] Area/team selectors populated from API
- [ ] Feedback on send status and failures
- [ ] Sent messages list with filters
- [ ] Prevent duplicate submissions while sending

### 4. Gap Analysis / Notes
- Decide on new SMS provider and authentication strategy.

### 5. Test / Verification Checklist
- [ ] Sending to voters/volunteers/teams verified
- [ ] Logs and delivery statuses checked
- [ ] Permission restrictions enforced
- [ ] UI handles provider errors gracefully
- [ ] Regression tests for bulk send limits

---

## Module: SWOT (SNW) (/modules/snw)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/snw` | `snw.php/index` | `snw_model`, `area_model` | `snw` | `snw.php` | `GET /api/v1/snw-items` | `SnwListPage` |
| `/snw/addNew` | `snw.php/addNew` | `snw_model` | `snw` | `add_new.php` | `POST /api/v1/snw-items` | `SnwCreateForm` |
| `/snw/editSnw` | `snw.php/editSnw` | `snw_model` | `snw` | `add_new.php` | `PUT /api/v1/snw-items/{id}` | `SnwEditForm` |
| `/snw/snwDetails` | `snw.php/snwDetails` | `snw_model` | `snw` | `details.php` | `GET /api/v1/snw-items/{id}` | `SnwDetailPage` |
| `/snw/delete` | `snw.php/delete` | `snw_model` | `snw` | `snw.php` | `DELETE /api/v1/snw-items/{id}` | `SnwListPage` |
| `/snw/editSnwByJason` | `snw.php/editSnwByJason` | `snw_model` | `snw` | `N/A` | `GET /api/v1/snw-items/{id}` | `SnwEditForm` |

### 2. Backend Migration Checklist
- [ ] CRUD endpoints for SWOT entries implemented
- [ ] Validation for type/topic/note migrated
- [ ] Area associations handled if needed
- [ ] Role permissions preserved
- [ ] JSON responses standardized

### 3. Frontend Migration Checklist
- [ ] List page categorizes strengths/weaknesses/opportunities/threats
- [ ] Create/edit forms with type selector
- [ ] Detail page shows full note
- [ ] Notifications for add/update/delete
- [ ] Filtering by area if applicable

### 4. Gap Analysis / Notes
- Confirm if donor blood bank references are still relevant.

### 5. Test / Verification Checklist
- [ ] SWOT CRUD flows tested
- [ ] Permissions enforced
- [ ] Validation errors surfaced in UI
- [ ] UI categories match legacy definitions
- [ ] Regression tests for type-based feedback messages

---

## Module: Teams (/modules/team)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/team` | `team.php/index` | `team_model`, `area_model`, `volunteer_model` | `team` | `team.php` | `GET /api/v1/teams` | `TeamListPage` |
| `/team/addNew` | `team.php/addNew` | `team_model` | `team` | `add_new.php` | `POST /api/v1/teams` | `TeamCreateForm` |
| `/team/editTeam` | `team.php/editTeam` | `team_model` | `team` | `add_new.php` | `PUT /api/v1/teams/{id}` | `TeamEditForm` |
| `/team/teamDetails` | `team.php/teamDetails` | `team_model` | `team` | `teamdetails.php` | `GET /api/v1/teams/{id}` | `TeamDetailPage` |
| `/team/addTeamMember` | `team.php/addTeamMember` | `team_model` | `team` | `teamdetails.php` | `POST /api/v1/teams/{id}/members` | `TeamMemberAddForm` |
| `/team/deleteTeamMember` | `team.php/deleteTeamMember` | `team_model` | `team` | `teamdetails.php` | `DELETE /api/v1/teams/{id}/members/{memberId}` | `TeamDetailPage` |
| `/team/delete` | `team.php/delete` | `team_model` | `team` | `team.php` | `DELETE /api/v1/teams/{id}` | `TeamListPage` |
| `/team/editTeamByJason` | `team.php/editTeamByJason` | `team_model` | `team` | `N/A` | `GET /api/v1/teams/{id}` | `TeamEditForm` |

### 2. Backend Migration Checklist
- [ ] Team CRUD endpoints implemented including member management
- [ ] Validation for name, area, members, task
- [ ] Relationship handling between teams and volunteers
- [ ] Admin-only permission enforcement
- [ ] JSON responses include member details

### 3. Frontend Migration Checklist
- [ ] List page shows team name, area, members count
- [ ] Create/edit forms with volunteer multiselect
- [ ] Detail page allows adding/removing members
- [ ] Notifications on create/update/delete
- [ ] Filters by area available

### 4. Gap Analysis / Notes
- Evaluate if team member operations should be separate microendpoints or part of team update payload.

### 5. Test / Verification Checklist
- [ ] Team CRUD and member management tested
- [ ] Validation errors surfaced in UI
- [ ] Permission restrictions verified
- [ ] UI mirrors legacy team detail flows
- [ ] Regression tests for member add/remove logic

---

## Module: Volunteers (/modules/volunteer)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/volunteer` | `volunteer.php/index` | `volunteer_model`, `area_model` | `volunteer` | `volunteer.php` | `GET /api/v1/volunteers` | `VolunteerListPage` |
| `/volunteer/addNew` | `volunteer.php/addNew` | `volunteer_model` | `volunteer` | `add_new.php` | `POST /api/v1/volunteers` | `VolunteerCreateForm` |
| `/volunteer/editVolunteer` | `volunteer.php/editVolunteer` | `volunteer_model` | `volunteer` | `add_new.php` | `PUT /api/v1/volunteers/{id}` | `VolunteerEditForm` |
| `/volunteer/delete` | `volunteer.php/delete` | `volunteer_model` | `volunteer` | `volunteer.php` | `DELETE /api/v1/volunteers/{id}` | `VolunteerListPage` |
| `/volunteer/editVolunteerByJason` | `volunteer.php/editVolunteerByJason` | `volunteer_model` | `volunteer` | `N/A` | `GET /api/v1/volunteers/{id}` | `VolunteerEditForm` |

### 2. Backend Migration Checklist
- [ ] Volunteer CRUD endpoints implemented
- [ ] File uploads for avatars handled and stored
- [ ] Creation registers user accounts with appropriate roles
- [ ] Validation for name, email, phone, area, profile
- [ ] Deleting volunteer removes linked user and image

### 3. Frontend Migration Checklist
- [ ] List with search/filter by area
- [ ] Create/edit forms with image upload and validation
- [ ] Success/error notifications integrated
- [ ] Delete confirmation dialogs
- [ ] Pagination or infinite scroll tested

### 4. Gap Analysis / Notes
- Determine if volunteers should manage own accounts or be admin-only operations.

### 5. Test / Verification Checklist
- [ ] Volunteer CRUD tested end-to-end
- [ ] Upload validation and storage verified
- [ ] Permission checks enforced
- [ ] UI matches legacy flows for volunteer management
- [ ] Regression tests for user-volunteer linkage

---

## Module: Voters (/modules/voter)

### 1. Mapping Table
| Old Route | Controller/Method | Model(s) | Table(s) | Old View(s) | New API Endpoint(s) | Frontend Page/Component(s) |
|-----------|-------------------|----------|----------|-------------|----------------------|-----------------------------|
| `/voter` | `voter.php/index` | `voter_model`, `area_model` | `voter` | `voter.php` | `GET /api/v1/voters` | `VoterListPage` |
| `/voter/addNew` | `voter.php/addNew` | `voter_model` | `voter` | `add_new.php` | `POST /api/v1/voters` | `VoterCreateForm` |
| `/voter/editVoter` | `voter.php/editVoter` | `voter_model` | `voter` | `add_new.php` | `PUT /api/v1/voters/{id}` | `VoterEditForm` |
| `/voter/voterDetails` | `voter.php/voterDetails` | `voter_model` | `voter` | `details.php` | `GET /api/v1/voters/{id}` | `VoterDetailPage` |
| `/voter/delete` | `voter.php/delete` | `voter_model` | `voter` | `voter.php` | `DELETE /api/v1/voters/{id}` | `VoterListPage` |
| `/voter/editVoterByJason` | `voter.php/editVoterByJason` | `voter_model` | `voter` | `N/A` | `GET /api/v1/voters/{id}` | `VoterEditForm` |

### 2. Backend Migration Checklist
- [ ] Voter CRUD endpoints implemented
- [ ] Uploads and user account linkage handled
- [ ] Validation for voter ID, area, blood group, etc.
- [ ] Role-based access controls for multiple groups
- [ ] Deleting voter removes linked user and image

### 3. Frontend Migration Checklist
- [ ] List view with filters (area, blood group)
- [ ] Create/edit forms with image upload
- [ ] Detail page displays profile data
- [ ] Confirmation dialogs for deletes
- [ ] Pagination or search available

### 4. Gap Analysis / Notes
- Decide if voter accounts require login credentials in new system.

### 5. Test / Verification Checklist
- [ ] Voter CRUD flows tested
- [ ] Upload/attachment handling verified
- [ ] Permissions enforced for different roles
- [ ] API validation errors surfaced in UI
- [ ] Regression tests for user-voter linkage

---

