<?php

namespace App\Models\Concerns;

use App\Models\Campaign;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

trait WithinCampaignWindow
{
    public function scopeWithinCampaignWindow(Builder $query, Campaign $campaign): Builder
    {
        $start = $campaign->starts_at ? Carbon::parse($campaign->starts_at) : null;
        $end = $campaign->ends_at ? Carbon::parse($campaign->ends_at) : null;

        if ($start) {
            $query->whereDate($this->getQualifiedDateColumn(), '>=', $start->toDateString());
        }

        if ($end) {
            $query->whereDate($this->getQualifiedDateColumn(), '<=', $end->toDateString());
        }

        return $query;
    }

    protected function getQualifiedDateColumn(): string
    {
        return $this->qualifyColumn(property_exists($this, 'dateColumn') ? $this->dateColumn : 'date');
    }
}
