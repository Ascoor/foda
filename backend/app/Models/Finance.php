<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Finance extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id','category_id','trx_type','amount','date','reference','description','meta'
    ];

    protected $casts = [
        'date' => 'date',
        'meta' => 'array',
    ];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function category(){ return $this->belongsTo(ExpenseCategory::class, 'category_id'); }

    public function scopeInCampaign($q, $campaignId){ return $q->where('campaign_id', $campaignId); }
    public function scopeForMonth($q, $month){ return $q->whereMonth('date', $month); }
}
