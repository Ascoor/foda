<?php

namespace Database\Factories;

use App\Models\Area;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/** @extends Factory<\App\Models\Area> */
class AreaFactory extends Factory
{
    protected $model = Area::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $regions = [
            ['ar' => 'منطقة الرياض', 'en' => 'Riyadh Region'],
            ['ar' => 'منطقة مكة المكرمة', 'en' => 'Makkah Region'],
            ['ar' => 'منطقة القصيم', 'en' => 'Qassim Region'],
            ['ar' => 'منطقة تبوك', 'en' => 'Tabuk Region'],
            ['ar' => 'المنطقة الشرقية', 'en' => 'Eastern Province'],
        ];

        $suffix = $this->faker->randomElement(['الوسطى', 'الشمالية', 'الجنوبية']);
        $region = Arr::random($regions);
        $nameAr = trim($region['ar'] . ' - ' . $suffix);
        $nameEn = trim($region['en'] . ' - ' . Str::title($this->faker->randomElement(['central', 'north', 'south'])));
        $slugBase = Str::slug($nameEn) ?: Str::slug($nameAr);
        $slug = trim($slugBase . '-' . $this->faker->unique()->numberBetween(100, 999), '-');

        $lat = $this->faker->latitude(16.0, 32.0);
        $lng = $this->faker->longitude(34.0, 55.0);

        return [
            'name' => $nameAr,
            'name_ar' => $nameAr,
            'name_en' => $nameEn,
            'slug' => $slug,
            'type' => $this->faker->randomElement(['region', 'governorate', 'district']),
            'level' => $this->faker->numberBetween(0, 2),
            'parent_id' => null,
            'code' => strtoupper($this->faker->unique()->lexify('AR-????')),
            'description' => $this->faker->sentence(8),
            'meta' => [
                'population' => $this->faker->numberBetween(50000, 5000000),
                'notes' => $this->faker->sentence(6),
            ],
            'x' => $lat,
            'y' => $lng,
            'lat' => $lat,
            'lng' => $lng,
        ];
    }
}
