<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\ElectionCircle\Campaign;
use App\Models\Volunteer;
use App\Models\Voter;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $types = ['زيارة ميدانية', 'مكالمة متابعة', 'جولة طرق الأبواب', 'متابعة بلاغ'];
        $channels = ['ميداني', 'هاتف', 'تواصل اجتماعي'];
        $status = $this->faker->randomElement(['pending', 'completed', 'rescheduled']);

        return [
            'campaign_id' => $this->resolveCampaignId(),
            'volunteer_id' => $this->resolveVolunteerId(),
            'voter_id' => $this->resolveVoterId(),
            'activity_type' => $this->faker->randomElement($types),
            'status' => $status,
            'channel' => $this->faker->randomElement($channels),
            'performed_at' => Carbon::now()->subHours($this->faker->numberBetween(2, 120)),
            'notes' => $this->faker->sentence(10, true),
            'metadata' => [
                'follow_up_required' => $status !== 'completed',
                'location_hint' => $this->faker->streetName(),
                'summary' => $this->faker->sentence(6, true),
            ],
        ];
    }

    protected function resolveCampaignId(): ?int
    {
        $existing = Campaign::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return Campaign::factory()->create()->id;
    }

    protected function resolveVolunteerId(): ?int
    {
        return Volunteer::query()->inRandomOrder()->value('id');
    }

    protected function resolveVoterId(): ?int
    {
        $existing = Voter::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return Voter::factory()->create()->id;
    }
}
