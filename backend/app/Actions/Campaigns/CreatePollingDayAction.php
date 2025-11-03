<?php

namespace App\Actions\Campaigns;

use App\Models\Campaign;
use App\Models\CampaignPollingDay;
use Illuminate\Support\Facades\DB;

class CreatePollingDayAction
{
    public function __invoke(Campaign $campaign, array $attributes): CampaignPollingDay
    {
        return DB::transaction(function () use ($campaign, $attributes) {
            $payload = $attributes;
            $payload['campaign_id'] = $campaign->getKey();

            return CampaignPollingDay::create($payload);
        });
    }
}
