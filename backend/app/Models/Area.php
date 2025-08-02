<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Area extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function swots(): MorphMany
    {
        return $this->morphMany(Swot::class, 'entity');
    }
}
