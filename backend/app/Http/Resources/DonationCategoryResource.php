<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DonationCategoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->getKey(),
            'campaign_id' => $this->resource->campaign_id,
            'name' => $this->resource->name,
            'description' => $this->resource->description,
        ];
    }
}
