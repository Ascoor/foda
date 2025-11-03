<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\GeoArea;
use Illuminate\Database\Seeder;

class GeoAreaSeeder extends Seeder
{
    public function run(): void
    {
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();

        GeoArea::query()->updateOrCreate(
            ['campaign_id' => $campaign->id, 'code' => 'GA-001'],
            ['name' => 'الدائرة الأولى', 'level' => 'city']
        );

        GeoArea::query()->updateOrCreate(
            ['campaign_id' => $campaign->id, 'code' => 'GA-002'],
            ['name' => 'الدائرة الثانية', 'level' => 'city']
        );
    }
}
