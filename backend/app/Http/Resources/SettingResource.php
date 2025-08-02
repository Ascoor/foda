<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray($request): array
    {
        $value = $this->value;

        switch ($this->type) {
            case 'integer':
                $value = (int) $value;
                break;
            case 'boolean':
                $value = (bool) $value;
                break;
        }

        return [
            'id' => $this->id,
            'key' => $this->key,
            'value' => $value,
            'type' => $this->type,
            'description' => $this->description,
        ];
    }
}
