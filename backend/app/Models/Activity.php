<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'area_id',
        'committee_id',
        'voter_id',
        'created_by',
        'type',
        'status',
        'location',
        'support_score',
        'reported_at',
        'payload',
    ];

    protected $casts = [
        'location' => 'array',
        'payload' => 'array',
        'reported_at' => 'datetime',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function area(): R\BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function committee(): R\BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function voter(): R\BelongsTo
    {
        return $this->belongsTo(Voter::class);
    }

    public function creator(): R\BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
