<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\Volunteer;
use Illuminate\Database\Seeder;

class VolunteerSeeder extends Seeder
{
    public function run(): void
    {
        Team::all()->each(function ($team) {
            Volunteer::create([
                'name' => 'متطوع ' . $team->id,
                'team_id' => $team->id,
            ]);
        });
    }
}
