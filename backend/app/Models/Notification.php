<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Notification extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'user_id',
        'type',
        'title',
        'message',
        'priority',
        'meta',
        'read_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'read_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUnread(Builder $query): Builder
    {
        return $query->whereNull('read_at');
    }

    public function markAsRead(): void
    {
        if ($this->read_at) {
            return;
        }

        $this->forceFill([
            'read_at' => now(),
        ])->save();
    }

    protected function category(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!filled($this->type)) {
                    return null;
                }

                $type = strtolower($this->type);

                return match ($type) {
                    'performance' => 'Performance',
                    'risk' => 'Risk',
                    'field' => 'Field',
                    default => ucfirst($this->type),
                };
            }
        );
    }

    protected function isHighPriority(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->priority === 'high'
        );
    }

    protected function createdAgo(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->created_at
                ? Carbon::parse($this->created_at)->diffForHumans()
                : null,
        );
    }
}
