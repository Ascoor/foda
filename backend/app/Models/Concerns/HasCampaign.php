<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Scopes\CurrentCampaignScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait HasCampaign
{
    public static function bootHasCampaign(): void
    {
        static::addGlobalScope(CurrentCampaignScope::class, new CurrentCampaignScope());

        static::creating(function (Model $model): void {
            $campaignId = CurrentCampaignScope::currentId();

            if ($campaignId !== null && empty($model->campaign_id)) {
                $model->campaign_id = $campaignId;
            }
        });
    }

    public function scopeInCampaign(Builder $builder, int $campaignId): Builder
    {
        return $builder->where($builder->getModel()->getTable() . '.campaign_id', $campaignId);
    }

    public static function withoutCampaignScope(): Builder
    {
        return static::query()->withoutGlobalScope(CurrentCampaignScope::class);
    }
}
