<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Observation extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'committee_id',
        'volunteer_id',
        'recorded_at',
        'meta',
        'notes',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'meta' => 'array',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function committee(): R\BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function volunteer(): R\BelongsTo
    {
        return $this->belongsTo(Volunteer::class);
    }
}
