<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Committee;
use Illuminate\Database\Seeder;

class CommitteeSeeder extends Seeder
{
    public function run(): void
    {
        $districts = Area::where('type', 'district')->get();

        foreach ($districts as $district) {
            Committee::factory()->create([
                'area_id' => $district->id,
            ]);

            Committee::factory()->create([
                'area_id' => $district->id,
            ]);
        }
    }
}
