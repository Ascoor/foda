<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Swot extends Model
{
    use HasFactory;

    protected $fillable = ['campaign_id','entity_type','entity_id','strengths','weaknesses','opportunities','threats','created_by'];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function author(){ return $this->belongsTo(User::class, 'created_by'); }
}
