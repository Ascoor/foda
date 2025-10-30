<?php

namespace App\Providers;

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
        \App\Models\Sms::class => \App\Policies\SmsPolicy::class,
        \App\Models\User::class => \App\Policies\UserPolicy::class,
        \App\Models\Campaign::class => \App\Policies\CampaignPolicy::class,
        \App\Models\Election::class => \App\Policies\ElectionPolicy::class,
 
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

        //
    }
}
