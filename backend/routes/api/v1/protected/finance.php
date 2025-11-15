<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\DonationController;
use App\Http\Controllers\Api\V1\ExpenseController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('campaigns.donations', DonationController::class);
    Route::apiResource('campaigns.expenses', ExpenseController::class);
});
