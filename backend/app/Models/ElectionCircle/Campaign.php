<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'election_id',
        'governorate_id',
        'district_id',
        'circle_id',
    ];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }
}
