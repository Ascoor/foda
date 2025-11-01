<?php

namespace App\Traits;

use App\Scopes\CampaignScope;

trait CampaignScopedModel
{
    protected static function bootCampaignScopedModel(): void
    {
        static::addGlobalScope(new CampaignScope());

        static::creating(function ($model) {
            if (is_null($model->campaign_id) && app()->bound('campaign.context')) {
                $context = app('campaign.context');
                $campaignId = $context?->id();

                if ($campaignId) {
                    $model->campaign_id = $campaignId;
                }
            }
        });
    }

    public function scopeForCampaign($query, $campaignId)
    {
        return $query->where('campaign_id', $campaignId);
    }
}
