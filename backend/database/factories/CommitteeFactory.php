<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\Committee;
use App\Models\GeographicScope;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Committee::class;

    public function definition(): array
    {
        $campaign = $this->resolveCampaign();
        $scope = GeographicScope::factory()->forCampaign($campaign)->create();
        $areaId = $scope->area_id ?: Area::factory()->create()->id;

        return [
            'campaign_id' => $campaign->id,
            'geographic_scope_id' => $scope->id,
            'area_id' => $areaId,
            'name' => 'لجنة ' . $this->faker->unique()->numberBetween(1, 999),
            'code' => strtoupper($this->faker->lexify('COM-????')),
            'location' => $this->faker->address(),
            'lat' => $this->faker->latitude(16.0, 32.0),
            'lng' => $this->faker->longitude(34.0, 55.0),
            'meta' => ['capacity' => $this->faker->numberBetween(10, 100)],
        ];
    }
}
