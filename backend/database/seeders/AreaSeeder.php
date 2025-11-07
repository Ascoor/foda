<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            [
                'name_ar' => 'المنطقة المركزية',
                'name_en' => 'Central District',
                'type' => 'district',
                'level' => 0,
                'code' => 'AR-1000',
                'coords' => [24.7136, 46.6753],
            ],
            [
                'name_ar' => 'المنطقة الشمالية',
                'name_en' => 'Northern District',
                'type' => 'district',
                'level' => 0,
                'code' => 'AR-2000',
                'coords' => [26.4207, 50.0888],
            ],
        ];

        foreach ($areas as $index => $spec) {
            $nameAr = Arr::get($spec, 'name_ar');
            $nameEn = Arr::get($spec, 'name_en');
            $coords = Arr::get($spec, 'coords', [null, null]);
            $slug = Str::slug($nameEn) ?: Str::slug((string) $nameAr);

            Area::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $nameAr,
                    'name_ar' => $nameAr,
                    'name_en' => $nameEn,
                    'description' => 'منطقة تمهيدية للبيانات الاختبارية.',
                    'type' => Arr::get($spec, 'type'),
                    'level' => Arr::get($spec, 'level', 0),
                    'code' => Arr::get($spec, 'code'),
                    'meta' => [
                        'population' => 100000 + ($index === 0 ? 25000 : 50000),
                    ],
                    'x' => Arr::get($coords, 0),
                    'y' => Arr::get($coords, 1),
                    'lat' => Arr::get($coords, 0),
                    'lng' => Arr::get($coords, 1),
                ]
            );
        }
    }
}
