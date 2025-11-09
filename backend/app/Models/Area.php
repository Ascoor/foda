<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'level',
        'parent_id',
        'names',
        'meta',
        'centroid',
        'bbox',
    ];

    protected $casts = [
        'names' => 'array',
        'meta' => 'array',
        'centroid' => 'array',
        'bbox' => 'array',
    ];

    public function parent(): R\BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): R\HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function committees(): R\HasMany
    {
        return $this->hasMany(Committee::class);
    }

    public function campaigns(): R\BelongsToMany
    {
        return $this->belongsToMany(Campaign::class, 'campaign_area')->withTimestamps();
    }
}
