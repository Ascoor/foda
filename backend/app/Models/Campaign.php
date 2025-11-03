<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'starts_at',
        'ends_at',
        'spatial_level',
        'bbox',
        'status',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'bbox' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $campaign): void {
            if (! $campaign->slug) {
                $campaign->slug = Str::slug($campaign->name) ?: Str::random(12);
            }
        });
    }

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }

    public function pollingDays(): HasMany
    {
        return $this->hasMany(CampaignPollingDay::class);
    }

    public function voters(): HasMany
    {
        return $this->hasMany(Voter::class);
    }

    public function committees(): HasMany
    {
        return $this->hasMany(Committee::class);
    }

    public function geoAreas(): HasMany
    {
        return $this->hasMany(GeoArea::class);
    }

    public function volunteers(): HasMany
    {
        return $this->hasMany(Volunteer::class);
    }

    public function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }

    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function scopeSearch($query, ?string $term)
    {
        return $query->when($term, function ($q) use ($term) {
            $like = '%' . $term . '%';
            $q->where(function ($inner) use ($like) {
                $inner->where('name', 'like', $like)
                    ->orWhere('description', 'like', $like)
                    ->orWhere('slug', 'like', $like);
            });
        });
    }
}
