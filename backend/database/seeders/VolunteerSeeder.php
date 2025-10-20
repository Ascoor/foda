<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\GeoArea;
use App\Models\Team;
use App\Models\Volunteer;
use Illuminate\Database\Seeder;

class VolunteerSeeder extends Seeder
{
    public function run(): void
    {
        $geoAreas = GeoArea::query()->pluck('id');

        Team::with('campaign')->each(function (Team $team) use ($geoAreas) {
            $assignedAreas = $geoAreas->isNotEmpty()
                ? $geoAreas
                : collect([null]);

            Volunteer::factory()
                ->count(rand(6, 12))
                ->create(
                    [
                        'campaign_id' => $team->campaign_id,
                        'team_id' => $team->id,
                        'assigned_area_id' => $assignedAreas->random(),
                    ]
                );
        });
    }
}
