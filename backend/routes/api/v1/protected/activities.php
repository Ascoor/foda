<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ActivityController;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('activities', ActivityController::class);
});
