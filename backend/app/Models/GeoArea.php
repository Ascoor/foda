<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeoArea extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'election_id',
        'campaign_id',
        'name',
        'level',
        'parent_id',
        'code',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function committees(): HasMany
    {
        return $this->hasMany(Committee::class);
    }
}
