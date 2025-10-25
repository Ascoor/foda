<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\Event;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $faker = FakerFactory::create('ar_EG');

        Campaign::with(['teams', 'geoArea'])->each(function (Campaign $campaign) use ($faker) {
            $teams = $campaign->teams;
            if ($teams->isEmpty()) {
                return;
            }

            $eventTypes = ['مؤتمر شعبي', 'جولة ميدانية', 'اجتماع فريق', 'ندوة توعية'];

            foreach (range(1, 4) as $index) {
                $team = $teams->random();

                Event::factory()->create([
                    'campaign_id' => $campaign->id,
                    'title' => $eventTypes[$index - 1] . ' في ' . ($campaign->geoArea?->name ?? 'الدائرة'),
                    'event_type' => $eventTypes[$index - 1],
                    'location' => $faker->randomElement([
                        'قاعة الشباب والرياضة',
                        'مركز شباب الحي',
                        'سرادق شارع الجيش',
                        'ميدان الساعة',
                    ]),
                    'geo_area_id' => $campaign->geo_area_id,
                    'starts_at' => now()->addDays($index)->setTime(17, 0),
                    'ends_at' => now()->addDays($index)->setTime(20, 0),
                    'status' => $index % 2 === 0 ? 'scheduled' : 'completed',
                    'description' => $faker->paragraph(3, true),
                    'team_id' => $team->id,
                ]);
            }
        });
    }
}
