<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['campaign_id','name','area_id','supervisor_id','meta'];
    protected $casts = ['meta'=>'array'];

    public function campaign(){ return $this->belongsTo(Campaign::class); }
    public function area(){ return $this->belongsTo(Area::class); }
    public function supervisor(){ return $this->belongsTo(User::class, 'supervisor_id'); }

    // إن أردت الحصول على الفعاليات التابعة للفريق:
    public function events(){ return $this->hasMany(Event::class); }
}
