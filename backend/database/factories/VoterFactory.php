<?php

namespace Database\Factories;

use App\Models\Area;
use App\Models\Voter;
use App\Models\ElectionCircle\Committee;
use Database\Factories\Concerns\ResolvesCampaign;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

class VoterFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Voter::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $districts = ['حي النسيم', 'حي الحمراء', 'حي الروضة', 'حي الشاطئ', 'حي النهضة'];

        return [
            'campaign_id' => $this->resolveCampaignId(),
            'name' => $this->faker->name(),
            'email' => $this->faker->optional(0.4)->safeEmail(),
            'phone' => '05' . $this->faker->numerify('########'),
            'area_id' => $this->resolveAreaId(),
            'committee_id' => $this->resolveCommitteeId(),
        
            'address' => $this->faker->randomElement($districts) . '، ' . $this->faker->city(),
            'sex' => $this->faker->randomElement(['male', 'female']),
            'birthdate' => $this->faker->dateTimeBetween('-65 years', '-18 years'),
            'age' => $this->faker->numberBetween(18, 70),
            'bloodgroup' => $this->faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'img_url' => null,
            'ion_user_id' => $this->faker->optional()->randomNumber(),
            'voter_id' => '10' . $this->faker->numerify('#########'),
            'add_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }

    protected function resolveAreaId(): int
    {
        $existing = Area::query()->inRandomOrder()->value('id');
        return $existing ?: Area::factory()->create()->id;
    }

    protected function resolveCommitteeId(): int
    {
        $existing = Committee::query()->inRandomOrder()->value('id');
        return $existing ?: Committee::factory()->create()->id;
    }
}
