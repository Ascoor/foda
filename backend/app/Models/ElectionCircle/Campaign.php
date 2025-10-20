<?php

namespace App\Models\ElectionCircle;

use App\Models\Activity;
use App\Models\AnalyticsSnapshot;
use App\Models\Area;
use App\Models\Event;
use App\Models\Finance;
use App\Models\Team;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'election_id',
        'candidate_id',
        'geo_area_id',
        'name',
        'slug',
        'slogan',
        'description',
        'start_date',
        'end_date',
        'status',
        'budget',
        'target_votes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
    ];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function geoArea(): BelongsTo
    {
        return $this->belongsTo(GeoArea::class);
    }

    public function areas(): HasMany
    {
        return $this->hasMany(Area::class);
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function volunteers(): HasMany
    {
        return $this->hasMany(Volunteer::class);
    }

    public function voters(): HasMany
    {
        return $this->hasMany(Voter::class);
    }

    public function committees(): HasMany
    {
        return $this->hasMany(Committee::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function finances(): HasMany
    {
        return $this->hasMany(Finance::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function analyticsSnapshots(): HasMany
    {
        return $this->hasMany(AnalyticsSnapshot::class);
    }
}
