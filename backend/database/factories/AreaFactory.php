<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\ElectionCircle\Campaign;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Area> */
class AreaFactory extends Factory
{
    protected $model = Area::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $regions = ['القاهرة', 'الجيزة', 'الإسكندرية', 'أسيوط', 'الدقهلية', 'البحيرة'];
        $district = $this->faker->randomElement(['الزيتون', 'شبرا', 'السيدة زينب', 'الخانكة', 'أبو المطامير', 'سيدي جابر']);

        return [
            'campaign_id' => Campaign::factory(),
            'name' => $this->faker->unique()->randomElement($regions) . ' - ' . $district,
            'description' => $this->faker->sentence(8, true),
            'x' => $this->faker->randomFloat(6, 24.0, 31.0),
            'y' => $this->faker->randomFloat(6, 29.0, 33.0),
        ];
    }
}
