<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Committee;
use App\Models\ElectionCircle\GeoArea;
use App\Models\User;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class CommitteeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = FakerFactory::create('ar_EG');

        $supervisors = User::query()->where('email', 'like', '%campaign%')->get();
        if ($supervisors->isEmpty()) {
            $supervisors = User::factory()->count(6)->create();
        }

        Campaign::with('areas', 'geoArea')->each(function (Campaign $campaign) use ($faker, $supervisors) {
            foreach ($campaign->areas as $area) {
                $districtName = Arr::last(explode(' - ', $area->name));

                $districtArea = GeoArea::query()->firstOrCreate(
                    [
                        'name' => $districtName,
                        'level' => 'district',
                        'parent_id' => $campaign->geo_area_id,
                    ],
                    [
                        'code' => $campaign->slug . '-dist-' . $area->id,
                        'full_path' => $campaign->geoArea?->full_path . '/' . $districtName,
                    ]
                );

                foreach (range(1, 2) as $index) {
                    Committee::factory()->create([
                        'campaign_id' => $campaign->id,
                        'geo_area_id' => $districtArea->id,
                        'supervisor_id' => $supervisors->random()->id,
                        'name' => 'لجنة ' . $districtArea->name . ' رقم ' . $index,
                        'code' => strtoupper($campaign->slug) . '-C' . $area->id . $index,
                        'voters_count' => $faker->numberBetween(1800, 4200),
                        'notes' => 'لجنة فرعية تستقبل الناخبين من ' . $districtArea->name,
                    ]);
                }
            }
        });
    }
}
