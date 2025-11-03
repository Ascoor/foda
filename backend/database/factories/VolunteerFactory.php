<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\Volunteer;
use Database\Factories\Concerns\ResolvesCampaign;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

class VolunteerFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Volunteer::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $campaignId = $this->resolveCampaignId();

        return [
            'campaign_id' => $campaignId,
            'team_id' => $this->resolveTeamId($campaignId),
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => '05' . $this->faker->numerify('########'),
            'tags' => ['field'],
        ];
    }

    protected function resolveTeamId(int $campaignId): int
    {
        $existing = Team::query()->where('campaign_id', $campaignId)->inRandomOrder()->value('id');

        return $existing ?: Team::factory()->create(['campaign_id' => $campaignId])->id;
    }
}
