<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id','name','description','organiser','location','date','area_id','team_id'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function area(){ return $this->belongsTo(Area::class); }

    public function scopeInCampaign($q, $campaignId){ return $q->where('campaign_id', $campaignId); }
}
