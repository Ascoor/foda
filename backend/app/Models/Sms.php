<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Sms extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'user_id',
        'to',
        'status',
        'provider_message_id',
        'body',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function user(): R\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
