<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Area */
class AreaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'parent_id' => $this->parent_id,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'children' => AreaResource::collection($this->whenLoaded('children')),
            'committees' => CommitteeResource::collection($this->whenLoaded('committees')),
        ];
    }
}
