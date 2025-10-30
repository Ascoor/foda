<?php

namespace App\Policies;

use App\Enums\MembershipRole;
use App\Enums\MembershipScopeType;
use App\Models\Campaign;
use App\Models\Membership;
use App\Models\User;
use App\Services\ScopeService;

class CampaignPolicy
{
    private function scope(User $user)
    {
        return app(ScopeService::class)->resolveForUser($user);
    }

    public function viewAny(User $user): bool
    {
        return $user->memberships()->exists();
    }

    public function view(User $user, Campaign $campaign): bool
    {
        $scope = $this->scope($user);

        return in_array($campaign->id, $scope->campaignIds, true)
            || in_array($campaign->area_id, $scope->areaIds, true);
    }

    public function create(User $user): bool
    {
        return $user->loadMissing('memberships')->memberships->contains(fn (Membership $membership) =>
            $membership->scope_type === MembershipScopeType::Area
            && $membership->role === MembershipRole::Admin
        );
    }

    public function update(User $user, Campaign $campaign): bool
    {
        return $this->hasRoleForCampaign($user, $campaign, [MembershipRole::Admin, MembershipRole::Manager]);
    }

    public function delete(User $user, Campaign $campaign): bool
    {
        return $this->hasRoleForCampaign($user, $campaign, [MembershipRole::Admin]);
    }

    private function hasRoleForCampaign(User $user, Campaign $campaign, array $roles): bool
    {
        $scope = $this->scope($user);

        if (!in_array($campaign->id, $scope->campaignIds, true) && !in_array($campaign->area_id, $scope->areaIds, true)) {
            return false;
        }

        $areaScope = $scope->areaIds;

        return $user->loadMissing('memberships')->memberships->contains(function (Membership $membership) use ($campaign, $roles, $areaScope) {
            if (!in_array($membership->role, $roles, true)) {
                return false;
            }

            if ($membership->scope_type === MembershipScopeType::Campaign) {
                return $membership->scope_id === $campaign->id;
            }

            if ($membership->scope_type === MembershipScopeType::Area) {
                return in_array($membership->scope_id, $areaScope, true);
            }

            return false;
        });
    }
}
