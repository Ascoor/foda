<?php

namespace Database\Factories;

use App\Models\Area;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Area> */
class AreaFactory extends Factory
{
    protected $model = Area::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->city(),
            'description' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(['governorate', 'center', 'city', 'district']),
            'code' => strtoupper($this->faker->lexify('AR-????')),
            'x' => $this->faker->latitude(16.0, 32.0),
            'y' => $this->faker->longitude(34.0, 55.0),
            'meta' => ['population' => $this->faker->numberBetween(1000, 500000)],
        ];
    }
}
