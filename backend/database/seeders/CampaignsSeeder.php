<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Campaign;

class CampaignsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name'                => 'حملة القاهرة الكبرى',
                'slug'                => 'cairo-campaign',
                'geographic_strategy' => 'city',
                'status'              => 'active',
                'start_date'          => now()->toDateString(),
                'end_date'            => now()->addDays(60)->toDateString(),
                'poll_date'           => now()->addDays(30),
            ],
            [
                'name'                => 'حملة الإسكندرية',
                'slug'                => 'alex-campaign',
                'geographic_strategy' => 'city',
                'status'              => 'active',
                'start_date'          => now()->addDays(7)->toDateString(),
                'end_date'            => now()->addDays(75)->toDateString(),
                'poll_date'           => now()->addDays(45),
            ],
        ];

        foreach ($data as $row) {
            Campaign::firstOrCreate(['slug' => $row['slug']], $row);
        }
    }
}
