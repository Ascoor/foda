<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'area_id',
        'team_id',
        'title',
        'description',
        'starts_at',
        'ends_at',
        'location',
        'meta',
    ];

    protected $casts = [
        'location' => 'array',
        'meta' => 'array',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function area(): R\BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function team(): R\BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
