<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'election_id',
        'name',
        'slug',
        'description',
        'starts_at',
        'ends_at',
        'spatial_level',
        'bbox',
        'status',
        'settings',
    ];

    protected $casts = [
        'bbox' => 'array',
        'settings' => 'array',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function election(): R\BelongsTo
    {
        return $this->belongsTo(Election::class);
    }

    public function users(): R\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'campaign_user')
            ->withPivot(['role', 'status', 'permissions'])
            ->withTimestamps();
    }

    public function areas(): R\BelongsToMany
    {
        return $this->belongsToMany(Area::class, 'campaign_area')->withTimestamps();
    }

    public function committees(): R\HasMany
    {
        return $this->hasMany(Committee::class);
    }

    public function teams(): R\HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function volunteers(): R\HasMany
    {
        return $this->hasMany(Volunteer::class);
    }

    public function voters(): R\HasMany
    {
        return $this->hasMany(Voter::class);
    }

    public function events(): R\HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function activities(): R\HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function finances(): R\HasMany
    {
        return $this->hasMany(Finance::class);
    }

    public function analytics(): R\HasMany
    {
        return $this->hasMany(AnalyticsSnapshot::class);
    }
}
