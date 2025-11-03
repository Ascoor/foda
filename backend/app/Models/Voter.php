<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voter extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'committee_id',
        'name',
        'email',
        'phone',
        'area_id',
        'address',
        'sex',
        'birthdate',
        'age',
        'bloodgroup',
        'img_url',
        'ion_user_id',
        'voter_id',
        'voter_uid',
        'national_id',
        'add_date',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'add_date' => 'date',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(\App\Models\ElectionCircle\Committee::class);
    }
}
