<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Area;
use App\Models\Committee;
use App\Models\User;
use App\Models\Voter;
use Database\Factories\Concerns\ResolvesCampaign;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ActivityFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Activity::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $status = $this->faker->randomElement(['open', 'in_progress', 'closed']);
        $title = $this->faker->randomElement(['اجتماع تنسيقي', 'زيارة ميدانية', 'حملة توعية', 'ندوة مجتمعية']);

        return [
            'area_id' => $this->resolveAreaId(),
            'committee_id' => $this->resolveCommitteeId(),
            'campaign_id' => $this->resolveCampaignId(),
            'voter_id' => $this->resolveVoterId(),
            'created_by' => $this->resolveUserId(),
            'type' => $this->faker->randomElement(['turnout', 'logistics', 'support', 'engagement']),
            'status' => $status,
            'title' => $title,
            'description' => $this->faker->sentence(8),
            'latitude' => $this->faker->latitude(16.0, 32.0),
            'longitude' => $this->faker->longitude(34.0, 55.0),
            'support_score' => $this->faker->numberBetween(20, 100),
            'reported_at' => Carbon::now()->subHours($this->faker->numberBetween(1, 120)),
            'meta' => [
                'source' => $this->faker->randomElement(['agent', 'volunteer', 'voter']),
                'status_label' => $status,
                'activity_title' => $title,
                'notes' => $this->faker->sentence(6),
            ],
        ];
    }

    protected function resolveAreaId(): int
    {
        return Area::query()->inRandomOrder()->value('id') ?: Area::factory()->create()->id;
    }

    protected function resolveCommitteeId(): ?int
    {
        return Committee::query()->inRandomOrder()->value('id') ?: Committee::factory()->create()->id;
    }

    protected function resolveVoterId(): ?int
    {
        return Voter::query()->inRandomOrder()->value('id') ?: Voter::factory()->create()->id;
    }

    protected function resolveUserId(): int
    {
        return User::query()->inRandomOrder()->value('id') ?: User::factory()->create()->id;
    }
}
