<?php

use App\Http\Controllers\Api\V1\ElectionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'scope.membership'])->group(function () {
    Route::get('campaigns/{campaign}/elections', [ElectionController::class, 'indexByCampaign'])->middleware('can:view,campaign');
    Route::get('campaigns/{campaign}/elections/{election}', [ElectionController::class, 'show'])->middleware('can:view,campaign');
    Route::post('campaigns/{campaign}/elections', [ElectionController::class, 'store'])->middleware('can:update,campaign');
    Route::patch('campaigns/{campaign}/elections/{election}', [ElectionController::class, 'update'])->middleware('can:update,campaign');
});
