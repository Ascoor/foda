<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use App\Models\Concerns\WithinCampaignWindow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    use BelongsToCampaign;
    use WithinCampaignWindow;

    protected function getStartColumn(): string
    {
        return 'date';
    }

    protected function getEndColumn(): string
    {
        return 'date';
    }

    protected $fillable = [
        'campaign_id',
        'event_id',
        'name',
        'description',
        'organiser',
        'location',
        'date',
        'area_id',
        'team_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
