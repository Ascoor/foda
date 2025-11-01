<?php

namespace App\Models;

use App\Models\ElectionCircle\Campaign as BaseCampaign;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Campaign extends BaseCampaign
{
    protected $fillable = [
        'name',
        'description',
        'election_id',
        'status',
        'budget',
        'created_at',
        'updated_at',
    ];

    public function committees(): BelongsToMany
    {
        return $this->belongsToMany(Committee::class, 'campaign_committees')
            ->withPivot(['target_voters', 'agent_quota', 'notes'])
            ->withTimestamps();
    }
}
