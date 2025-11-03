<?php

namespace Database\Factories;

use App\Models\Committee;
use App\Models\Voter;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VoterFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Voter::class;

    public function definition(): array
    {
        $nationalId = Str::padLeft((string) $this->faker->unique()->randomNumber(8), 14, '1');

        return [
            'campaign_id' => $this->resolveCampaignId(),
            'committee_id' => $this->resolveCommitteeId(),
            'name' => $this->faker->name(),
            'national_id' => $nationalId,
            'voter_uid' => 'V-' . $this->faker->unique()->numberBetween(1000, 9999),
            'address' => $this->faker->address(),
            'phone' => '01' . $this->faker->numerify('########'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'birthdate' => $this->faker->dateTimeBetween('-70 years', '-18 years'),
            'meta' => ['notes' => $this->faker->sentence()],
        ];
    }

    protected function resolveCommitteeId(): ?int
    {
        $existing = Committee::query()->inRandomOrder()->value('id');

        return $existing ?: Committee::factory()->create()->id;
    }
}
