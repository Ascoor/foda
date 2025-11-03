<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Observation extends Model
{
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'committee_id',
        'volunteer_id',
        'notes',
        'recorded_at',
        'meta',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'meta' => 'array',
    ];

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(Volunteer::class);
    }
}
