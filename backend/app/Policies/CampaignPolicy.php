<?php

namespace App\Policies;

use App\Models\Campaign;
use App\Models\User;

class CampaignPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->exists;
    }

    public function view(User $user, Campaign $campaign): bool
    {
        return $this->isMember($user, $campaign) || $user->hasAnyRole(['admin', 'manager']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager']);
    }

    public function update(User $user, Campaign $campaign): bool
    {
        return $this->hasCampaignRole($user, $campaign, ['owner', 'admin']) || $user->hasRole('admin');
    }

    public function delete(User $user, Campaign $campaign): bool
    {
        return $this->hasCampaignRole($user, $campaign, ['owner']) || $user->hasRole('admin');
    }

    public function manageData(User $user, Campaign $campaign): bool
    {
        return $this->hasCampaignRole($user, $campaign, ['owner', 'admin', 'manager']) || $user->hasAnyRole(['admin', 'manager']);
    }

    protected function isMember(User $user, Campaign $campaign): bool
    {
        return $this->hasCampaignRole($user, $campaign, ['owner', 'admin', 'manager', 'member', 'viewer']);
    }

    protected function hasCampaignRole(User $user, Campaign $campaign, array $roles): bool
    {
        $membership = $user->campaigns()
            ->where('campaign_id', $campaign->getKey())
            ->wherePivot('status', 'active')
            ->first();

        if (! $membership) {
            return false;
        }

        return in_array($membership->pivot->role, $roles, true);
    }
}
