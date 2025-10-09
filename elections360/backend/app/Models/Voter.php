<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voter extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'national_id',
        'phone',
        'gender',
        'area_id',
        'committee_id',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }
}
