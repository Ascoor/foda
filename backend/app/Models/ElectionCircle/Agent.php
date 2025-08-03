<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agent extends Model
{
    protected $fillable = ['name', 'candidate_id', 'committee_id'];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }
}
