<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations as R;

class Election extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'election_date',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'election_date' => 'date',
    ];

    public function campaigns(): R\HasMany
    {
        return $this->hasMany(Campaign::class);
    }
}
