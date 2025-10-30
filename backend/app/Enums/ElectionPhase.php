<?php

namespace App\Enums;

enum ElectionPhase: string
{
    case Upcoming = 'upcoming';
    case Running = 'running';
    case Closed = 'closed';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
