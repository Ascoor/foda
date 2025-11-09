<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Volunteer extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'team_id',
        'area_id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'tags',
        'meta',
    ];

    protected $casts = [
        'tags' => 'array',
        'meta' => 'array',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function team(): R\BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function area(): R\BelongsTo
    {
        return $this->belongsTo(Area::class);
    }
}
