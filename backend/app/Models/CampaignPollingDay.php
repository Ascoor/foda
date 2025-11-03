<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignPollingDay extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'date',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function campaign(): BelongsTo
    {
        return parent::campaign();
    }
}
