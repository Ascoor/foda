<?php

namespace Database\Factories;

use App\Models\DonationCategory;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

class DonationCategoryFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = DonationCategory::class;

    public function definition(): array
    {
        return [
            'campaign_id' => $this->resolveCampaignId(),
            'name' => $this->faker->unique()->words(2, true),
            'description' => $this->faker->sentence(),
        ];
    }
}
