<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Committee */
class CommitteeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'location' => $this->location,
            'area' => new AreaResource($this->whenLoaded('area')),
            'agents' => AgentResource::collection($this->whenLoaded('agents')),
            'voters' => VoterResource::collection($this->whenLoaded('voters')),
        ];
    }
}
