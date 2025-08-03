<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voter extends Model
{
    protected $fillable = ['name', 'national_id', 'address', 'committee_id'];

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }
}
