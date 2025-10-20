<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
class VoterResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'campaign' => $this->whenLoaded('campaign', fn () => [
                'id' => $this->campaign?->id,
                'name' => $this->campaign?->name,
            ]),
            'geo_area' => $this->whenLoaded('geoArea', fn () => [
                'id' => $this->geoArea?->id,
                'name' => $this->geoArea?->name,
            ]),
            'committee' => $this->whenLoaded('committee', fn () => [
                'id' => $this->committee?->id,
                'name' => $this->committee?->name,
            ]),
            'campaign_id' => $this->campaign_id,
            'geo_area_id' => $this->geo_area_id,
            'committee_id' => $this->committee_id,
            'full_name' => $this->full_name,
            'national_id' => $this->national_id,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'support_status' => $this->support_status,
            'last_contact_at' => optional($this->last_contact_at)->toIso8601String(),
            'notes' => $this->notes,
            'source' => $this->source,
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
        ];
    }
}
