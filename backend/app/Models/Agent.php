<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agent extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'candidate_id',
        'committee_id',
        'person_id',
        'name',
        'phone',
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

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Volunteer::class, 'person_id');
    }
}
