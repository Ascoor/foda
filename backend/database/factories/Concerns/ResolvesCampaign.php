<?php

namespace Database\Factories\Concerns;

use App\Models\Campaign;

trait ResolvesCampaign
{
    protected function resolveCampaignId(): int
    {
        $existing = Campaign::query()->inRandomOrder()->value('id');

        return $existing ?: Campaign::factory()->create()->id;
    }

    protected function resolveCampaign(): Campaign
    {
        return Campaign::query()->inRandomOrder()->first() ?: Campaign::factory()->create();
    }
}
