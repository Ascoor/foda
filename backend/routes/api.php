<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AreaController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\FinanceController;
use App\Http\Controllers\Api\V1\ExpenseCategoryController;
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
use App\Http\Controllers\ElectionCircle\ElectionController as ECElectionController;
use App\Http\Controllers\ElectionCircle\GeoAreaController as ECGeoAreaController;
use App\Http\Controllers\ElectionCircle\CommitteeController as ECCommitteeController;
use App\Http\Controllers\ElectionCircle\CandidateController as ECCandidateController;
use App\Http\Controllers\ElectionCircle\VoterController as ECVoterController;
use App\Http\Controllers\ElectionCircle\AgentController as ECAgentController;
use App\Http\Controllers\ElectionCircle\VolunteerController as ECVolunteerController;
use App\Http\Controllers\ElectionCircle\ObservationController as ECObservationController;
use App\Http\Controllers\ElectionCircle\CampaignController as ECCampaignController;
use App\Http\Controllers\ElectionCircle\SettingController as ECSettingController;

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
        Route::get('me', [AuthController::class, 'me']);
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::post('profile/avatar', [ProfileController::class, 'updateAvatar']);
        Route::patch('profile/password', [ProfileController::class, 'updatePassword']);

        Route::apiResource('areas', AreaController::class);
        Route::get('events/upcoming', [EventController::class, 'upcoming']);
        Route::apiResource('events', EventController::class);
        Route::get('finances/report', [FinanceController::class, 'report']);
        Route::apiResource('finances', FinanceController::class);
        Route::apiResource('expense-categories', ExpenseCategoryController::class);
        Route::get('home', [HomeController::class, 'index']);
        // Alias for frontend expecting /dashboard
        Route::get('dashboard', [HomeController::class, 'index']);
        Route::get('home/heatmap', [HomeController::class, 'heatmap']);
        Route::get('settings/key/{key}', [SettingController::class, 'getByKey']);
        Route::match(['put', 'patch'], 'settings', [SettingController::class, 'bulkUpdate']);
        Route::apiResource('settings', SettingController::class);
        Route::get('sms/settings', [SmsController::class, 'settings']);
        Route::put('sms/settings', [SmsController::class, 'updateSettings']);
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
    Route::prefix('ec')->group(function () {
        Route::apiResource('elections', ECElectionController::class);
        Route::apiResource('geo-areas', ECGeoAreaController::class);
        Route::apiResource('committees', ECCommitteeController::class);
        Route::apiResource('candidates', ECCandidateController::class);
        Route::apiResource('voters', ECVoterController::class);
        Route::apiResource('agents', ECAgentController::class);
        Route::apiResource('volunteers', ECVolunteerController::class);
        Route::apiResource('observations', ECObservationController::class);
        Route::apiResource('campaigns', ECCampaignController::class);
        Route::apiResource('settings', ECSettingController::class);
    });
});
