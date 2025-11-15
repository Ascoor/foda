<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->getKey(),
            'campaign_id' => $this->resource->campaign_id,
            'category_id' => $this->resource->category_id,
            'category' => new DonationCategoryResource($this->whenLoaded('category')),
            'donor_name' => $this->resource->donor_name,
            'donor_contact' => $this->resource->donor_contact,
            'amount' => (float) $this->resource->amount,
            'donated_at' => optional($this->resource->donated_at)?->toDateString(),
            'reference' => $this->resource->reference,
            'notes' => $this->resource->notes,
            'meta' => $this->resource->meta,
            'created_at' => optional($this->resource->created_at)?->toIso8601String(),
            'updated_at' => optional($this->resource->updated_at)?->toIso8601String(),
        ];
    }
}
