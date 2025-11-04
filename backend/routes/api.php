<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AreaController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CampaignController;
use App\Http\Controllers\Api\V1\CampaignPollingDayController;
use App\Http\Controllers\Api\V1\CommitteeGeoController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\FinanceController;
use App\Http\Controllers\Api\V1\ExpenseCategoryController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\AutomationController;
use App\Http\Controllers\Api\V1\ExternalDataController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\SmsController;
use App\Http\Controllers\Api\V1\LiveDataController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\SwotController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\VolunteerController;
use App\Http\Controllers\Api\V1\RoleController;
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

$apiRoutes = function () {
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
        Route::apiResource('activities', ActivityController::class);
        Route::get('analytics', AnalyticsController::class);
        Route::get('analytics/forecast', [AnalyticsController::class, 'forecast']);
        Route::get('home', [HomeController::class, 'index']);
        Route::get('dashboard', [HomeController::class, 'index']);
        Route::get('home/heatmap', [HomeController::class, 'heatmap']);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('notifications/read-all', [NotificationController::class, 'markAll']);

        Route::apiResource('campaigns', CampaignController::class);
        Route::apiResource('campaigns.polling-days', CampaignPollingDayController::class);

        Route::prefix('campaigns/{campaign}')
            ->middleware('resolve.campaign')
            ->group(function () {
                Route::get('automation/config', [AutomationController::class, 'index']);
                Route::put('automation/config', [AutomationController::class, 'update']);
                Route::post('automation/config/{task}/trigger', [AutomationController::class, 'trigger']);

                Route::get('committees/geo', CommitteeGeoController::class);

                Route::get('home', [HomeController::class, 'index']);
                Route::get('dashboard', [HomeController::class, 'index']);
                Route::get('home/heatmap', [HomeController::class, 'heatmap']);

                Route::get('settings/key/{key}', [SettingController::class, 'getByKey']);
                Route::match(['put', 'patch'], 'settings', [SettingController::class, 'bulkUpdate']);
                Route::apiResource('settings', SettingController::class);

                Route::get('roles', [RoleController::class, 'index']);
                Route::match(['put', 'patch'], 'roles/{role}', [RoleController::class, 'update']);

                Route::get('sms/settings', [SmsController::class, 'settings']);
                Route::put('sms/settings', [SmsController::class, 'updateSettings']);

                Route::get('activities', [ActivityController::class, 'campaignIndex']);
                Route::get('activities/recent', [ActivityController::class, 'recent']);
            });

        Route::prefix('integrations')->group(function () {
            Route::get('geo-areas', [ExternalDataController::class, 'geoAreas']);
            Route::get('elections/summary', [ExternalDataController::class, 'electionSummary']);
            Route::get('elections/live-results', [ExternalDataController::class, 'liveResults']);
            Route::get('maps/configuration', [ExternalDataController::class, 'mapConfiguration']);
        });
    });


    Route::middleware('auth:sanctum')->prefix('ec')->group(function () {
    //     Route::apiResource('elections', ECElectionController::class);
    //     Route::apiResource('geo-areas', ECGeoAreaController::class);
    //     Route::apiResource('committees', ECCommitteeController::class);
    //     Route::apiResource('candidates', ECCandidateController::class);
    //     Route::apiResource('voters', ECVoterController::class);
    //     Route::apiResource('agents', ECAgentController::class);
    //     Route::apiResource('volunteers', ECVolunteerController::class);
    //     Route::apiResource('observations', ECObservationController::class);
        Route::apiResource('campaigns', ECCampaignController::class);
        Route::apiResource('settings', ECSettingController::class);
    });
};

Route::prefix('v1')->group(function () use ($apiRoutes) {
    $apiRoutes();
});

Route::any('{path?}', function (Request $request, ?string $path = null) {
    $path = $path ? ltrim($path, '/') : '';

    if ($path === '') {
        return redirect(url('api/v1'), 307);
    }

    if ($path === 'v1' || strpos($path, 'v1/') === 0) {
        abort(404);
    }

    $targetUrl = url('api/v1/' . $path);
    $queryString = $request->getQueryString();

    if ($queryString) {
        $targetUrl .= '?' . $queryString;
    }

    return redirect($targetUrl, 307);
})->where('path', '.*');
 
