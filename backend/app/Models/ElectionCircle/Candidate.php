<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany, HasOne};

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'election_id',
        'full_name',
        'slug',
        'party',
        'biography',
        'photo_path',
    ];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }

    public function campaign(): HasOne
    {
        return $this->hasOne(Campaign::class);
    }

    public function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }

    public function volunteers(): HasMany
    {
        return $this->hasMany(Volunteer::class);
    }
}
