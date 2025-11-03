<?php

namespace App\Models\Concerns;

use App\Models\Campaign;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToCampaign
{
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function scopeForCampaign(Builder $query, Campaign|int $campaign): Builder
    {
        $campaignId = $campaign instanceof Campaign ? $campaign->getKey() : $campaign;

        return $query->where($this->qualifyColumn('campaign_id'), $campaignId);
    }

    public function scopeOfCampaign(Builder $query, Campaign|int $campaign): Builder
    {
        return $this->scopeForCampaign($query, $campaign);
    }
}
