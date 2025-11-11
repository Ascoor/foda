<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignOverviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'campaign' => $this->resource['campaign'] ?? null,
            'metrics' => $this->resource['metrics'] ?? null,
            'sections' => $this->resource['sections'] ?? null,
            'stats' => $this->resource['stats'] ?? null,
            'progress' => $this->resource['progress'] ?? null,
            'activities' => $this->resource['activities'] ?? null,
            'turnout' => $this->resource['turnout'] ?? null,
        ];
    }
}
