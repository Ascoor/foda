<?php

namespace App\Data;

class ResolvedScope
{
    public function __construct(
        public array $areaIds,
        public array $campaignIds,
    ) {
    }

    public static function empty(): self
    {
        return new self([], []);
    }
}
