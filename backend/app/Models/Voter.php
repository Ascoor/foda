<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voter extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id','committee_id','area_id','full_name','national_id','voter_uid','phone','address','gender','birthdate','meta'
    ];

    protected $casts = [
        'meta' => 'array',
        'birthdate' => 'date',
    ];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function committee(){ return $this->belongsTo(Committee::class); }
    public function area(){ return $this->belongsTo(Area::class); }
    public function activities(){ return $this->hasMany(Activity::class); }

    public function scopeInCampaign($q, $campaignId){ return $q->where('campaign_id', $campaignId); }
    public function scopeSearch($q, $term){
        if(!$term) return $q;
        return $q->where(function($qq) use ($term){
            $qq->where('full_name','like',"%{$term}%")
               ->orWhere('address','like',"%{$term}%")
               ->orWhere('phone','like',"%{$term}%");
        });
    }
}
