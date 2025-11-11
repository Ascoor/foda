<?php

namespace App\Enums;

enum ActivityStatus: string
{
    case Open = 'open';
    case Done = 'done';
    case Wip = 'wip';
}
