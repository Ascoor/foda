<?php

namespace Database\Factories;

use App\Enums\ElectionPhase;
use App\Models\Campaign;
use App\Models\Election;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Election>
 */
class ElectionFactory extends Factory
{
    protected $model = Election::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 month', '+2 months');
        $end = (clone $start)->modify('+7 days');

        return [
            'campaign_id' => Campaign::factory(),
            'name' => $this->faker->bs(),
            'cover_url' => $this->faker->imageUrl(640, 480, 'election', true, 'ballot'),
            'phase' => $this->faker->randomElement(ElectionPhase::values()),
            'start_at' => $start,
            'end_at' => $end,
        ];
    }
}
