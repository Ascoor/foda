<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'campaign' => $this->whenLoaded('campaign', fn () => [
                'id' => $this->campaign?->id,
                'name' => $this->campaign?->name,
            ]),
            'volunteer' => $this->whenLoaded('volunteer', fn () => [
                'id' => $this->volunteer?->id,
                'full_name' => $this->volunteer?->full_name,
            ]),
            'voter' => $this->whenLoaded('voter', fn () => [
                'id' => $this->voter?->id,
                'full_name' => $this->voter?->full_name,
            ]),
            'activity_type' => $this->activity_type,
            'status' => $this->status,
            'channel' => $this->channel,
            'performed_at' => optional($this->performed_at)->toIso8601String(),
            'notes' => $this->notes,
            'metadata' => $this->metadata ?? new \stdClass(),
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
        ];
    }
}
