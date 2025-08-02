<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Team> */
class TeamFactory extends Factory
{
    protected $model = \App\Models\Team::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
        ];
    }
}
