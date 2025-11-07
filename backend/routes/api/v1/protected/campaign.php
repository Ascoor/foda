<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AutomationController;
use App\Http\Controllers\Api\V1\CampaignController;
use App\Http\Controllers\Api\V1\CampaignPollingDayController;
use App\Http\Controllers\Api\V1\CommitteeGeoController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\SmsController;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/campaigns', [CampaignController::class, 'index']);
    Route::post('/campaigns', [CampaignController::class, 'store']);

    Route::middleware('campaign.context:required')->group(function (): void {
        Route::get('/campaigns/{campaign}', [CampaignController::class, 'show']);
        Route::put('/campaigns/{campaign}', [CampaignController::class, 'update']);
        Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy']);

        Route::apiResource('campaigns.polling-days', CampaignPollingDayController::class);

        Route::prefix('campaigns/{campaign}')
            ->as('campaigns.')
            ->group(function (): void {
                Route::get('automation/config', [AutomationController::class, 'index']);
                Route::put('automation/config', [AutomationController::class, 'update']);
                Route::post('automation/config/{task}/trigger', [AutomationController::class, 'trigger']);

                Route::get('committees/geo', CommitteeGeoController::class);

                Route::get('home', [HomeController::class, 'index']);
                Route::get('dashboard', [HomeController::class, 'index']);
                Route::get('home/heatmap', [HomeController::class, 'heatmap']);

                Route::get('settings/key/{key}', [SettingController::class, 'getByKey']);
                Route::match(['put', 'patch'], 'settings', [SettingController::class, 'bulkUpdate']);
                Route::apiResource('settings', SettingController::class)->except(['create', 'edit']);

                Route::get('roles', [RoleController::class, 'index']);
                Route::match(['put', 'patch'], 'roles/{role}', [RoleController::class, 'update']);

                Route::get('sms/settings', [SmsController::class, 'settings']);
                Route::put('sms/settings', [SmsController::class, 'updateSettings']);

                Route::get('activities', [ActivityController::class, 'campaignIndex']);
                Route::get('activities/recent', [ActivityController::class, 'recent']);

                Route::get('dashboard-stats', [AnalyticsController::class, 'dashboard']);
            });
    });
});
