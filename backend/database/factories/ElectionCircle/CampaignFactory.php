<?php

namespace Database\Factories\ElectionCircle;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Election;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $themes = ['التعليم', 'الخدمات الطبية', 'شباب مصر', 'تمكين المرأة', 'الرقمنة'];
        $districts = ["القاهرة", "الجيزة", "الإسكندرية", "أسيوط", "الدقهلية"];
        $name = 'حملة ' . $this->faker->unique()->randomElement($themes) . ' ' . $this->faker->randomElement($districts);

        return [
            'election_id' => $this->resolveElectionId(),
            'candidate_id' => null,
            'geo_area_id' => null,
            'name' => $name,
            'slug' => Str::slug($name) . '-' . $this->faker->numberBetween(10, 99),
            'slogan' => $this->faker->randomElement([
                'معًا نبني مستقبل أولادنا',
                'من أجل تنمية حقيقية لكل قرية',
                'صوتك أمانة لمصر',
            ]),
            'description' => $this->faker->paragraph(4, true),
            'start_date' => Carbon::now()->subWeeks($this->faker->numberBetween(4, 10)),
            'end_date' => Carbon::now()->addWeeks($this->faker->numberBetween(4, 12)),
            'status' => $this->faker->randomElement(['planning', 'active', 'mobilizing']),
            'budget' => $this->faker->numberBetween(1_500_000, 4_500_000),
            'target_votes' => $this->faker->numberBetween(25000, 75000),
        ];
    }

    protected function resolveElectionId(): int
    {
        $existing = Election::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        $election = Election::query()->create([
            'name' => 'انتخابات المجلس البلدي ' . Carbon::now()->year,
            'start_date' => Carbon::now()->startOfYear(),
            'end_date' => Carbon::now()->endOfYear(),
        ]);

        return $election->id;
    }
}
