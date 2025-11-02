<?php

namespace Database\Factories;

use App\Models\AnalyticsSnapshot;
use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Election;
use Database\Factories\Concerns\ResolvesCampaign;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class AnalyticsSnapshotFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = AnalyticsSnapshot::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $metricKeys = ['turnout_trend', 'support_index', 'engagement_score', 'volunteer_activity'];
        $campaignId = $this->resolveCampaignId();
        $electionId = $this->resolveElectionId($campaignId);

        return [
            'election_id' => $electionId,
            'campaign_id' => $campaignId,
            'metric_key' => $this->faker->randomElement($metricKeys),
            'snapshot_date' => Carbon::now()->subDays($this->faker->numberBetween(0, 14)),
            'payload' => [
                'label' => $this->faker->randomElement([
                    'مؤشر دعم الناخبين',
                    'مستوى التفاعل الرقمي',
                    'نسبة حضور الاجتماعات',
                ]),
                'region' => $this->faker->city(),
                'notes' => $this->faker->sentence(),
            ],
            'forecast_value' => $this->faker->randomFloat(2, 45, 98),
        ];
    }

    protected function resolveElectionId(int $campaignId): int
    {
        $campaign = Campaign::find($campaignId);

        if ($campaign && $campaign->election_id) {
            return $campaign->election_id;
        }

        $election = Election::query()->inRandomOrder()->first();

        if ($election) {
            return $election->id;
        }

        $election = Election::query()->create([
            'name' => 'انتخابات طارئة ' . Carbon::now()->year,
            'start_date' => Carbon::now()->subMonths(2),
            'end_date' => Carbon::now()->addMonths(1),
        ]);

        if ($campaign) {
            $campaign->update(['election_id' => $election->id]);
        }

        return $election->id;
    }
}
