<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AreaController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\FinanceController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\SmsController;
use App\Http\Controllers\Api\V1\SwotController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\VolunteerController;
use App\Http\Controllers\Api\V1\VoterController;
use App\Http\Controllers\Api\V1\PasswordController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register'])->middleware(['auth:sanctum', 'role:admin']);
    Route::post('forgot-password', [PasswordController::class, 'forgot']);
    Route::post('reset-password', [PasswordController::class, 'reset']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('profile', [AuthController::class, 'profile']);
        Route::put('profile', [AuthController::class, 'updateProfile']);

        Route::apiResource('areas', AreaController::class);
        Route::get('events/upcoming', [EventController::class, 'upcoming']);
        Route::apiResource('events', EventController::class);
        Route::apiResource('finances', FinanceController::class);
        Route::get('home', [HomeController::class, 'index']);
        Route::get('home/heatmap', [HomeController::class, 'heatmap']);
        Route::apiResource('profiles', ProfileController::class);
        Route::get('settings/key/{key}', [SettingController::class, 'getByKey']);
        Route::match(['put', 'patch'], 'settings', [SettingController::class, 'bulkUpdate']);
        Route::apiResource('settings', SettingController::class);
        Route::apiResource('sms', SmsController::class);
        Route::get('swots/report', [SwotController::class, 'report']);
        Route::apiResource('swots', SwotController::class);
        Route::apiResource('teams', TeamController::class);
        Route::post('teams/{team}/volunteers', [TeamController::class, 'assignVolunteers']);
        Route::delete('teams/{team}/volunteers/{volunteer}', [TeamController::class, 'removeVolunteer']);
        Route::apiResource('members', MemberController::class)->only(['index', 'store']);
        Route::apiResource('volunteers', VolunteerController::class);
        Route::post('voters/import', [VoterController::class, 'import']);
        Route::get('voters/export', [VoterController::class, 'export']);
        Route::apiResource('voters', VoterController::class);
    });
});

