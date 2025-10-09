<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Committee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'area_id',
        'location',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
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
