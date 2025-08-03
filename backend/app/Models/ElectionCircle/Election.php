<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Election extends Model
{
    protected $fillable = ['name', 'start_date', 'end_date'];

    public function geoAreas(): HasMany
    {
        return $this->hasMany(GeoArea::class);
    }

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    public function settings(): HasMany
    {
        return $this->hasMany(ECSetting::class);
    }
}
