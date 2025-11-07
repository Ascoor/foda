<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Campaign;
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
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();
        $user = User::factory()->create();

        $area = Area::factory()->create();

        $team = Team::factory()->create([
            'campaign_id' => $campaign->id,
            'area_id' => $area->id,
            'supervisor_id' => $user->id,
        ]);

        Volunteer::create([
            'name' => 'Demo Volunteer',
            'campaign_id' => $team->campaign_id,
            'team_id' => $team->id,
        ]);

        Voter::factory()->create([
            'campaign_id' => $team->campaign_id,
            'area_id' => $area->id,
            'created_at' => now()->subMonth(),
            'updated_at' => now()->subMonth(),
        ]);

        Voter::factory()->create([
            'campaign_id' => $team->campaign_id,
            'area_id' => $area->id,
        ]);

        Event::factory()->create([
            'campaign_id' => $team->campaign_id,
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);
    }
}

