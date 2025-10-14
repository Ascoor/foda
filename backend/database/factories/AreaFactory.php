<?php

namespace Database\Factories;

use App\Models\Area;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        $regions = ['منطقة الرياض', 'منطقة مكة المكرمة', 'منطقة القصيم', 'منطقة تبوك', 'المنطقة الشرقية'];

        return [
            'name' => $this->faker->unique()->randomElement($regions) . ' - ' . $this->faker->randomElement(['الوسطى', 'الشمالية', 'الجنوبية']),
            'description' => $this->faker->sentence(8),
            'x' => $this->faker->latitude(16.0, 32.0),
            'y' => $this->faker->longitude(34.0, 55.0),
        ];
    }
}
