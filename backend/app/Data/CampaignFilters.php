<?php

namespace App\Data;

use App\Enums\CampaignStatus;
use Illuminate\Support\Arr;

class CampaignFilters
{
    public function __construct(
        public readonly ?CampaignStatus $status,
        public readonly ?int $areaId,
        public readonly ?string $search,
        public readonly int $perPage = 15,
    ) {
    }

    public static function fromArray(array $payload): self
    {
        $status = null;
        if ($value = Arr::get($payload, 'status')) {
            $status = CampaignStatus::tryFrom($value);
        }

        $areaId = Arr::get($payload, 'areaId');
        $search = Arr::get($payload, 'q');
        $perPage = (int) (Arr::get($payload, 'perPage') ?? 15);

        return new self($status, $areaId ? (int) $areaId : null, $search, $perPage);
    }
}
