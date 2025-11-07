<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AnalyticsController;

Route::middleware(['auth:sanctum', 'campaign.context:required'])->group(function (): void {
    Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
    Route::get('/analytics/timeseries', [AnalyticsController::class, 'timeseries']);
    Route::get('/analytics/forecast', [AnalyticsController::class, 'timeseries']);
});
