<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\Volunteer;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Volunteer>
 */
class VolunteerFactory extends Factory
{
    protected $model = Volunteer::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => '05' . $this->faker->numerify('########'),
            'team_id' => $this->resolveTeamId(),
        ];
    }

    protected function resolveTeamId(): int
    {
        $existing = Team::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return Team::factory()->create()->id;
    }
}

