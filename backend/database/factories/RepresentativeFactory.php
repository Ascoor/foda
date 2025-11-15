<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\GeographicScope;
use App\Models\Representative;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Representative> */
class RepresentativeFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Representative::class;

    public function definition(): array
    {
        $campaign = $this->resolveCampaign();
        $scope = GeographicScope::factory()->forCampaign($campaign)->create();
        $committee = Committee::factory()->create([
            'campaign_id' => $campaign->id,
            'geographic_scope_id' => $scope->id,
        ]);

        return [
            'campaign_id' => $campaign->id,
            'geographic_scope_id' => $scope->id,
            'committee_id' => $committee->id,
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'position' => $this->faker->jobTitle(),
            'assignment_type' => $this->faker->randomElement(['station', 'field', 'media', 'legal', 'other']),
            'status' => $this->faker->randomElement(['pending', 'active', 'inactive']),
            'assigned_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'responsibilities' => [$this->faker->word(), $this->faker->word()],
        ];
    }
}
