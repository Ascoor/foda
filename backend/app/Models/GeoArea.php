<?php

namespace App\Models;

use App\Models\ElectionCircle\GeoArea as BaseGeoArea;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeoArea extends BaseGeoArea
{
    protected $fillable = [
        'parent_id',
        'type',
        'code',
        'name',
        'election_id',
        'created_at',
        'updated_at',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function getIsCircleAttribute(): bool
    {
        return in_array($this->type, ['markaz', 'qesm', 'city'], true);
    }
}
