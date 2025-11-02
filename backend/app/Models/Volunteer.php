<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Volunteer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'phone', 'team_id'];

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
        return $this->belongsToMany(\App\Models\ElectionCircle\Campaign::class, 'campaign_volunteer')
            ->withPivot(['assignment', 'shift', 'tags'])
            ->withTimestamps();
    }

    public function agent(): HasOne
    {
        return $this->hasOne(\App\Models\ElectionCircle\Agent::class, 'person_id');
    }
}
