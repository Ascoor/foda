<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $supervisors = User::query()->get();

        if ($supervisors->isEmpty()) {
            $supervisors = User::factory()->count(10)->create();
        }

        Campaign::with('areas')->each(function (Campaign $campaign) use ($supervisors) {
            $areas = $campaign->areas;
            if ($areas->isEmpty()) {
                return;
            }

            foreach (['تنظيم', 'ميداني', 'إعلامي'] as $focus) {
                $area = $areas->random();
                Team::factory()->create([
                    'campaign_id' => $campaign->id,
                    'name' => 'فريق ' . $focus . ' ' . $campaign->geoArea?->name,
                    'area_id' => $area->id,
                    'supervisor_id' => $supervisors->random()->id,
                ]);
            }
        });
    }
}
