<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    protected $fillable = [
        'name',
        'guard_name',
        'scope',
        'permissions_json',
        'auto_assign_rules',
    ];

    protected $casts = [
        'permissions_json' => 'array',
        'auto_assign_rules' => 'array',
    ];
}

