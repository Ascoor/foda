<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    { 
        $supervisors = User::all();

        if ($supervisors->isEmpty()) {
            $supervisors = User::factory()->count(3)->create();
        }

        Area::all()->each(function ($area) use ($supervisors) {
            Team::factory()
                ->count(3)
                ->create([
                    'area_id' => $area->id,
                    'supervisor_id' => $supervisors->random()->id,
                ]);
        });

    }
}
