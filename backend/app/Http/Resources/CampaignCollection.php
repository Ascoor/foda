<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\AbstractPaginator;

class CampaignCollection extends ResourceCollection
{
    public $collects = CampaignResource::class;

    public function with($request): array
    {
        if ($this->resource instanceof AbstractPaginator) {
            return [
                'meta' => [
                    'current_page' => $this->resource->currentPage(),
                    'per_page' => $this->resource->perPage(),
                    'total' => $this->resource->total(),
                    'last_page' => $this->resource->lastPage(),
                ],
                'links' => [
                    'next' => $this->resource->nextPageUrl(),
                    'prev' => $this->resource->previousPageUrl(),
                ],
            ];
        }

        return [];
    }
}
