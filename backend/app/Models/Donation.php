<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'category_id',
        'donor_name',
        'donor_contact',
        'amount',
        'donated_at',
        'reference',
        'notes',
        'meta',
    ];

    protected $casts = [
        'donated_at' => 'date',
        'meta' => 'array',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function category()
    {
        return $this->belongsTo(DonationCategory::class, 'category_id');
    }
}
