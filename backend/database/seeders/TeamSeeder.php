<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Team;
use App\Models\ElectionCircle\Campaign;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $supervisors = User::all();
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();

        Area::all()->each(function ($area) use ($supervisors, $campaign) {
            Team::factory()->count(3)->create([
                'campaign_id' => $campaign->id,
                'area_id' => $area->id,
                'supervisor_id' => $supervisors->random()->id,
            ]);
        });

    }
}
