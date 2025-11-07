<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AreaController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ExternalDataController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\ProfileController;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword']);

    Route::get('/home', [HomeController::class, 'index']);
    Route::get('/dashboard', [HomeController::class, 'index']);
    Route::get('/home/heatmap', [HomeController::class, 'heatmap']);

    Route::apiResource('areas', AreaController::class);

    Route::prefix('integrations')->group(function (): void {
        Route::get('/geo-areas', [ExternalDataController::class, 'geoAreas']);
        Route::get('/elections/summary', [ExternalDataController::class, 'electionSummary']);
        Route::get('/elections/live-results', [ExternalDataController::class, 'liveResults']);
        Route::get('/maps/configuration', [ExternalDataController::class, 'mapConfiguration']);
    });

    Route::prefix('ec')->group(function (): void {
        Route::apiResource('campaigns', \App\Http\Controllers\ElectionCircle\CampaignController::class);
        Route::apiResource('settings', \App\Http\Controllers\ElectionCircle\SettingController::class);
    });
});
