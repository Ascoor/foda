<?php

namespace Database\Factories;

use App\Models\GeoArea;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

class GeoAreaFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = GeoArea::class;

    public function definition(): array
    {
        return [
            'campaign_id' => $this->resolveCampaignId(),
            'name' => $this->faker->city(),
            'level' => $this->faker->randomElement(['city', 'center', 'governorate', 'region']),
            'code' => strtoupper($this->faker->lexify('GA-????')),
            'meta' => ['population' => $this->faker->numberBetween(1000, 50000)],
        ];
    }
}
