<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    require __DIR__ . '/api/v1/public.php';
    require __DIR__ . '/api/v1/protected.php';

    require __DIR__ . '/api/v1/protected/campaign.php';
    require __DIR__ . '/api/v1/protected/analytics.php';
    require __DIR__ . '/api/v1/protected/activities.php';
    require __DIR__ . '/api/v1/protected/notifications.php';
});
