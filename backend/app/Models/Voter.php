<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Voter extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'area_id',
        'address',
        'sex',
        'birthdate',
        'age',
        'bloodgroup',
        'img_url',
        'ion_user_id',
        'voter_id',
        'add_date',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
