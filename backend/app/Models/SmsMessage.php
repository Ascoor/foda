<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsMessage extends Model
{
    use HasFactory;

    protected $fillable = ['campaign_id','user_id','to','body','status','sent_at','scheduled_for'];

    protected $casts = [
        'sent_at' => 'datetime',
        'scheduled_for' => 'datetime',
    ];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function user(){ return $this->belongsTo(User::class); }

    public function scopeInCampaign($q, $campaignId){ return $q->where('campaign_id', $campaignId); }
}
