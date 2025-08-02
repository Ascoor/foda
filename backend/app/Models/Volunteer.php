<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Volunteer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'phone', 'team_id'];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
