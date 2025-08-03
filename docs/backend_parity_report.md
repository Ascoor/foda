# Backend Parity & Gap Report

This document compares the legacy CodeIgniter controllers against the new Laravel API and lists missing endpoints or business logic. For each gap, example Laravel implementations and route definitions are provided.

## Area Module
**Legacy methods:** `index`, `addNewView`, `addNew`, `getArea`, `editArea`, `editAreaByJason`, `delete`

**Laravel endpoints:**
- `GET /api/v1/areas`
- `POST /api/v1/areas`
- `GET /api/v1/areas/{id}`
- `PUT /api/v1/areas/{id}`
- `DELETE /api/v1/areas/{id}`

**Missing parity:**
- AJAX helper `editAreaByJason`
- Data‑table filtering used by `getArea`

**Example implementation:**
```php
// routes/api.php
Route::get('areas/{area}/edit', [AreaController::class, 'edit']);

// app/Http/Controllers/Api/V1/AreaController.php
public function edit(Area $area)
{
    return new AreaResource($area);
}

// optional filtering inside index()
public function index(Request $request)
{
    $query = Area::query();
    if ($request->filled('name')) {
        $query->where('name', 'like', "%{$request->name}%");
    }
    return AreaResource::collection($query->paginate());
}
```

**Checklist:**
- [ ] Add `GET /api/v1/areas/{id}/edit`
- [ ] Support query filtering for listing

## Authentication Module
**Legacy methods:** `login`, `logout`, `change_password`, `forgot_password`, `reset_password`, `activate`, `deactivate`, `create_user`, `edit_user`, `create_group`, `edit_group`

**Laravel endpoints:**
- `POST /api/v1/login`
- `POST /api/v1/logout`
- `POST /api/v1/register`
- `GET /api/v1/profile`
- `PUT /api/v1/profile`

**Missing parity:**
- Password reset & change flows
- Account activation/deactivation
- User & group management endpoints

**Example implementation:**
```php
// routes/api.php
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);
Route::put('password', [AuthController::class, 'changePassword']);

// app/Http/Controllers/Api/V1/AuthController.php
use Illuminate\Support\Facades\Password;

public function forgotPassword(Request $request)
{
    $request->validate(['email' => 'required|email']);
    $status = Password::sendResetLink($request->only('email'));
    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => __($status)])
        : response()->json(['message' => __($status)], 422);
}

public function resetPassword(Request $request)
{
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);
    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        fn($user, $password) => $user->forceFill([
            'password' => Hash::make($password),
        ])->save()
    );
    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => __($status)])
        : response()->json(['message' => __($status)], 422);
}

public function changePassword(Request $request)
{
    $data = $request->validate([
        'current_password' => 'required',
        'password' => 'required|min:8|confirmed',
    ]);
    $user = $request->user();
    if (!Hash::check($data['current_password'], $user->password)) {
        return response()->json(['message' => 'Current password incorrect'], 422);
    }
    $user->update(['password' => Hash::make($data['password'])]);
    return response()->json(['message' => 'Password updated']);
}
```

**Checklist:**
- [ ] Implement password reset flow
- [ ] Implement change password endpoint
- [ ] Add activation/deactivation & group management if required

## Finance Module
**Legacy methods:** `index`, `expense`, `addExpenseView`, `addExpense`, `editExpense`, `editExpenseByJason`, `deleteExpense`, `expenseCategory`, `addExpenseCategoryView`, `addExpenseCategory`, `editExpenseCategory`, `editExpenseCategoryByJason`, `deleteExpenseCategory`, `financialReport`

**Laravel endpoints:**
- `GET /api/v1/finances`
- `POST /api/v1/finances`
- `GET /api/v1/finances/{id}`
- `PUT /api/v1/finances/{id}`
- `DELETE /api/v1/finances/{id}`

**Missing parity:**
- Separate expense categories CRUD
- Financial report generation

**Example implementation:**
```php
// routes/api.php
Route::apiResource('expense-categories', ExpenseCategoryController::class);
Route::get('finances/report', [FinanceController::class, 'report']);

// app/Http/Controllers/Api/V1/ExpenseCategoryController.php
class ExpenseCategoryController extends Controller
{
    public function index() { return ExpenseCategoryResource::collection(ExpenseCategory::all()); }
    public function store(StoreExpenseCategoryRequest $request) {
        return (new ExpenseCategoryResource(ExpenseCategory::create($request->validated())))->response()->setStatusCode(201);
    }
    public function update(UpdateExpenseCategoryRequest $request, ExpenseCategory $category) {
        $category->update($request->validated());
        return new ExpenseCategoryResource($category);
    }
    public function destroy(ExpenseCategory $category) { $category->delete(); return response()->noContent(); }
}

// app/Http/Controllers/Api/V1/FinanceController.php
public function report(Request $request)
{
    $records = Finance::query()
        ->when($request->filled('from'), fn($q) => $q->whereDate('date', '>=', $request->from))
        ->when($request->filled('to'), fn($q) => $q->whereDate('date', '<=', $request->to))
        ->get();
    return FinanceReportResource::collection($records);
}
```

**Checklist:**
- [ ] Add expense category model, migration, controller & requests
- [ ] Implement financial reporting endpoint

## SMS Module
**Legacy methods:** `index`, `sendView`, `settings`, `addNewSettings`, `sendVoter`, `sendVoterAreaWise`, `sendVolunteer`, `sendVolunteerAreaWise`, `sendSmsToSpecificVolunteer`, `sendSmsTeamWise`, `sendAllTeam`, `send`, `sent`

**Laravel endpoints:**
- `GET /api/v1/sms`
- `POST /api/v1/sms`
- `GET /api/v1/sms/{id}`
- `PUT /api/v1/sms/{id}`
- `DELETE /api/v1/sms/{id}`

**Missing parity:**
- SMS settings CRUD
- Targeted send helpers (by voter group, area, team, etc.)

**Example implementation:**
```php
// routes/api.php
Route::get('sms/settings', [SmsController::class, 'settings']);
Route::put('sms/settings', [SmsController::class, 'updateSettings']);
Route::post('sms/send-group', [SmsController::class, 'sendToGroup']);

// app/Http/Controllers/Api/V1/SmsController.php
public function settings() { return new SmsSettingResource(SmsSetting::first()); }
public function updateSettings(UpdateSmsSettingRequest $request) {
    $setting = SmsSetting::firstOrFail();
    $setting->update($request->validated());
    return new SmsSettingResource($setting);
}
public function sendToGroup(SendGroupSmsRequest $request, SmsService $service)
{
    $recipients = match($request->group) {
        'voters' => Voter::whereIn('area_id', $request->area_ids)->pluck('phone'),
        'volunteers' => Volunteer::whereIn('area_id', $request->area_ids)->pluck('phone'),
        default => collect(),
    };
    $service->sendBulk($recipients, $request->message);
    return response()->json(['message' => 'SMS sent']);
}
```

**Checklist:**
- [ ] Implement SMS settings model & endpoints
- [ ] Implement group/area/team targeted SMS helper

## Home Module
**Legacy methods:** `index`, `permission`

**Laravel endpoints:**
- `GET /api/v1/home`
- `GET /api/v1/home/heatmap`

**Missing parity:**
- Permission warning endpoint

**Example implementation:**
```php
// routes/api.php
Route::get('home/permission', [HomeController::class, 'permission']);

// app/Http/Controllers/Api/V1/HomeController.php
public function permission(): JsonResponse
{
    return response()->json(['message' => 'You do not have permission to access this resource'], 403);
}
```

**Checklist:**
- [ ] Add permission endpoint if frontend still expects it

## Other Modules
- **Profile, Settings, Swot, Event, Team, Volunteer, Voter:** existing Laravel endpoints cover legacy functionality. `SwotController@report`, `TeamController@assignVolunteers`, `VoterController@import/export` are new features without direct legacy counterparts.

---

### Summary Checklist
- [ ] Implement Area AJAX edit & filtering
- [ ] Add Auth password reset/change endpoints
- [ ] Create Finance expense-category & report endpoints
- [ ] Add SMS settings and group send endpoints
- [ ] Add Home permission endpoint if required
- [ ] Review new endpoints without legacy equivalents (`events/upcoming`, `swots/report`, etc.)
