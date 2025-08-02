<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\VolunteerResource;

class TeamResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'area' => [
                'id' => $this->area->id ?? null,
                'name' => $this->area->name ?? null,
            ],
            'supervisor' => [
                'id' => $this->supervisor->id ?? null,
                'name' => $this->supervisor->name ?? null,
            ],
            'volunteers' => VolunteerResource::collection($this->whenLoaded('volunteers')),
            'volunteers_count' => $this->volunteers_count ?? $this->volunteers()->count(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
