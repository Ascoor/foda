<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsSetting extends Model
{
    use HasFactory;

    protected $fillable = ['campaign_id','provider','api_key','sender_id','meta'];
    protected $casts = ['meta' => 'array'];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
}
