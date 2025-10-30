<?php

namespace App\Models;

use App\Enums\CampaignStatus;
use Illuminate\Database\Eloquent\Attributes\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'area_id',
        'owner_id',
        'name',
        'cover_url',
        'status',
    ];

    protected $casts = [
        'status' => CampaignStatus::class,
    ];

    protected $with = ['area'];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function elections(): HasMany
    {
        return $this->hasMany(Election::class);
    }

    public function statusLabel(): Attribute
    {
        return Attribute::get(fn () => $this->status->value);
    }
}
