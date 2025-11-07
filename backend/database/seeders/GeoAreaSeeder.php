<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Election;
use App\Models\GeoArea;
use Illuminate\Database\Seeder;

class GeoAreaSeeder extends Seeder
{
    public function run(): void
    {
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();
        $election = Election::query()->first() ?? Election::factory()->create();

        GeoArea::query()->updateOrCreate(
            ['campaign_id' => $campaign->id, 'code' => 'GA-001'],
            [
                'election_id' => $election->id,
                'name' => 'الدائرة الأولى',
                'level' => 'city',
                'meta' => ['centroid' => ['lat' => 24.7136, 'lng' => 46.6753]],
            ]
        );

        GeoArea::query()->updateOrCreate(
            ['campaign_id' => $campaign->id, 'code' => 'GA-002'],
            [
                'election_id' => $election->id,
                'name' => 'الدائرة الثانية',
                'level' => 'city',
                'meta' => ['centroid' => ['lat' => 21.3891, 'lng' => 39.8579]],
            ]
        );
    }
}
