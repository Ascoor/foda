<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeographicScope extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'name',
        'level',
        'area_id',
        'parent_id',
        'bbox',
        'meta',
    ];

    protected $casts = [
        'bbox' => 'array',
        'meta' => 'array',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function committees()
    {
        return $this->hasMany(Committee::class);
    }

    public function volunteers()
    {
        return $this->hasMany(Volunteer::class);
    }

    public function representatives()
    {
        return $this->hasMany(Representative::class);
    }
}
