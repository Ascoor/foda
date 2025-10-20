<?php

namespace App\Models;

use App\Models\ElectionCircle\Campaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'name',
        'description',
        'x',
        'y',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function swots(): MorphMany
    {
        return $this->morphMany(Swot::class, 'entity');
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function voters(): HasMany
    {
        return $this->hasMany(Voter::class);
    }
}
