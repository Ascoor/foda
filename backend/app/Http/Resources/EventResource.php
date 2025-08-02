<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'name' => $this->name,
            'description' => $this->description,
            'organiser' => $this->organiser,
            'location' => $this->location,
            'date' => $this->date ? $this->date->toDateString() : null,
            'area_id' => $this->area_id,
            'area_name' => $this->area->name ?? null,
            'team_id' => $this->team_id,
            'team_name' => $this->team->name ?? null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
