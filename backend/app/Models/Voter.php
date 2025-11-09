<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Voter extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'area_id',
        'committee_id',
        'full_name',
        'national_id',
        'voter_uid',
        'gender',
        'dob',
        'phone',
        'email',
        'address',
        'meta',
    ];

    protected $casts = [
        'dob' => 'date',
        'meta' => 'array',
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
}
