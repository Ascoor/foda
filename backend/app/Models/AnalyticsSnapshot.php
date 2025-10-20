<?php

namespace App\Models;

use App\Models\ElectionCircle\Campaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'metric',
        'value',
        'captured_at',
        'comparison_value',
        'metadata',
    ];

    protected $casts = [
        'captured_at' => 'datetime',
        'value' => 'decimal:4',
        'comparison_value' => 'decimal:4',
        'metadata' => 'array',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
