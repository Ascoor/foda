<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'election_id',
        'campaign_id',
        'name',
        'party',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function election(): R\BelongsTo
    {
        return $this->belongsTo(Election::class);
    }

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function agents(): R\HasMany
    {
        return $this->hasMany(Agent::class);
    }
}
