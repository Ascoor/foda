<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Committee;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Database\Seeder;

class CommitteeSeeder extends Seeder
{
    public function run(): void
    {
        if (GeoArea::count() === 0) {
            $this->call(GeoAreaSeeder::class);
        }

        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();

        GeoArea::all()->each(function ($geoArea, $index) use ($campaign) {
            Committee::create([
                'campaign_id' => $campaign->id,
                'name' => 'لجنة ' . ($index + 1),
                'location' => 'موقع اللجنة ' . ($index + 1),
                'geo_area_id' => $geoArea->id,
            ]);
        });
    }
}
