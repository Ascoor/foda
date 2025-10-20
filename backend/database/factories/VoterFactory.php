<?php

namespace Database\Factories;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Committee;
use App\Models\ElectionCircle\GeoArea;
use App\Models\Voter;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

class VoterFactory extends Factory
{
    protected $model = Voter::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $districts = ['شبرا الخيمة', 'السيدة زينب', 'حي شرق الإسكندرية', 'منية النصر', 'كوم أمبو', 'المعادي'];

        return [
            'campaign_id' => Campaign::factory(),
            'geo_area_id' => $this->resolveGeoAreaId(),
            'committee_id' => $this->resolveCommitteeId(),
            'full_name' => $this->faker->name(),
            'national_id' => '2' . $this->faker->numerify('###########'),
            'phone' => '01' . $this->faker->numerify('0########'),
            'email' => $this->faker->optional(0.35)->safeEmail(),
            'address' => $this->faker->randomElement($districts) . '، ' . $this->faker->city(),
            'support_status' => $this->faker->randomElement(['مؤيد', 'متردد', 'معارض']),
            'last_contact_at' => $this->faker->optional(0.55)->dateTimeBetween('-60 days', 'now'),
            'notes' => $this->faker->optional(0.4)->sentence(10, true),
            'source' => $this->faker->randomElement(['باب بيت', 'اتصال هاتفي', 'لقاء في فعالية', 'تواصل عبر السوشيال']),
        ];
    }

    protected function resolveCommitteeId(): int
    {
        $existing = Committee::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return Committee::factory()->create()->id;
    }

    protected function resolveGeoAreaId(): ?int
    {
        return GeoArea::query()->inRandomOrder()->value('id');
    }
}
