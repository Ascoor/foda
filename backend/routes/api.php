<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AreaController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\FinanceController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\SmsController;
use App\Http\Controllers\Api\V1\SnwController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\VolunteerController;
use App\Http\Controllers\Api\V1\VoterController;

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

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('profile', [AuthController::class, 'profile']);

        Route::apiResource('areas', AreaController::class);
        Route::get('events/upcoming', [EventController::class, 'upcoming']);
        Route::apiResource('events', EventController::class);
        Route::apiResource('finances', FinanceController::class);
        Route::apiResource('homes', HomeController::class);
        Route::apiResource('profiles', ProfileController::class);
        Route::apiResource('settings', SettingsController::class);
        Route::apiResource('sms', SmsController::class);
        Route::apiResource('snws', SnwController::class);
        Route::apiResource('teams', TeamController::class);
        Route::post('teams/{team}/volunteers', [TeamController::class, 'assignVolunteers']);
        Route::delete('teams/{team}/volunteers/{volunteer}', [TeamController::class, 'removeVolunteer']);
        Route::apiResource('volunteers', VolunteerController::class);
        Route::apiResource('voters', VoterController::class);
    });
});

