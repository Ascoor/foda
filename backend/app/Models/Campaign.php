<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','slug','spatial_level','starts_at','ends_at','poll_date','bbox','status'
    ];

    protected $casts = [
        'bbox' => 'array',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'poll_date' => 'date',
    ];

    /* Relationships */
    public function users(){ return $this->belongsToMany(User::class, 'campaign_user')->withPivot(['role','status','permissions'])->withTimestamps(); }
    public function areas(){ return $this->belongsToMany(Area::class, 'campaign_area')->withPivot(['alias','local_code'])->withTimestamps(); }
    public function committees(){ return $this->hasMany(Committee::class); }
    public function agents(){ return $this->hasMany(AgentAssignment::class); }
    public function voters(){ return $this->hasMany(Voter::class); }
    public function activities(){ return $this->hasMany(Activity::class); }
    public function events(){ return $this->hasMany(Event::class); }
    public function finances(){ return $this->hasMany(Finance::class); }
    public function smsSettings(){ return $this->hasOne(SmsSetting::class); }
    public function smsMessages(){ return $this->hasMany(SmsMessage::class); }
    public function notifications(){ return $this->hasMany(Notification::class); }
    public function automationTasks(){ return $this->hasMany(AutomationTask::class); }
    public function analyticsSnapshots(){ return $this->hasMany(AnalyticsSnapshot::class); }
    public function swots(){ return $this->hasMany(Swot::class); }

    /* Scopes */
    public function scopeActive($q){ return $q->where('status','active'); }
}
