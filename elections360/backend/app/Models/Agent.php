<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'status',
        'committee_id',
    ];

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }
}
