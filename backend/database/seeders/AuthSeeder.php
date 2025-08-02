<?php

namespace Database\Seeders;

use App\Models\Auth;
use Illuminate\Database\Seeder;

class AuthSeeder extends Seeder
{
    public function run(): void
    {
        Auth::create();
    }
}
