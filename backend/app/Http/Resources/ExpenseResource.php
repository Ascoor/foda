<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->getKey(),
            'campaign_id' => $this->resource->campaign_id,
            'category_id' => $this->resource->category_id,
            'category' => new ExpenseCategoryResource($this->whenLoaded('category')),
            'vendor_name' => $this->resource->vendor_name,
            'amount' => (float) $this->resource->amount,
            'spent_at' => optional($this->resource->spent_at)?->toDateString(),
            'reference' => $this->resource->reference,
            'description' => $this->resource->description,
            'meta' => $this->resource->meta,
            'created_at' => optional($this->resource->created_at)?->toIso8601String(),
            'updated_at' => optional($this->resource->updated_at)?->toIso8601String(),
        ];
    }
}
