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

    public function scopeForCampaign(Builder $query, int $campaignId): Builder
    {
        return $query->where($this->getTable() . '.campaign_id', $campaignId);
    }
}
