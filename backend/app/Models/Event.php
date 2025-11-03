<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use App\Models\Concerns\WithinCampaignWindow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory;
    use BelongsToCampaign;
    use WithinCampaignWindow;

    protected string $dateColumn = 'date';

    protected $fillable = [
        'campaign_id',
        'area_id',
        'team_id',
        'name',
        'description',
        'organiser',
        'location',
        'date',
        'meta',
    ];

    protected $casts = [
        'date' => 'datetime',
        'meta' => 'array',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
