<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    protected $fillable = ['name', 'description', 'election_id'];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }
}
