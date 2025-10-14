<?php

namespace Database\Factories\ElectionCircle;

use App\Models\ElectionCircle\Committee;
use App\Models\ElectionCircle\GeoArea;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeFactory extends Factory
{
    protected $model = Committee::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $neighborhoods = ['حي النخيل', 'حي العليا', 'حي الشاطئ', 'حي الشفا', 'حي الجامعة', 'حي المزروعية'];

        return [
            'name' => 'لجنة ' . $this->faker->unique()->citySuffix(),
            'location' => $this->faker->randomElement($neighborhoods) . '، ' . $this->faker->city(),
            'geo_area_id' => $this->resolveGeoAreaId(),
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
}
