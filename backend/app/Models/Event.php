<?php

namespace App\Models;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'campaign_id',
        'title',
        'event_type',
        'location',
        'geo_area_id',
        'starts_at',
        'ends_at',
        'status',
        'description',
        'team_id',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function geoArea(): BelongsTo
    {
        return $this->belongsTo(GeoArea::class, 'geo_area_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
