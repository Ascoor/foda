<?php

use App\Http\Controllers\Api\V1\CampaignController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'scope.membership'])->group(function () {
    Route::get('campaigns', [CampaignController::class, 'index'])->middleware('throttle:campaigns');
    Route::post('campaigns', [CampaignController::class, 'store'])->middleware('can:create,App\\Models\\Campaign');
    Route::get('campaigns/{campaign}', [CampaignController::class, 'show'])->middleware('can:view,campaign');
    Route::patch('campaigns/{campaign}', [CampaignController::class, 'update'])->middleware('can:update,campaign');
    Route::post('campaigns/{campaign}/archive', [CampaignController::class, 'archive'])->middleware('can:update,campaign');
});
