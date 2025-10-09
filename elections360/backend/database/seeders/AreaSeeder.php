<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        $governorates = [
            [
                'name' => 'العاصمة',
                'type' => 'governorate',
                'latitude' => 31.963158,
                'longitude' => 35.930359,
                'children' => [
                    ['name' => 'وسط المدينة', 'type' => 'district', 'latitude' => 31.9552, 'longitude' => 35.945],
                    ['name' => 'شمال العاصمة', 'type' => 'district', 'latitude' => 32.0722, 'longitude' => 35.905]
                ],
            ],
            [
                'name' => 'إربد',
                'type' => 'governorate',
                'latitude' => 32.556,
                'longitude' => 35.847,
                'children' => [
                    ['name' => 'إربد الغربية', 'type' => 'district', 'latitude' => 32.55, 'longitude' => 35.84],
                ],
            ],
        ];

        foreach ($governorates as $governorate) {
            $children = $governorate['children'];
            unset($governorate['children']);
            $parent = Area::create($governorate);

            foreach ($children as $child) {
                $parent->children()->create($child);
            }
        }
    }
}
