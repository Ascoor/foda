<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Committee extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id','area_id','name','code','location','lat','lng','meta'
    ];

    protected $casts = ['meta' => 'array'];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function area(){ return $this->belongsTo(Area::class); }
    public function agents(){ return $this->hasMany(AgentAssignment::class); }
    public function voters(){ return $this->hasMany(Voter::class); }
    public function activities(){ return $this->hasMany(Activity::class); }

    /* Scopes */
    public function scopeInCampaign($q, $campaignId){ return $q->where('campaign_id', $campaignId); }
    public function scopeSearch($q, $term){
        if(!$term) return $q;
        return $q->where(function($qq) use ($term){
            $qq->where('name','like',"%{$term}%")
               ->orWhere('code','like',"%{$term}%")
               ->orWhere('location','like',"%{$term}%");
        });
    }
}
