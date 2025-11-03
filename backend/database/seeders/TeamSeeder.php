<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Campaign;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $supervisors = User::query()->get();
        if ($supervisors->isEmpty()) {
            $supervisors = collect([User::factory()->create()]);
        }

        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();

        Area::query()->each(function (Area $area) use ($supervisors, $campaign): void {
            Team::factory()->count(3)->create([
                'campaign_id' => $campaign->id,
                'area_id' => $area->id,
                'supervisor_id' => $supervisors->random()->id,
            ]);
        });
    }
}
