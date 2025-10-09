<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Voter */
class VoterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'national_id' => $this->national_id,
            'phone' => $this->phone,
            'gender' => $this->gender,
            'area' => new AreaResource($this->whenLoaded('area')),
            'committee' => new CommitteeResource($this->whenLoaded('committee')),
        ];
    }
}
