<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\GeoArea;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Committee::class;

    public function definition(): array
    {
        return [
            'campaign_id' => $this->resolveCampaignId(),
            'geo_area_id' => $this->resolveGeoAreaId(),
            'name' => 'Committee ' . $this->faker->unique()->numberBetween(1, 999),
            'location' => $this->faker->address(),
            'code' => strtoupper($this->faker->lexify('COM-????')),
        ];
    }

    protected function resolveGeoAreaId(): int
    {
        $existing = GeoArea::query()->inRandomOrder()->value('id');

        return $existing ?: GeoArea::factory()->create()->id;
    }
}
