<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Report */
class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'area' => new AreaResource($this->whenLoaded('area')),
            'agent' => new AgentResource($this->whenLoaded('agent')),
            'created_at' => $this->created_at,
        ];
    }
}
