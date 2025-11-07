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
        'area_id',
        'name',
        'voter_id',
        'national_id',
        'voter_uid',
        'address',
        'phone',
        'gender',
        'birthdate',
        'meta',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'meta' => 'array',
    ];

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class);
    }

    public function scopeSearch($query, ?string $term)
    {
        return $query->when($term, function ($q) use ($term) {
            $like = '%' . $term . '%';
            $q->where(function ($inner) use ($like) {
                $inner->where('name', 'like', $like)
                    ->orWhere('national_id', 'like', $like)
                    ->orWhere('voter_uid', 'like', $like);
            });
        });
    }
}
