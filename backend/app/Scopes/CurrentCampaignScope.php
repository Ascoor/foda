<?php

declare(strict_types=1);

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class CurrentCampaignScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $campaignId = self::currentId();

        if ($campaignId !== null) {
            $builder->where($model->getTable() . '.campaign_id', $campaignId);
        }
    }

    public static function currentId(): ?int
    {
        return app()->bound('currentCampaignId')
            ? (int) app('currentCampaignId')
            : null;
    }
}
