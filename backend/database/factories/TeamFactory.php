<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\ElectionCircle\Campaign;
use App\Models\Team;
use App\Models\User;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeamFactory extends Factory
{
    protected $model = Team::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $teamPrefixes = ['فريق', 'مجموعة', 'وحدة'];
        $teamFocus = ['التواصل', 'الميدان', 'التحليل', 'التعبئة', 'الدعم'];

        return [
            'campaign_id' => Campaign::factory(),
            'name' => $this->faker->randomElement($teamPrefixes) . ' ' . $this->faker->randomElement($teamFocus),
            'area_id' => $this->resolveAreaId(),
            'supervisor_id' => $this->resolveSupervisorId(),
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

    protected function resolveSupervisorId(): int
    {
        $existing = User::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return User::factory()->create()->id;
    }
}
   
