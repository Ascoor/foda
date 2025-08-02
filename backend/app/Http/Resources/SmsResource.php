<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SmsResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'message' => $this->message,
            'recipient' => $this->recipient,
            'status' => $this->status,
            'sent_at' => $this->sent_at,
            'scheduled_for' => $this->scheduled_for,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
