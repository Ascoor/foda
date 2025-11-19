<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\CampaignController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->prefix('ec/campaigns')
    ->as('legacy.ec.campaigns.')
    ->group(function (): void {
        Route::get('', [CampaignController::class, 'index'])
            ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
            ->name('index');

        Route::post('', [CampaignController::class, 'store'])
            ->middleware('role:campaign_manager')
            ->name('store');

        Route::scopeBindings()
            ->middleware('campaign.context:required')
            ->group(function (): void {
                Route::get('{campaign}', [CampaignController::class, 'show'])
                    ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
                    ->whereNumber('campaign')
                    ->name('show');

                Route::put('{campaign}', [CampaignController::class, 'update'])
                    ->middleware('role:campaign_manager')
                    ->whereNumber('campaign')
                    ->name('update');

                Route::delete('{campaign}', [CampaignController::class, 'destroy'])
                    ->middleware('role:campaign_manager')
                    ->whereNumber('campaign')
                    ->name('destroy');

                Route::post('{campaign}/send', [CampaignController::class, 'send'])
                    ->middleware('role:campaign_manager')
                    ->whereNumber('campaign')
                    ->name('send');
            });
    });
