<?php

namespace Database\Factories\ElectionCircle;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Election;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $themes = ['دعم التعليم', 'خدمة المجتمع', 'تنمية الشباب', 'تمكين المرأة', 'تحسين الخدمات'];

        return [
            'name' => 'حملة ' . $this->faker->unique()->randomElement($themes) . ' ' . $this->faker->randomDigitNotNull(),
            'description' => $this->faker->paragraph(),
            'election_id' => $this->resolveElectionId(),
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
