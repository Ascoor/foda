<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Representative extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'campaign_id',
        'geographic_scope_id',
        'committee_id',
        'user_id',
        'name',
        'email',
        'phone',
        'position',
        'assignment_type',
        'status',
        'assigned_at',
        'responsibilities',
        'notes',
    ];

    protected $casts = [
        'assigned_at' => 'date',
        'responsibilities' => 'array',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function geographicScope()
    {
        return $this->belongsTo(GeographicScope::class);
    }

    public function committee()
    {
        return $this->belongsTo(Committee::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
