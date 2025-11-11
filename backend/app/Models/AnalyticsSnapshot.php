<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalyticsSnapshot extends Model
{
    use HasFactory;

    protected $fillable = ['campaign_id','metric_key','snapshot_date','payload','forecast_value'];

    protected $casts = [
        'snapshot_date' => 'date',
        'payload' => 'array',
    ];

    public function campaign(){ return $this->belongsTo(Campaign::class); }

    public function scopeInCampaign($q, $campaignId){ return $q->where('campaign_id', $campaignId); }
}
