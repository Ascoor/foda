<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Campaign;
use App\Models\User;

class CampaignPolicy
{
    private const VIEW_ROLES = [
        'admin',
        'manager',
        'campaign_manager',
        'area_coordinator',
        'committee_supervisor',
        'finance',
        'viewer',
    ];

    public function viewAny(User $user): bool
    {
        if ($user->hasAnyRole(self::VIEW_ROLES)) {
            return true;
        }

        return $user->campaigns()->exists();
    }

    public function view(User $user, Campaign $campaign): bool
    {
        if ($user->hasAnyRole(self::VIEW_ROLES)) {
            return true;
        }

        return $this->belongsToCampaign($user, $campaign);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'campaign_manager']);
    }

    public function update(User $user, Campaign $campaign): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('campaign_manager') || $user->hasRole('manager')) {
            return $this->belongsToCampaign($user, $campaign);
        }

        return false;
    }

    public function delete(User $user, Campaign $campaign): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('campaign_manager')) {
            return $this->belongsToCampaign($user, $campaign);
        }

        return false;
    }

    protected function belongsToCampaign(User $user, Campaign $campaign): bool
    {
        if ($user->relationLoaded('campaigns')) {
            return $user->campaigns->contains(fn (Campaign $attached) => (int) $attached->getKey() === (int) $campaign->getKey());
        }

        return $user->campaigns()->whereKey($campaign->getKey())->exists();
    }
}
