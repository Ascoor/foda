<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Team extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = ['campaign_id', 'name', 'area_id', 'supervisor_id'];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function volunteers(): HasMany
    {
        return $this->hasMany(Volunteer::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function swots(): MorphMany
    {
        return $this->morphMany(Swot::class, 'entity');
    }
}
