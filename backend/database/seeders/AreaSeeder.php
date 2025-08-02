<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        Area::create([
            'name' => 'Area 1',
            'description' => 'Florida',
            'x' => '',
            'y' => '',
        ]);

        Area::create([
            'name' => 'Area 2',
            'description' => 'California',
            'x' => '',
            'y' => '',
        ]);
    }
}
