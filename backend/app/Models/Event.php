<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    use BelongsToCampaign;

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
