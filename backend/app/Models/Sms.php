<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sms extends Model
{
    protected $fillable = [
        'user_id',
        'message',
        'recipient_phone',
        'status',
        'sent_at',
        'scheduled_for',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'scheduled_for' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
