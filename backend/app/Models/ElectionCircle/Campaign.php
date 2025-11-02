<?php

namespace App\Models\ElectionCircle;

use App\Models\Activity;
use App\Models\AutomationTask;
use App\Models\Event;
use App\Models\Finance;
use App\Models\Notification;
use App\Models\Sms;
use App\Models\SmsSetting;
use App\Models\Swot;
use App\Models\Team;
use App\Models\Volunteer;
use App\Models\Voter as AppVoter;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'election_id'];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }

    public function committees(): HasMany
    {
        return $this->hasMany(Committee::class);
    }

    public function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }

    public function voters(): HasMany
    {
        return $this->hasMany(AppVoter::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function finances(): HasMany
    {
        return $this->hasMany(Finance::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function swots(): HasMany
    {
        return $this->hasMany(Swot::class);
    }

    public function sms(): HasMany
    {
        return $this->hasMany(Sms::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function automationTasks(): HasMany
    {
        return $this->hasMany(AutomationTask::class);
    }

    public function smsSettings(): HasMany
    {
        return $this->hasMany(SmsSetting::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\User::class, 'campaign_user')
            ->withPivot(['role', 'status', 'permissions'])
            ->withTimestamps();
    }

    public function volunteers(): BelongsToMany
    {
        return $this->belongsToMany(Volunteer::class, 'campaign_volunteer')
            ->withPivot(['assignment', 'shift', 'tags'])
            ->withTimestamps();
    }

    public function geoAreas(): BelongsToMany
    {
        return $this->belongsToMany(GeoArea::class, 'campaign_area')
            ->withPivot(['alias', 'code'])
            ->withTimestamps();
    }
}
