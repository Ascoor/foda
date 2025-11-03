<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'election_id',
        'timezone',
        'starts_at',
        'ends_at',
        'spatial_level',
        'admin_areas',
        'spatial_extent',
        'bbox',
        'polling_settings',
        'status',
        'created_by',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'admin_areas' => 'array',
        'spatial_extent' => 'array',
        'bbox' => 'array',
        'polling_settings' => 'array',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function pollingDays(): HasMany
    {
        return $this->hasMany(CampaignPollingDay::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot(['role', 'status', 'permissions'])
            ->withTimestamps();
    }

    public function voters(): HasMany
    {
        return $this->hasMany(Voter::class);
    }

    public function committees(): HasMany
    {
        return $this->hasMany(\App\Models\ElectionCircle\Committee::class);
    }

    public function agents(): HasMany
    {
        return $this->hasMany(\App\Models\ElectionCircle\Agent::class);
    }

    public function volunteers(): BelongsToMany
    {
        return $this->belongsToMany(Volunteer::class, 'campaign_volunteer')
            ->withPivot(['assignment', 'shift', 'tags'])
            ->withTimestamps();
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function finances(): HasMany
    {
        return $this->hasMany(Finance::class);
    }

    public function swots(): HasMany
    {
        return $this->hasMany(Swot::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function sms(): HasMany
    {
        return $this->hasMany(Sms::class);
    }

    public function smsSettings(): HasMany
    {
        return $this->hasMany(SmsSetting::class);
    }

    public function geoAreas(): BelongsToMany
    {
        return $this->belongsToMany(Area::class, 'campaign_area', 'campaign_id', 'area_id')
            ->withPivot(['alias', 'code'])
            ->withTimestamps();
    }

    public function areas(): BelongsToMany
    {
        return $this->geoAreas();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function withinWindow(Carbon $moment = null): bool
    {
        $moment ??= Carbon::now($this->timezone ?? 'UTC')->setTimezone('UTC');

        if ($this->starts_at && $moment->lt($this->starts_at)) {
            return false;
        }

        if ($this->ends_at && $moment->gt($this->ends_at)) {
            return false;
        }

        return true;
    }
}
