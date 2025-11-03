<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Volunteer extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'team_id',
        'name',
        'email',
        'phone',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function swots(): MorphMany
    {
        return $this->morphMany(Swot::class, 'entity');
    }

    public function campaigns(): BelongsToMany
    {
        return $this->belongsToMany(Campaign::class, 'campaign_volunteer')
            ->withPivot(['assignment', 'shift', 'tags'])
            ->withTimestamps();
    }

    public function agent(): HasOne
    {
        return $this->hasOne(Agent::class, 'person_id');
    }
}
