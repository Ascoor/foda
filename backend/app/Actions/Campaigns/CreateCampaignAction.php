<?php

namespace App\Actions\Campaigns;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateCampaignAction
{
    public function __invoke(array $attributes, User $creator): Campaign
    {
        return DB::transaction(function () use ($attributes, $creator) {
            $payload = $attributes;
            $payload['slug'] = $payload['slug'] ?? Str::slug($payload['name']);
            $payload['created_by'] = $creator->getKey();
            $payload['status'] = $payload['status'] ?? 'draft';

            $campaign = Campaign::create($payload);

            $campaign->members()->syncWithoutDetaching([
                $creator->getKey() => [
                    'role' => 'owner',
                    'status' => 'active',
                    'permissions' => null,
                ],
            ]);

            return $campaign->fresh();
        });
    }
}
