<?php

namespace App\Models;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Committee;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voter extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'campaign_id',
        'geo_area_id',
        'committee_id',
        'full_name',
        'national_id',
        'phone',
        'email',
        'address',
        'support_status',
        'last_contact_at',
        'notes',
        'source',
    ];

    protected $casts = [
        'last_contact_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function geoArea(): BelongsTo
    {
        return $this->belongsTo(GeoArea::class, 'geo_area_id');
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }
}
