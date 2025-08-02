<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SwotResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'entity_type' => $this->entity_type,
            'entity_id' => $this->entity_id,
            'entity' => [
                'type' => $this->entity_type,
                'id' => $this->entity_id,
            ],
            'strengths' => $this->strengths,
            'weaknesses' => $this->weaknesses,
            'opportunities' => $this->opportunities,
            'threats' => $this->threats,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
