<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Event;
use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Database\Seeder;

class HomeSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create();

        $area = Area::factory()->create();

        $team = Team::factory()->create([
            'area_id' => $area->id,
            'supervisor_id' => $user->id,
        ]);

        Volunteer::create([
            'name' => 'Demo Volunteer',
            'team_id' => $team->id,
        ]);

        Voter::factory()->create([
            'created_at' => now()->subMonth(),
            'updated_at' => now()->subMonth(),
        ]);

        Voter::factory()->create();

        Event::factory()->create([
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);
    }
}

