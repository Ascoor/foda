<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AnalyticsController;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::middleware('campaign.context:required')->group(function (): void {
        Route::get('/analytics/overview', [AnalyticsController::class, 'overview'])
            ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
            ->name('analytics.overview');

        Route::get('/analytics/timeseries', [AnalyticsController::class, 'timeseries'])
            ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
            ->name('analytics.timeseries');

        Route::get('/analytics/forecast', [AnalyticsController::class, 'timeseries'])
            ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
            ->name('analytics.forecast');
    });

    Route::scopeBindings()
        ->middleware('campaign.context:required')
        ->group(function (): void {
            Route::prefix('campaigns/{campaign}/analytics')
                ->as('campaigns.analytics.')
                ->group(function (): void {
                    Route::get('overview', [AnalyticsController::class, 'overview'])
                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
                        ->name('overview');

                    Route::get('timeseries', [AnalyticsController::class, 'timeseries'])
                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
                        ->name('timeseries');

                    Route::get('forecast', [AnalyticsController::class, 'timeseries'])
                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
                        ->name('forecast');
                });
        });
});
