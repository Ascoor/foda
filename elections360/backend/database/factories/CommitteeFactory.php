<?php

namespace Database\Factories;

use App\Models\Committee;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Committee>
 */
class CommitteeFactory extends Factory
{
    protected $model = Committee::class;

    public function definition(): array
    {
        return [
            'name' => 'لجنة ' . $this->faker->citySuffix(),
            'code' => strtoupper(Str::random(6)),
            'location' => $this->faker->streetAddress(),
        ];
    }
}
