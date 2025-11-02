<?php

namespace App\Models\ElectionCircle;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agent extends Model
{
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'person_id',
        'committee_id',
        'name',
        'active',
        'assigned_at',
        'ended_at',
        'meta',
    ];

    protected $casts = [
        'active' => 'boolean',
        'assigned_at' => 'date',
        'ended_at' => 'date',
        'meta' => 'array',
    ];

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Volunteer::class, 'person_id');
    }
}
