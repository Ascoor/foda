<?php

namespace App\Enums;

enum MembershipScopeType: string
{
    case Area = 'area';
    case Campaign = 'campaign';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
