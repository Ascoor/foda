<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\{Campaign, Committee, Voter, Activity, AgentAssignment, Finance};
use App\Policies\{CampaignPolicy, CommitteePolicy, VoterPolicy, ActivityPolicy, AgentAssignmentPolicy, FinancePolicy};

class CampaignPolicyServiceProvider extends ServiceProvider
{
    protected $policies = [
        Campaign::class => CampaignPolicy::class,
        Committee::class => CommitteePolicy::class,
        Voter::class => VoterPolicy::class,
        Activity::class => ActivityPolicy::class,
        AgentAssignment::class => AgentAssignmentPolicy::class,
        Finance::class => FinancePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
