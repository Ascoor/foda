<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Notification */
class NotificationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => filled($this->type) ? strtolower($this->type) : null,
            'category' => $this->category,
            'title' => $this->title,
            'message' => $this->message,
            'priority' => $this->priority,
            'meta' => $this->meta ?? [],
            'read_at' => optional($this->read_at)->toIso8601String(),
            'created_at' => optional($this->created_at)->toIso8601String(),
            'created_ago' => $this->createdAgo,
            'is_high_priority' => $this->isHighPriority,
        ];
    }
}
