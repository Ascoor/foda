<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
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
            ],
        ];

        foreach ($campaigns as $spec) {
            $unique = Arr::only($spec, ['name', 'starts_at', 'ends_at']);

            Campaign::query()->updateOrCreate(
                $unique,
                array_merge($spec, ['bbox' => Arr::get($spec, 'bbox')])
            );
        }
    }
}
