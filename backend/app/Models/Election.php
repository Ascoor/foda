<?php

namespace App\Models;

use App\Enums\ElectionPhase;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Election extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'name',
        'cover_url',
        'phase',
        'start_at',
        'end_at',
    ];

    protected $casts = [
        'phase' => ElectionPhase::class,
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];

    protected $with = ['campaign'];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
