<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VolunteerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->getKey(),
            'campaign_id' => $this->resource->campaign_id,
            'geographic_scope_id' => $this->resource->geographic_scope_id,
            'committee_id' => $this->resource->committee_id,
            'name' => $this->resource->name,
            'email' => $this->resource->email,
            'phone' => $this->resource->phone,
            'role' => $this->resource->role,
            'status' => $this->resource->status,
            'joined_at' => optional($this->resource->joined_at)?->toDateString(),
            'skills' => $this->resource->skills,
            'notes' => $this->resource->notes,
            'committee' => new CommitteeResource($this->whenLoaded('committee')),
            'geographic_scope' => new GeographicScopeResource($this->whenLoaded('geographicScope')),
            'created_at' => optional($this->resource->created_at)?->toIso8601String(),
            'updated_at' => optional($this->resource->updated_at)?->toIso8601String(),
        ];
    }
}
