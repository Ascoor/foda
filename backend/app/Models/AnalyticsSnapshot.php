<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'election_id',
        'campaign_id',
        'metric_key',
        'snapshot_date',
        'payload',
        'forecast_value',
    ];

    protected $casts = [
        'payload' => 'array',
        'snapshot_date' => 'date',
        'forecast_value' => 'float',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }
}
