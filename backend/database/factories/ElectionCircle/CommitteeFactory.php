<?php

namespace Database\Factories\ElectionCircle;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Committee;
use App\Models\ElectionCircle\GeoArea;
use App\Models\User;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeFactory extends Factory
{
    protected $model = Committee::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $neighborhoods = ['حي مصر الجديدة', 'حي الهرم', 'حي المنتزه', 'حي شرق أسيوط', 'حي المنصورة'];

        return [
            'campaign_id' => Campaign::factory(),
            'geo_area_id' => $this->resolveGeoAreaId(),
            'supervisor_id' => $this->resolveSupervisorId(),
            'name' => 'لجنة ' . $this->faker->unique()->randomElement($neighborhoods),
            'code' => 'COM-' . $this->faker->numberBetween(100, 999),
            'voters_count' => $this->faker->numberBetween(1500, 4500),
            'notes' => $this->faker->sentence(6, true),
        ];
    }

    protected function resolveGeoAreaId(): int
    {
        $existing = GeoArea::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return GeoArea::factory()->create()->id;
    }

    protected function resolveSupervisorId(): ?int
    {
        return User::query()->inRandomOrder()->value('id');
    }
}
