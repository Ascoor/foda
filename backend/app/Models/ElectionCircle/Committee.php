<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Committee extends Model
{
    protected $fillable = ['name', 'location', 'geo_area_id'];

    public function geoArea(): BelongsTo
    {
        return $this->belongsTo(GeoArea::class);
    }

    public function voters(): HasMany
    {
        return $this->hasMany(Voter::class);
    }

    public function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }

    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class);
    }
}
