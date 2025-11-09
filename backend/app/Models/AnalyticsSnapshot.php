<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class AnalyticsSnapshot extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'election_id',
        'key',
        'as_of_date',
        'payload',
        'forecast_value',
    ];

    protected $casts = [
        'as_of_date' => 'date',
        'payload' => 'array',
    ];

    public function election(): R\BelongsTo
    {
        return $this->belongsTo(Election::class);
    }
}
