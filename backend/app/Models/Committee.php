<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Committee extends Model
{
    use HasFactory;
    use BelongsToCampaign;

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

    public function area(): R\BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function voters(): R\HasMany
    {
        return $this->hasMany(Voter::class);
    }
}
