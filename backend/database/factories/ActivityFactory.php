<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Area;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition(): array
    {
        $latitude = $this->faker->latitude(21.7, 31.3);
        $longitude = $this->faker->longitude(25.0, 35.0);

        return [
            'area_id' => Area::factory(),
            'committee_id' => null,
            'created_by' => User::factory(),
            'type' => $this->faker->randomElement(['turnout', 'logistics', 'support', 'incident']),
            'status' => $this->faker->randomElement(['open', 'in_progress', 'resolved']),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'latitude' => $latitude,
            'longitude' => $longitude,
            'support_score' => $this->faker->numberBetween(0, 100),
            'reported_at' => $this->faker->dateTimeBetween('-10 days', 'now'),
            'meta' => [
                'source' => $this->faker->randomElement(['agent', 'voter', 'system']),
            ],
        ];
    }
}
