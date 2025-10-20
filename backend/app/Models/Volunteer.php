<?php

namespace App\Models;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Volunteer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'campaign_id',
        'team_id',
        'assigned_area_id',
        'full_name',
        'email',
        'phone',
        'is_active',
        'joined_at',
        'last_assigned_at',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'joined_at' => 'datetime',
        'last_assigned_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function assignedArea(): BelongsTo
    {
        return $this->belongsTo(GeoArea::class, 'assigned_area_id');
    }

    public function swots(): MorphMany
    {
        return $this->morphMany(Swot::class, 'entity');
    }
}
