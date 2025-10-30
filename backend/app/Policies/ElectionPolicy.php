<?php

namespace App\Policies;

use App\Enums\MembershipRole;
use App\Enums\MembershipScopeType;
use App\Models\Election;
use App\Models\Membership;
use App\Models\User;
use App\Services\ScopeService;

class ElectionPolicy
{
    private function scope(User $user)
    {
        return app(ScopeService::class)->resolveForUser($user);
    }

    public function view(User $user, Election $election): bool
    {
        $scope = $this->scope($user);

        return in_array($election->campaign_id, $scope->campaignIds, true)
            || in_array($election->campaign->area_id, $scope->areaIds, true);
    }

    public function update(User $user, Election $election): bool
    {
        return $this->hasRoleForElection($user, $election, [MembershipRole::Admin, MembershipRole::Manager]);
    }

    public function create(User $user): bool
    {
        return $user->loadMissing('memberships')->memberships->contains(fn (Membership $membership) =>
            in_array($membership->role, [MembershipRole::Admin, MembershipRole::Manager], true)
        );
    }

    private function hasRoleForElection(User $user, Election $election, array $roles): bool
    {
        $scope = $this->scope($user);

        if (!in_array($election->campaign_id, $scope->campaignIds, true) && !in_array($election->campaign->area_id, $scope->areaIds, true)) {
            return false;
        }

        $areaScope = $scope->areaIds;

        return $user->loadMissing('memberships')->memberships->contains(function (Membership $membership) use ($election, $roles, $areaScope) {
            if (!in_array($membership->role, $roles, true)) {
                return false;
            }

            if ($membership->scope_type === MembershipScopeType::Campaign) {
                return $membership->scope_id === $election->campaign_id;
            }

            if ($membership->scope_type === MembershipScopeType::Area) {
                return in_array($membership->scope_id, $areaScope, true);
            }

            return false;
        });
    }
}
