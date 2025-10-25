<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\GeoArea;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        $faker = FakerFactory::create('ar_EG');

        $areaTemplates = [
            'cairo-education-first' => [
                ['name' => 'القاهرة - المطرية', 'district' => 'المطرية'],
                ['name' => 'القاهرة - عين شمس الشرقية', 'district' => 'عين شمس'],
                ['name' => 'القاهرة - المرج الجديدة', 'district' => 'المرج'],
            ],
            'giza-women-empowerment' => [
                ['name' => 'الجيزة - بولاق الدكرور', 'district' => 'بولاق الدكرور'],
                ['name' => 'الجيزة - إمبابة', 'district' => 'إمبابة'],
                ['name' => 'الجيزة - الوراق', 'district' => 'الوراق'],
            ],
            'alexandria-harbor-revival' => [
                ['name' => 'الإسكندرية - بحري والأنفوشي', 'district' => 'الأنفوشي'],
                ['name' => 'الإسكندرية - سيدي جابر', 'district' => 'سيدي جابر'],
                ['name' => 'الإسكندرية - المنتزه أول', 'district' => 'المنتزه'],
            ],
        ];

        Campaign::all()->each(function (Campaign $campaign) use ($areaTemplates, $faker) {
            $templates = $areaTemplates[$campaign->slug] ?? [];

            foreach ($templates as $template) {
                $area = Area::factory()->create([
                    'campaign_id' => $campaign->id,
                    'name' => $template['name'],
                    'description' => 'منطقة رئيسية للحملة تضم لقاءات ميدانية ولجان فرعية.',
                    'x' => $faker->randomFloat(6, 24.0, 31.5),
                    'y' => $faker->randomFloat(6, 29.0, 33.5),
                ]);

                GeoArea::query()->firstOrCreate(
                    [
                        'name' => $template['district'],
                        'level' => 'district',
                        'parent_id' => $campaign->geo_area_id,
                    ],
                    [
                        'code' => $campaign->slug . '-' . $template['district'],
                        'full_path' => $campaign->geoArea?->full_path . '/' . $template['district'],
                    ]
                );
            }
        });
    }
}
