<?php

namespace App\Models\Concerns;

use App\Models\Campaign;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

trait WithinCampaignWindow
{
    public function scopeWithinCampaignWindow(Builder $query, Campaign $campaign): Builder
    {
        $startsAt = $campaign->starts_at;
        $endsAt = $campaign->ends_at;

        return $query
            ->when($startsAt, fn (Builder $builder) => $builder->where(
                $this->qualifyColumn($this->getStartColumn()),
                '>=',
                Carbon::parse($startsAt)->toDateTimeString()
            ))
            ->when($endsAt, fn (Builder $builder) => $builder->where(
                $this->qualifyColumn($this->getEndColumn()),
                '<=',
                Carbon::parse($endsAt)->toDateTimeString()
            ));
    }

    public function scopeWithinCampaignGeom(Builder $query, Campaign $campaign): Builder
    {
        $extent = $campaign->spatial_extent;

        if (! $extent) {
            return $query;
        }

        return $query->whereRaw(
            'ST_Intersects(ST_GeomFromGeoJSON(?), ' . $this->qualifyColumn($this->getGeometryColumn()) . ')',
            [json_encode($extent)]
        );
    }

    protected function getStartColumn(): string
    {
        return 'starts_at';
    }

    protected function getEndColumn(): string
    {
        return 'ends_at';
    }

    protected function getGeometryColumn(): string
    {
        return 'geom';
    }
}
