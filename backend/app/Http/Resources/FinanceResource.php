<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
