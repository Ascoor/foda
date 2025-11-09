<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Committee extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'area_id',
        'name',
        'code',
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

    public function voters(): R\HasMany
    {
        return $this->hasMany(Voter::class);
    }
}
