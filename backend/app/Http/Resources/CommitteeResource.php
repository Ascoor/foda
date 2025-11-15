<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommitteeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->getKey(),
            'campaign_id' => $this->resource->campaign_id,
            'geographic_scope_id' => $this->resource->geographic_scope_id,
            'area_id' => $this->resource->area_id,
            'name' => $this->resource->name,
            'code' => $this->resource->code,
            'location' => $this->resource->location,
            'lat' => $this->resource->lat,
            'lng' => $this->resource->lng,
            'meta' => $this->resource->meta,
        ];
    }
}
