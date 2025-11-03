<?php

namespace App\Models\ElectionCircle;

class Campaign extends \App\Models\Campaign
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'election_id',
        'timezone',
        'starts_at',
        'ends_at',
        'spatial_level',
        'admin_areas',
        'spatial_extent',
        'bbox',
        'polling_settings',
        'status',
        'created_by',
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }
}
