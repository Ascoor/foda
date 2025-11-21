<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'type', 'parent_id', 'code', 'x', 'y', 'meta',
    ];

    protected $casts = ['meta' => 'array'];

    public function parent()
    {
        return $this->belongsTo(Area::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Area::class, 'parent_id');
    }

    public function committees()
    {
        return $this->hasMany(Committee::class);
    }

    public function geographicScopes()
    {
        return $this->hasMany(GeographicScope::class);
    }

    public function getDisplayNameAttribute()
    {
        return $this->name ?? ('Area #' . $this->id);
    }
}
