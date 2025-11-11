<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id','area_id','committee_id','voter_id','created_by','type','status','title','description','lat','lng','support_score','reported_at','meta'
    ];

    protected $casts = [
        'reported_at' => 'datetime',
        'meta' => 'array',
    ];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function committee(){ return $this->belongsTo(Committee::class); }
    public function area(){ return $this->belongsTo(Area::class); }
    public function voter(){ return $this->belongsTo(Voter::class); }
    public function author(){ return $this->belongsTo(User::class, 'created_by'); }

    public function scopeInCampaign($q, $campaignId){ return $q->where('campaign_id', $campaignId); }
    public function scopeFilter($q, array $filters){
        if(isset($filters['type'])) $q->where('type', $filters['type']);
        if(isset($filters['status'])) $q->where('status', $filters['status']);
        if(isset($filters['from'])) $q->where('reported_at','>=',$filters['from']);
        if(isset($filters['to'])) $q->where('reported_at','<=',$filters['to']);
        return $q;
    }
}
