<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CampaignService
{
    public function listForUser(User $user, ?string $search = null): Collection
    {
        $query = $user->campaigns()
            ->select('campaigns.*')
            ->withPivot(['role', 'status', 'permissions'])
            ->orderByDesc('campaigns.starts_at');

        if ($search) {
            $like = '%' . $search . '%';
            $query->where(function ($builder) use ($like): void {
                $builder->where('campaigns.name', 'like', $like)
                    ->orWhere('campaigns.slug', 'like', $like)
                    ->orWhere('campaigns.description', 'like', $like);
            });
        }

        return $query->get();
    }

    public function create(User $owner, array $payload): Campaign
    {
        return DB::transaction(function () use ($owner, $payload): Campaign {
            $campaign = Campaign::query()->create($payload);

            $owner->campaigns()->syncWithoutDetaching([
                $campaign->getKey() => [
                    'role' => 'owner',
                    'status' => 'active',
                ],
            ]);

            return $campaign->refresh();
        });
    }

    public function update(Campaign $campaign, array $payload): Campaign
    {
        $campaign->fill($payload);
        $campaign->save();

        return $campaign->refresh();
    }

    public function delete(Campaign $campaign): void
    {
        $campaign->delete();
    }
}
