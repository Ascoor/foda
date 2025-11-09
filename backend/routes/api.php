<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{
    ActivityController,
    AreaController,
    CommitteeGeoController,
    HomeController,
    AnalyticsController,
    NotificationController,
    AutomationController,
    SettingController,
    ExternalDataController,
};

Route::prefix('v1')->group(function () {

    Route::middleware(['auth:sanctum', \App\Http\Middleware\EnforceCampaignScope::class])->group(function () {
        Route::get('campaigns/{campaign}/dashboard', [HomeController::class, 'dashboard']);
        Route::get('campaigns/{campaign}/analytics', [AnalyticsController::class, 'dashboard']);

        Route::get('campaigns/{campaign}/activities', [ActivityController::class, 'index']);
        Route::get('campaigns/{campaign}/activities/recent', [ActivityController::class, 'recent']);
        Route::post('campaigns/{campaign}/activities', [ActivityController::class, 'store']);
        Route::get('campaigns/{campaign}/activities/{activity}', [ActivityController::class, 'show']);
        Route::put('campaigns/{campaign}/activities/{activity}', [ActivityController::class, 'update']);
        Route::delete('campaigns/{campaign}/activities/{activity}', [ActivityController::class, 'destroy']);

        Route::get('campaigns/{campaign}/areas', [AreaController::class, 'index']);
        Route::get('campaigns/{campaign}/committees/geo', [CommitteeGeoController::class, 'index']);

        Route::get('campaigns/{campaign}/settings', [SettingController::class, 'index']);
        Route::put('campaigns/{campaign}/settings', [SettingController::class, 'update']);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/mark-read', [NotificationController::class, 'markRead']);

        Route::get('campaigns/{campaign}/automation/config', [AutomationController::class, 'config']);
        Route::post('campaigns/{campaign}/automation/{task}/toggle', [AutomationController::class, 'toggle']);
    });

    Route::middleware(['auth:sanctum', 'throttle:extapi'])->group(function () {
        Route::get('integrations/elections/summary', [ExternalDataController::class, 'electionSummary']);
    });
});
