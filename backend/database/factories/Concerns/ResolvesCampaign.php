<?php

namespace Database\Factories\Concerns;

use App\Models\ElectionCircle\Campaign;

trait ResolvesCampaign
{
    protected function resolveCampaignId(): int
    {
        $existing = Campaign::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return Campaign::factory()->create()->id;
    }

    protected function resolveCampaign(): Campaign
    {
        $campaign = Campaign::query()->inRandomOrder()->first();

        if ($campaign) {
            return $campaign;
        }

        return Campaign::factory()->create();
    }
}
