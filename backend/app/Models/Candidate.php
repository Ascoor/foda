<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidate extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'election_id',
        'campaign_id',
        'name',
        'party',
        'bio',
        'contact',
    ];

    protected $casts = [
        'contact' => 'array',
    ];

    public function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }
}
