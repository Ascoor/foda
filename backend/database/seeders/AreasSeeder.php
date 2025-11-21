<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;

class AreasSeeder extends Seeder
{
    public function run(): void
    {
        $govs = [
            'القاهرة' => ['مدينة نصر','المعادي','مصر الجديدة','حلوان','شبرا'],
            'الجيزة' => ['الهرم','الدقي','العجوزة','أكتوبر','بولاق الدكرور'],
            'الإسكندرية' => ['سيدي جابر','العصافرة','محرم بك','المنشية','العجمي'],
        ];

        foreach ($govs as $gov => $districts) {
            $g = Area::firstOrCreate(['name' => $gov, 'type' => 'governorate']);

            foreach ($districts as $d) {
                Area::firstOrCreate(['name' => $d, 'type' => 'city', 'parent_id' => $g->id]);
            }
        }
    }
}
