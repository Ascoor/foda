<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class CampaignScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (app()->bound('campaign.context')) {
            $context = app('campaign.context');
            $campaignId = $context?->id();

            if ($campaignId) {
                $table = $builder->getModel()->getTable();
                $builder->where($table . '.campaign_id', $campaignId);
            }
        }
    }
}
