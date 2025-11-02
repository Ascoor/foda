<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Event;
use App\Models\Team;
use App\Models\ElectionCircle\Campaign;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $area = Area::first() ?? Area::factory()->create();
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();
        $team = Team::first() ?? Team::factory()->create(['campaign_id' => $campaign->id]);
        $campaignId = $team->campaign_id ?? $campaign->id;

        Event::factory()->create([
            'campaign_id' => $campaignId,
            'name' => 'لقاء تعريفي',
            'description' => 'فعالية تعريفية للمتطوعين الجدد',
            'organiser' => 'منظم 1',
            'location' => 'الرياض',
            'date' => now()->addDays(5),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        Event::factory()->create([
            'campaign_id' => $campaignId,
            'name' => 'Kickoff Meeting',
            'description' => 'Kickoff for the upcoming campaign',
            'organiser' => 'Organizer 1',
            'location' => 'New York',
            'date' => now()->addDays(10),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);
    }
}
