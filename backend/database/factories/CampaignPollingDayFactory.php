<?php

namespace Database\Factories;

use App\Models\CampaignPollingDay;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class CampaignPollingDayFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = CampaignPollingDay::class;

    public function definition(): array
    {
        return [
            'campaign_id' => $this->resolveCampaignId(),
            'date' => Carbon::now()->addDays($this->faker->numberBetween(1, 30)),
            'notes' => $this->faker->sentence(),
        ];
    }
}
