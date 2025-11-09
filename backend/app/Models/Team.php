<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'area_id',
        'supervisor_id',
        'name',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function area(): R\BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function supervisor(): R\BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function volunteers(): R\HasMany
    {
        return $this->hasMany(Volunteer::class);
    }
}
