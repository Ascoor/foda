<?php

namespace Database\Factories;

use App\Models\Campaign;
use App\Models\CampaignPollingDay;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\CampaignPollingDay> */
class CampaignPollingDayFactory extends Factory
{
    protected $model = CampaignPollingDay::class;

    public function definition(): array
    {
        return [
            'campaign_id' => Campaign::factory(),
            'date' => $this->faker->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d'),
            'opens_at' => $this->faker->optional()->time('H:i'),
            'closes_at' => $this->faker->optional()->time('H:i'),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
