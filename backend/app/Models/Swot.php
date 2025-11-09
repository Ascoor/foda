<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Swot extends Model
{
    use HasFactory;

    protected $table = 'swots';

    protected $fillable = [
        'campaign_id',
        'entity_type',
        'entity_id',
        'created_by',
        'strengths',
        'weaknesses',
        'opportunities',
        'threats',
    ];

    protected $casts = [
        'strengths' => 'array',
        'weaknesses' => 'array',
        'opportunities' => 'array',
        'threats' => 'array',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function creator(): R\BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
