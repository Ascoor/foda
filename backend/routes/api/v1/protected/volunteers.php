<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\VolunteerController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('campaigns.volunteers', VolunteerController::class);
});
