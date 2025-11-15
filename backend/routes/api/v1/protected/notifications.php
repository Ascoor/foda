<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\NotificationController;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,volunteer,viewer');

    Route::post('/notifications/read-all', [NotificationController::class, 'markAll'])
        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,volunteer');

    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,volunteer')
        ->whereNumber('notification');
});
