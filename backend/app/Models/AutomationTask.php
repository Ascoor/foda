<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class AutomationTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'name',
        'status',
        'last_run_at',
        'config',
    ];

    protected $casts = [
        'last_run_at' => 'datetime',
        'config' => 'array',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
