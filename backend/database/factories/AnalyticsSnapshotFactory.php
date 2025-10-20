<?php

namespace Database\Factories;

use App\Models\AnalyticsSnapshot;
use App\Models\ElectionCircle\Campaign;
use Database\Factories\ElectionCircle\CampaignFactory;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class AnalyticsSnapshotFactory extends Factory
{
    protected $model = AnalyticsSnapshot::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $metrics = [
            'support_trend' => 'مؤشر دعم الناخبين',
            'turnout_prediction' => 'نسبة المشاركة المتوقعة',
            'volunteer_efficiency' => 'فاعلية المتطوعين',
            'media_sentiment' => 'رأي الإعلام المحلي',
        ];

        $campaignId = $this->resolveCampaignId();
        $metricKey = $this->faker->randomElement(array_keys($metrics));

        return [
            'campaign_id' => $campaignId,
            'metric' => $metricKey,
            'value' => $this->faker->randomFloat(2, 35, 95),
            'captured_at' => Carbon::now()->subDays($this->faker->numberBetween(1, 10)),
            'comparison_value' => $this->faker->optional(0.6)->randomFloat(2, 30, 90),
            'metadata' => [
                'label' => $metrics[$metricKey],
                'period' => 'أسبوع ' . Carbon::now()->subDays($this->faker->numberBetween(7, 28))->format('d/m'),
                'notes' => $this->faker->sentence(8, true),
            ],
        ];
    }

    protected function resolveCampaignId(): int
    {
        $existing = Campaign::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return CampaignFactory::new()->create()->id;
    }
}
