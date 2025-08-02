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
            'description' => 'هذه وصف المنطقة الأولى وتشمل بعض المعلومات الجغرافية والسكانية.',
            'x' => 29.98765432,
            'y' => 31.23456789,
        ]);

        Area::create([
            'name' => 'المنطقة الثانية',
            'description' => 'منطقة كبيرة تشتهر بالزراعة وتضم عدداً من القرى الصغيرة.',
            'x' => 28.45678901,
            'y' => 30.87654321,
        ]);

        Area::create([
            'name' => 'المنطقة الثالثة',
            'description' => 'منطقة ساحلية تطل على البحر وتتميز بالمنتجعات السياحية.',
            'x' => 27.12345678,
            'y' => 32.98765432,
        ]);
    }
}
