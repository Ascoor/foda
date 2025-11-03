<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        \App\Models\Sms::class => \App\Policies\SmsPolicy::class,
        \App\Models\User::class => \App\Policies\UserPolicy::class,
        \App\Models\Campaign::class => \App\Policies\CampaignPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('manage-electioncircle', function ($user) {
            return $user->hasAnyRole(['admin', 'manager', 'supervisor']);
        });
    }
}
