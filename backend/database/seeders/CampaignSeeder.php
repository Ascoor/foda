<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Election;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $election = Election::query()->first() ?? Election::factory()->create();

        $campaigns = [
            [
                'name' => 'حملة التوعية الوطنية',
                'slug' => 'national-awareness',
                'description' => 'حملة وطنية لرفع الوعي بالمشاركة الانتخابية.',
                'starts_at' => Carbon::parse('2025-01-01'),
                'ends_at' => Carbon::parse('2025-03-31'),
                'spatial_level' => 'governorate',
                'bbox' => [29.9, 30.5, 31.2, 32.1],
                'status' => 'active',
                'election_id' => $election->id,
            ],
            [
                'name' => 'حملة الدقهلية',
                'slug' => 'dakahlia-campaign',
                'description' => 'حملة تغطي جميع مناطق محافظة الدقهلية.',
                'starts_at' => Carbon::parse('2025-02-01'),
                'ends_at' => Carbon::parse('2025-04-30'),
                'spatial_level' => 'city',
                'bbox' => [31.0, 31.2, 31.3, 31.5],
                'status' => 'planned',
                'election_id' => $election->id,
            ],
        ];

        foreach ($campaigns as $spec) {
            $unique = Arr::only($spec, ['name', 'starts_at', 'ends_at']);

            Campaign::query()->updateOrCreate($unique, [
                'slug' => Arr::get($spec, 'slug'),
                'description' => Arr::get($spec, 'description'),
                'starts_at' => Arr::get($spec, 'starts_at'),
                'ends_at' => Arr::get($spec, 'ends_at'),
                'spatial_level' => Arr::get($spec, 'spatial_level'),
                'bbox' => Arr::get($spec, 'bbox'),
                'status' => Arr::get($spec, 'status'),
                'election_id' => Arr::get($spec, 'election_id'),
            ]);
        }
    }
}
