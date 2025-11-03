<?php

namespace App\Providers;

use App\Policies\CampaignPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Models\Campaign::class => \App\Policies\CampaignPolicy::class,
        \App\Models\Sms::class => \App\Policies\SmsPolicy::class,

        \App\Models\User::class => \App\Policies\UserPolicy::class,

    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        Gate::define('manage-electioncircle', function ($user) {
            return $user->hasAnyRole(['admin', 'manager', 'supervisor']);
        });

        Gate::define('campaign.manage-data', function ($user, \App\Models\Campaign $campaign) {
            return app(\App\Policies\CampaignPolicy::class)->manageData($user, $campaign);
        });
    }
}
