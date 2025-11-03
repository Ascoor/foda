<?php

namespace App\Policies;

use App\Models\Campaign;
use App\Models\User;

class CampaignPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'manager']) || $user->campaigns()->exists();
    }

    public function view(User $user, Campaign $campaign): bool
    {
        return $user->hasAnyRole(['admin', 'manager']) || $this->belongsToCampaign($user, $campaign);
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Campaign $campaign): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->hasRole('manager') && $this->belongsToCampaign($user, $campaign);
    }

    public function delete(User $user, Campaign $campaign): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return false;
    }

    protected function belongsToCampaign(User $user, Campaign $campaign): bool
    {
        if ($user->relationLoaded('campaigns')) {
            return $user->campaigns->contains(fn ($attached) => (int) $attached->getKey() === (int) $campaign->getKey());
        }

        return $user->campaigns()->whereKey($campaign->getKey())->exists();
    }
}
