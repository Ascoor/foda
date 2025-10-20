<?php

namespace App\Models;

use App\Models\ElectionCircle\GeoArea;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Volunteer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'email', 'phone', 'team_id', 'active', 'assigned_area_id'];

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
