<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AutomationTask */
class AutomationTaskResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'task' => $this->task,
            'display_name' => $this->display_name,
            'description' => $this->description,
            'is_enabled' => $this->is_enabled,
            'status' => $this->status,
            'last_run_at' => optional($this->last_run_at)->toIso8601String(),
            'meta' => $this->meta ?? [],
        ];
    }
}
