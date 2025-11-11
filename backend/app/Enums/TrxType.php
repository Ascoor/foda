<?php

namespace App\Enums;

enum TrxType: string
{
    case Income = 'income';
    case Expense = 'expense';
}
