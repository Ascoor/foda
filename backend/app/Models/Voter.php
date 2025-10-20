<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voter extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'area_id',
        'committee_id',
        'address',
        'sex',
        'birthdate',
        'age',
        'bloodgroup',
        'img_url',
        'ion_user_id',
        'voter_id',
        'add_date',
        'support_status',
        'last_contact_at',
        'notes',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'add_date' => 'date',
        'last_contact_at' => 'datetime',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
