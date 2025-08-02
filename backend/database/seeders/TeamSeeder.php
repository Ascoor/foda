<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        Team::create(['name' => 'الفريق الأول']);
        Team::create(['name' => 'Team Alpha']);
    }
}
