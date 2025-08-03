<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeoArea extends Model
{
    protected $fillable = ['name', 'election_id'];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }

    public function committees(): HasMany
    {
        return $this->hasMany(Committee::class);
    }
}
