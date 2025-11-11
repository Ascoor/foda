<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id','committee_id','user_id','active','assigned_at','ended_at','meta'
    ];

    protected $casts = [
        'active' => 'boolean',
        'assigned_at' => 'datetime',
        'ended_at' => 'datetime',
        'meta' => 'array',
    ];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function committee(){ return $this->belongsTo(Committee::class); }
    public function user(){ return $this->belongsTo(User::class); }

    /* Scopes */
    public function scopeActive($q){ return $q->where('active', true); }
    public function scopeInCampaign($q, $campaignId){ return $q->where('campaign_id', $campaignId); }
}
