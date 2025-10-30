<?php

namespace Database\Factories;

use App\Enums\CampaignStatus;
use App\Models\Area;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Campaign>
 */
class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    public function definition(): array
    {
        return [
            'area_id' => Area::factory(),
            'owner_id' => User::factory(),
            'name' => $this->faker->catchPhrase(),
            'cover_url' => $this->faker->imageUrl(1280, 720, 'politics', true, 'campaign'),
            'status' => $this->faker->randomElement(CampaignStatus::values()),
        ];
    }

    public function active(): self
    {
        return $this->state(fn () => ['status' => CampaignStatus::Active->value]);
    }
}
