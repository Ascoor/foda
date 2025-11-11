<?php

namespace App\Enums;

enum ActivityType: string
{
    case Call = 'call';
    case Visit = 'visit';
    case Event = 'event';
    case Note = 'note';
    case Other = 'other';
}
