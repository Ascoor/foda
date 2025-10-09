<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ActivityController;
use App\Http\Controllers\API\AgentController;
use App\Http\Controllers\API\AreaController;
use App\Http\Controllers\API\CommitteeController;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\VoterController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('voters', VoterController::class);
    Route::apiResource('committees', CommitteeController::class);
    Route::apiResource('agents', AgentController::class);
    Route::apiResource('reports', ReportController::class);
    Route::apiResource('activities', ActivityController::class);
    Route::apiResource('areas', AreaController::class);
});
