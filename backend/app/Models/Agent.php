<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Agent extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'candidate_id',
        'committee_id',
        'full_name',
        'phone',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function candidate(): R\BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function committee(): R\BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }
}
