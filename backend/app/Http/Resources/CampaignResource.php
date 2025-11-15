<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->getKey(),
            'name' => $this->resource->name,
            'slug' => $this->resource->slug,
            'description' => $this->resource->description,
            'start_date' => optional($this->resource->start_date)?->toDateString(),
            'end_date' => optional($this->resource->end_date)?->toDateString(),
            'poll_date' => optional($this->resource->poll_date)?->toDateString(),
            'geographic_strategy' => $this->resource->geographic_strategy,
            'geographic_notes' => $this->resource->geographic_notes,
            'bbox' => $this->resource->bbox,
            'status' => $this->resource->status,
            'geographic_scopes' => GeographicScopeResource::collection($this->whenLoaded('geographicScopes')),
            'role' => $this->whenPivotLoaded('campaign_user', fn () => $this->pivot->role ?? null),
            'membership_status' => $this->whenPivotLoaded('campaign_user', fn () => $this->pivot->status ?? null),
            'permissions' => $this->whenPivotLoaded('campaign_user', fn () => $this->pivot->permissions ?? null),
            'created_at' => optional($this->resource->created_at)?->toIso8601String(),
            'updated_at' => optional($this->resource->updated_at)?->toIso8601String(),
        ];
    }
}
