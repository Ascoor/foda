<?php

namespace App\Actions\Campaigns;

use App\Models\Campaign;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UpdateCampaignAction
{
    public function __invoke(Campaign $campaign, array $attributes): Campaign
    {
        return DB::transaction(function () use ($campaign, $attributes) {
            $payload = $attributes;

            if (array_key_exists('name', $payload) && ! array_key_exists('slug', $payload)) {
                $payload['slug'] = Str::slug($payload['name']);
            }

            $campaign->fill($payload);
            $campaign->save();

            return $campaign->fresh();
        });
    }
}
