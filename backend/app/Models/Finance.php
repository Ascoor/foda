<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Finance extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'category_id',
        'amount',
        'type',
        'txn_date',
        'description',
        'external_ref',
        'meta',
    ];

    protected $casts = [
        'txn_date' => 'date',
        'meta' => 'array',
    ];

    public function campaign(): R\BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function category(): R\BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class, 'category_id');
    }
}
