<?php

namespace App\Models;

use App\Models\ElectionCircle\Campaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'volunteer_id',
        'voter_id',
        'activity_type',
        'status',
        'channel',
        'performed_at',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'performed_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(Volunteer::class);
    }

    public function voter(): BelongsTo
    {
        return $this->belongsTo(Voter::class);
    }
}
