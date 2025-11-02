<?php

namespace App\Models\ElectionCircle;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voter extends Model
{
    use BelongsToCampaign;

    protected $fillable = ['campaign_id', 'name', 'national_id', 'address', 'committee_id', 'voter_uid'];

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }
}
