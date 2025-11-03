<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Committee;
use App\Models\GeoArea;
use Illuminate\Database\Seeder;

class CommitteeSeeder extends Seeder
{
    public function run(): void
    {
        if (GeoArea::count() === 0) {
            $this->call(GeoAreaSeeder::class);
        }

        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();

        GeoArea::query()->each(function (GeoArea $geoArea, int $index) use ($campaign): void {
            Committee::query()->updateOrCreate(
                [
                    'campaign_id' => $campaign->id,
                    'code' => 'COM-' . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                ],
                [
                    'name' => 'لجنة ' . ($index + 1),
                    'location' => 'موقع اللجنة ' . ($index + 1),
                    'geo_area_id' => $geoArea->id,
                ]
            );
        });
    }
}
