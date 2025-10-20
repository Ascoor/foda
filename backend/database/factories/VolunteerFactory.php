<?php

namespace Database\Factories;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\GeoArea;
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
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        return [
            'campaign_id' => Campaign::factory(),
            'team_id' => $this->resolveTeamId(),
            'assigned_area_id' => $this->resolveGeoAreaId(),
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => '01' . $this->faker->numerify('0########'),
            'is_active' => $this->faker->boolean(85),
            'joined_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'last_assigned_at' => $this->faker->optional(0.7)->dateTimeBetween('-2 months', 'now'),
            'notes' => $this->faker->sentence(6, true),
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

    protected function resolveGeoAreaId(): ?int
    {
        return GeoArea::query()->inRandomOrder()->value('id');
    }
}

