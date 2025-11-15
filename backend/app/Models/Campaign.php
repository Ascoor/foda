<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
        'start_date',
        'end_date',
        'poll_date',
        'geographic_strategy',
        'geographic_notes',
        'bbox',
    ];

    protected $casts = [
        'bbox' => 'array',
        'geographic_notes' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'poll_date' => 'date',
    ];

    /* Relationships */
    public function users(){ return $this->belongsToMany(User::class, 'campaign_user')->withPivot(['role','status','permissions'])->withTimestamps(); }
    public function areas(){ return $this->belongsToMany(Area::class, 'campaign_area')->withPivot(['alias','local_code'])->withTimestamps(); }
    public function committees(){ return $this->hasMany(Committee::class); }
    public function geographicScopes(){ return $this->hasMany(GeographicScope::class); }
    public function volunteers(){ return $this->hasMany(Volunteer::class); }
    public function representatives(){ return $this->hasMany(Representative::class); }
    public function agents(){ return $this->hasMany(AgentAssignment::class); }
    public function voters(){ return $this->hasMany(Voter::class); }
    public function activities(){ return $this->hasMany(Activity::class); }
    public function events(){ return $this->hasMany(Event::class); }
    public function donations(){ return $this->hasMany(Donation::class); }
    public function expenses(){ return $this->hasMany(Expense::class); }
    public function smsSettings(){ return $this->hasOne(SmsSetting::class); }
    public function smsMessages(){ return $this->hasMany(SmsMessage::class); }
    public function notifications(){ return $this->hasMany(Notification::class); }
    public function automationTasks(){ return $this->hasMany(AutomationTask::class); }
    public function analyticsSnapshots(){ return $this->hasMany(AnalyticsSnapshot::class); }
    public function swots(){ return $this->hasMany(Swot::class); }
    public function donationCategories(){ return $this->hasMany(DonationCategory::class); }
    public function expenseCategories(){ return $this->hasMany(ExpenseCategory::class); }

    /* Scopes */
    public function scopeActive($q){ return $q->where('status','active'); }
}
