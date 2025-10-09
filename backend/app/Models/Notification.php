<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
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
            get: fn () => match (strtolower($this->type)) {
                'performance' => 'Performance',
                'risk' => 'Risk',
                'field' => 'Field',
                default => ucfirst($this->type),
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
            get: fn () => Carbon::parse($this->created_at)->diffForHumans(),
        );
    }
}
