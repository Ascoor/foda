<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\NotificationController;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAll']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
});
