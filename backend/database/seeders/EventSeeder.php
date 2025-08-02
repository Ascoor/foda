<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Area;
use App\Models\Team;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $area = Area::first() ?? Area::factory()->create();
        $team = Team::first() ?? Team::factory()->create();

        Event::factory()->create([
            'name' => 'لقاء تعريفي',
            'description' => 'فعالية تعريفية للمتطوعين الجدد',
            'organiser' => 'منظم 1',
            'location' => 'الرياض',
            'date' => now()->addDays(5),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        Event::factory()->create([
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
