<?php

namespace Database\Seeders;

use App\Models\AnalyticsSnapshot;
use App\Models\ElectionCircle\Campaign;
use Illuminate\Database\Seeder;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        Campaign::all()->each(function (Campaign $campaign) {
            AnalyticsSnapshot::factory()->count(4)->create([
                'campaign_id' => $campaign->id,
            ]);
        });
    }
}
