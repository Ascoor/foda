<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GeographicScopeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->getKey(),
            'name' => $this->resource->name,
            'level' => $this->resource->level,
            'area_id' => $this->resource->area_id,
            'bbox' => $this->resource->bbox,
            'meta' => $this->resource->meta,
            'parent_id' => $this->resource->parent_id,
            'committees' => CommitteeResource::collection($this->whenLoaded('committees')),
            'children' => GeographicScopeResource::collection($this->whenLoaded('children')),
        ];
    }
}
