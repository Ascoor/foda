<?php

namespace Database\Factories;

use App\Models\Donation;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Donation> */
class DonationFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Donation::class;

    public function definition(): array
    {
        $campaign = $this->resolveCampaign();
        $category = DonationCategoryFactory::new()->state(['campaign_id' => $campaign->id])->create();

        return [
            'campaign_id' => $campaign->id,
            'category_id' => $category->id,
            'donor_name' => $this->faker->name(),
            'donor_contact' => $this->faker->phoneNumber(),
            'amount' => $this->faker->randomFloat(2, 100, 5000),
            'donated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'reference' => strtoupper($this->faker->lexify('DN-????')),
            'notes' => $this->faker->sentence(),
            'meta' => ['channel' => $this->faker->randomElement(['online', 'event', 'direct'])],
        ];
    }
}
