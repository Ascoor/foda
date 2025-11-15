<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\Campaign;
use App\Models\GeographicScope;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\GeographicScope> */
class GeographicScopeFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = GeographicScope::class;

    public function definition(): array
    {
        $campaignId = $this->resolveCampaignId();
        $area = Area::factory()->create();

        return [
            'campaign_id' => $campaignId,
            'name' => $area->name_ar . ' نطاق',
            'level' => $this->faker->randomElement(['governorate', 'center', 'city', 'district', 'custom']),
            'area_id' => $area->id,
            'bbox' => [
                $this->faker->latitude(16.0, 32.0),
                $this->faker->longitude(34.0, 55.0),
                $this->faker->latitude(16.0, 32.0),
                $this->faker->longitude(34.0, 55.0),
            ],
            'meta' => ['focus' => $this->faker->word()],
        ];
    }

    public function forCampaign(Campaign $campaign): self
    {
        return $this->state(fn () => ['campaign_id' => $campaign->id]);
    }

    public function childOf(GeographicScope $parent): self
    {
        return $this->state(fn () => [
            'campaign_id' => $parent->campaign_id,
            'parent_id' => $parent->id,
        ]);
    }
}
