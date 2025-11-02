<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Area;
use App\Models\ElectionCircle\Committee;
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
        $latitude = $this->faker->latitude(16.0, 32.0);
        $longitude = $this->faker->longitude(34.0, 55.0);
        $types = ['اجتماع تنسيقي', 'زيارة ميدانية', 'حملة توعية', 'ندوة مجتمعية'];
        $statuses = ['open', 'in_progress', 'closed'];
        $status = $this->faker->randomElement($statuses);
        $title = $this->faker->randomElement($types);

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
            'latitude' => $latitude,
            'longitude' => $longitude,
            'support_score' => $this->faker->numberBetween(20, 100),
            'reported_at' => Carbon::now()->subHours($this->faker->numberBetween(1, 120)),
            'meta' => [
                'source' => $this->faker->randomElement(['agent', 'volunteer', 'voter']),
                'status_label' => match ($status) {
                    'open' => 'قيد التنفيذ',
                    'in_progress' => 'جارٍ المتابعة',
                    'closed' => 'مكتمل',
                    default => 'غير محدد',
                },
                'activity_title' => $title,
                'notes' => $this->faker->sentence(6),
            ],
        ];
    }

    protected function resolveAreaId(): int
    {
        $existing = Area::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return Area::factory()->create()->id;
    }

    protected function resolveCommitteeId(): ?int
    {
        $existing = Committee::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return Committee::factory()->create()->id;
    }

    protected function resolveVoterId(): ?int
    {
        $existing = Voter::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return Voter::factory()->create()->id;
    }

    protected function resolveUserId(): int
    {
        $existing = User::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return User::factory()->create()->id;
    }
}
