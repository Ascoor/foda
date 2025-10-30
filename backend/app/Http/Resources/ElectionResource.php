<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ElectionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'coverUrl' => $this->cover_url,
            'phase' => $this->phase->value,
            'startAt' => $this->start_at?->toIso8601String(),
            'endAt' => $this->end_at?->toIso8601String(),
            'campaign' => [
                'id' => $this->campaign->id,
                'name' => $this->campaign->name,
            ],
        ];
    }
}
