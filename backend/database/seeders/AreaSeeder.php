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
            'x' => '',
            'y' => '',
        ]);

        Area::create([
            'name' => 'المنطقة الثانية',
            'description' => 'وصف للمنطقة الثانية',
            'x' => '',
            'y' => '',
        ]);
    }
}
