<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Committee extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'geo_area_id',
        'name',
        'location',
        'code',
    ];

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
}
