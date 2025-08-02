<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        Area::create([
            'name' => 'المنطقة الأولى',
            'description' => 'وصف للمنطقة الأولى',
            'x' => 24.7136,
            'y' => 46.6753,
        ]);

        Area::create([
            'name' => 'المنطقة الثانية',
            'description' => 'وصف للمنطقة الثانية',
            'x' => 21.3891,
            'y' => 39.8579,
        ]);
    }
}
