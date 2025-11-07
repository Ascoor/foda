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
            'starts_at' => optional($this->resource->starts_at)?->toIso8601String(),
            'ends_at' => optional($this->resource->ends_at)?->toIso8601String(),
            'spatial_level' => $this->resource->spatial_level,
            'bbox' => $this->resource->bbox,
            'status' => $this->resource->status,
            'role' => $this->whenPivotLoaded('campaign_user', fn () => $this->pivot->role ?? null),
            'membership_status' => $this->whenPivotLoaded('campaign_user', fn () => $this->pivot->status ?? null),
            'permissions' => $this->whenPivotLoaded('campaign_user', fn () => $this->pivot->permissions ?? null),
            'created_at' => optional($this->resource->created_at)?->toIso8601String(),
            'updated_at' => optional($this->resource->updated_at)?->toIso8601String(),
        ];
    }
}
