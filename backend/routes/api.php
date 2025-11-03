<?php

use App\Http\Controllers\Api\V1\CampaignController;
use App\Http\Controllers\Api\V1\CampaignPollingDayController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('campaigns', CampaignController::class);
        Route::apiResource('campaigns.polling-days', CampaignPollingDayController::class);
    });
});
