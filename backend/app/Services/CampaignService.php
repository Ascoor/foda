<?php

namespace App\Services;

use App\Models\ElectionCircle\Campaign;
use Illuminate\Support\Facades\DB;

class CampaignService
{
    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Campaign
    {
        return DB::transaction(function () use ($data) {
            $campaign = Campaign::create($data);

            return $campaign->fresh() ?? $campaign;
        });
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(Campaign $campaign, array $data): Campaign
    {
        return DB::transaction(function () use ($campaign, $data) {
            $campaign->update($data);

            return $campaign->fresh() ?? $campaign;
        });
    }
}
