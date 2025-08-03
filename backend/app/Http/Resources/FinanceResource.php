<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ExpenseCategoryResource;

class FinanceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'type' => $this->type,
            'date' => $this->date->toDateString(),
            'description' => $this->description,
            'reference_id' => $this->reference_id,
            'category' => new ExpenseCategoryResource($this->whenLoaded('category')),
            'category_id' => $this->category_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
