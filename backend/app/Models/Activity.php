<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use App\Models\Concerns\WithinCampaignWindow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Activity extends Model
{
    use HasFactory;
    use BelongsToCampaign;
    use WithinCampaignWindow;

    protected string $dateColumn = 'reported_at';

    protected $fillable = [
        'campaign_id',
        'area_id',
        'committee_id',
        'voter_id',
        'created_by',
        'type',
        'status',
        'title',
        'description',
        'latitude',
        'longitude',
        'support_score',
        'reported_at',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'reported_at' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float',
        'support_score' => 'integer',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function voter(): BelongsTo
    {
        return $this->belongsTo(Voter::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeForRegion($query, ?int $areaId)
    {
        return $query->when($areaId, fn ($q) => $q->where('area_id', $areaId));
    }

    public function scopeForType($query, ?string $type)
    {
        return $query->when($type, fn ($q) => $q->where('type', $type));
    }

    public function scopeForStatus($query, ?string $status)
    {
        return $query->when($status, fn ($q) => $q->where('status', $status));
    }

    public function scopeBetweenDates($query, ?Carbon $start, ?Carbon $end)
    {
        if ($start) {
            $query->where('reported_at', '>=', $start);
        }

        if ($end) {
            $query->where('reported_at', '<=', $end);
        }

        return $query;
    }
}
