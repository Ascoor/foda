<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'coverUrl' => $this->cover_url,
            'status' => $this->status->value,
            'createdAt' => $this->created_at?->toIso8601String(),
            'area' => [
                'id' => $this->area->id,
                'name' => $this->area->name,
            ],
        ];
    }
}
