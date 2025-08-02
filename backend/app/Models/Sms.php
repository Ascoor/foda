<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sms extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'message',
        'recipient',
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
