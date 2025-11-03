<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Campaign */
class CampaignResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'timezone' => $this->timezone,
            'starts_at' => optional($this->starts_at)->toISOString(),
            'ends_at' => optional($this->ends_at)->toISOString(),
            'spatial_level' => $this->spatial_level,
            'admin_areas' => $this->admin_areas,
            'spatial_extent' => $this->spatial_extent,
            'bbox' => $this->bbox,
            'polling_settings' => $this->polling_settings,
            'status' => $this->status,
            'created_by' => $this->created_by,
            'created_at' => optional($this->created_at)->toISOString(),
            'updated_at' => optional($this->updated_at)->toISOString(),
        ];
    }
}
