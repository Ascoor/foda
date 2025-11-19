<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AutomationController;
use App\Http\Controllers\Api\V1\CampaignController;
use App\Http\Controllers\Api\V1\CampaignPollingDayController;
use App\Http\Controllers\Api\V1\CommitteeController;
use App\Http\Controllers\Api\V1\CommitteeGeoController;
use App\Http\Controllers\Api\V1\DonationController;
use App\Http\Controllers\Api\V1\ExpenseController;
use App\Http\Controllers\Api\V1\GeographicScopeController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\VolunteerController;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::prefix('campaigns')
        ->as('campaigns.')
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

                    Route::prefix('{campaign}')
                        ->whereNumber('campaign')
                        ->group(function (): void {
                            Route::name('geographic-scopes.')
                                ->prefix('geographic-scopes')
                                ->group(function (): void {
                                    Route::get('', [GeographicScopeController::class, 'index'])
                                        ->middleware('role:campaign_manager,area_coordinator,viewer')
                                        ->name('index');

                                    Route::post('', [GeographicScopeController::class, 'store'])
                                        ->middleware('role:campaign_manager,area_coordinator')
                                        ->name('store');

                                    Route::get('{geographic_scope}', [GeographicScopeController::class, 'show'])
                                        ->middleware('role:campaign_manager,area_coordinator,viewer')
                                        ->whereNumber('geographic_scope')
                                        ->name('show');

                                    Route::put('{geographic_scope}', [GeographicScopeController::class, 'update'])
                                        ->middleware('role:campaign_manager,area_coordinator')
                                        ->whereNumber('geographic_scope')
                                        ->name('update');

                                    Route::delete('{geographic_scope}', [GeographicScopeController::class, 'destroy'])
                                        ->middleware('role:campaign_manager')
                                        ->whereNumber('geographic_scope')
                                        ->name('destroy');
                                });

                            Route::name('committees.')
                                ->prefix('committees')
                                ->group(function (): void {
                                    Route::get('', [CommitteeController::class, 'index'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,viewer')
                                        ->name('index');

                                    Route::get('geo', CommitteeGeoController::class)
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,viewer')
                                        ->name('geo');

                                    Route::post('', [CommitteeController::class, 'store'])
                                        ->middleware('role:campaign_manager,area_coordinator')
                                        ->name('store');

                                    Route::get('{committee}', [CommitteeController::class, 'show'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,viewer')
                                        ->whereNumber('committee')
                                        ->name('show');

                                    Route::put('{committee}', [CommitteeController::class, 'update'])
                                        ->middleware('role:campaign_manager,area_coordinator')
                                        ->whereNumber('committee')
                                        ->name('update');

                                    Route::delete('{committee}', [CommitteeController::class, 'destroy'])
                                        ->middleware('role:campaign_manager')
                                        ->whereNumber('committee')
                                        ->name('destroy');
                                });

                            Route::name('volunteers.')
                                ->prefix('volunteers')
                                ->group(function (): void {
                                    Route::get('', [VolunteerController::class, 'index'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,volunteer,viewer')
                                        ->name('index');

                                    Route::post('', [VolunteerController::class, 'store'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor')
                                        ->name('store');

                                    Route::get('{volunteer}', [VolunteerController::class, 'show'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,volunteer,viewer')
                                        ->whereNumber('volunteer')
                                        ->name('show');

                                    Route::put('{volunteer}', [VolunteerController::class, 'update'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor')
                                        ->whereNumber('volunteer')
                                        ->name('update');

                                    Route::delete('{volunteer}', [VolunteerController::class, 'destroy'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor')
                                        ->whereNumber('volunteer')
                                        ->name('destroy');
                                });

                            Route::name('donations.')
                                ->prefix('donations')
                                ->group(function (): void {
                                    Route::get('', [DonationController::class, 'index'])
                                        ->middleware('role:campaign_manager,finance,viewer')
                                        ->name('index');

                                    Route::post('', [DonationController::class, 'store'])
                                        ->middleware('role:campaign_manager,finance')
                                        ->name('store');

                                    Route::get('{donation}', [DonationController::class, 'show'])
                                        ->middleware('role:campaign_manager,finance,viewer')
                                        ->whereNumber('donation')
                                        ->name('show');

                                    Route::put('{donation}', [DonationController::class, 'update'])
                                        ->middleware('role:campaign_manager,finance')
                                        ->whereNumber('donation')
                                        ->name('update');

                                    Route::delete('{donation}', [DonationController::class, 'destroy'])
                                        ->middleware('role:campaign_manager,finance')
                                        ->whereNumber('donation')
                                        ->name('destroy');
                                });

                            Route::name('expenses.')
                                ->prefix('expenses')
                                ->group(function (): void {
                                    Route::get('', [ExpenseController::class, 'index'])
                                        ->middleware('role:campaign_manager,finance,viewer')
                                        ->name('index');

                                    Route::post('', [ExpenseController::class, 'store'])
                                        ->middleware('role:campaign_manager,finance')
                                        ->name('store');

                                    Route::get('{expense}', [ExpenseController::class, 'show'])
                                        ->middleware('role:campaign_manager,finance,viewer')
                                        ->whereNumber('expense')
                                        ->name('show');

                                    Route::put('{expense}', [ExpenseController::class, 'update'])
                                        ->middleware('role:campaign_manager,finance')
                                        ->whereNumber('expense')
                                        ->name('update');

                                    Route::delete('{expense}', [ExpenseController::class, 'destroy'])
                                        ->middleware('role:campaign_manager,finance')
                                        ->whereNumber('expense')
                                        ->name('destroy');
                                });

                            Route::name('polling-days.')
                                ->prefix('polling-days')
                                ->group(function (): void {
                                    Route::get('', [CampaignPollingDayController::class, 'index'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,viewer')
                                        ->name('index');

                                    Route::post('', [CampaignPollingDayController::class, 'store'])
                                        ->middleware('role:campaign_manager,area_coordinator')
                                        ->name('store');

                                    Route::get('{polling_day}', [CampaignPollingDayController::class, 'show'])
                                        ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,viewer')
                                        ->whereNumber('polling_day')
                                        ->name('show');

                                    Route::put('{polling_day}', [CampaignPollingDayController::class, 'update'])
                                        ->middleware('role:campaign_manager,area_coordinator')
                                        ->whereNumber('polling_day')
                                        ->name('update');

                                    Route::delete('{polling_day}', [CampaignPollingDayController::class, 'destroy'])
                                        ->middleware('role:campaign_manager,area_coordinator')
                                        ->whereNumber('polling_day')
                                        ->name('destroy');
                                });

                            Route::get('activities', [ActivityController::class, 'campaignIndex'])
                                ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,volunteer,viewer')
                                ->name('activities.index');

                            Route::get('activities/recent', [ActivityController::class, 'recent'])
                                ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,volunteer,viewer')
                                ->name('activities.recent');

                            Route::get('automation/config', [AutomationController::class, 'index'])
                                ->middleware('role:campaign_manager,area_coordinator')
                                ->name('automation.index');

                            Route::put('automation/config', [AutomationController::class, 'update'])
                                ->middleware('role:campaign_manager,area_coordinator')
                                ->name('automation.update');

                            Route::post('automation/config/{task}/trigger', [AutomationController::class, 'trigger'])
                                ->middleware('role:campaign_manager')
                                ->name('automation.trigger');

                            Route::get('home', [HomeController::class, 'index'])
                                ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
                                ->name('home');

                            Route::get('dashboard', [HomeController::class, 'index'])
                                ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
                                ->name('dashboard');

                            Route::get('home/heatmap', [HomeController::class, 'heatmap'])
                                ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,viewer')
                                ->name('heatmap');

                            Route::get('settings/key/{key}', [SettingController::class, 'getByKey'])
                                ->middleware('role:campaign_manager')
                                ->name('settings.show-key');

                            Route::match(['put', 'patch'], 'settings', [SettingController::class, 'bulkUpdate'])
                                ->middleware('role:campaign_manager')
                                ->name('settings.bulk-update');

                            Route::apiResource('settings', SettingController::class)
                                ->except(['create', 'edit'])
                                ->middleware('role:campaign_manager')
                                ->names([
                                    'index' => 'settings.index',
                                    'store' => 'settings.store',
                                    'show' => 'settings.show',
                                    'update' => 'settings.update',
                                    'destroy' => 'settings.destroy',
                                ]);

                            Route::get('dashboard-stats', [AnalyticsController::class, 'dashboard'])
                                ->middleware('role:campaign_manager,area_coordinator,committee_supervisor,finance,viewer')
                                ->name('analytics.dashboard');
                        });
                });
        });
});
