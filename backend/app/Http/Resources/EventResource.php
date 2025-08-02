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
            'area' => [
                'id' => $this->area->id ?? null,
                'name' => $this->area->name ?? null,
            ],
            'team' => [
                'id' => $this->team->id ?? null,
                'name' => $this->team->name ?? null,
            ],
            'volunteers_count' => $this->volunteers_count ?? 0,
            'volunteers' => VolunteerResource::collection($this->whenLoaded('volunteers')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
