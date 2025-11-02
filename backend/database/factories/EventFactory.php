<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\Team;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Event> */
class EventFactory extends Factory
{
    protected $model = \App\Models\Event::class;

    use ResolvesCampaign;

    public function definition(): array
    {
        return [
            'campaign_id' => $this->resolveCampaignId(),
            'event_id' => $this->faker->unique()->uuid(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'organiser' => $this->faker->name(),
            'location' => $this->faker->city(),
            'date' => $this->faker->dateTimeBetween('+1 week', '+1 year'),
            'area_id' => Area::factory(),
            'team_id' => Team::factory(),
        ];
    }
}
