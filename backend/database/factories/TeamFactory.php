<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeamFactory extends Factory
{
    protected $model = Team::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'area_id' => Area::factory(),
            'supervisor_id' => User::factory(),
        ];
    }
}

