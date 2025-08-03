<?php

namespace App\Models\ElectionCircle;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ECSetting extends Model
{
    protected $table = 'ec_settings';
    protected $fillable = ['key', 'value', 'election_id'];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }
}
