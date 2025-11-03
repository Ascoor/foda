<?php

namespace Database\Factories;

use App\Models\Campaign;
use App\Models\Election;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name) . '-' . $this->faker->unique()->randomNumber(5),
            'description' => $this->faker->sentence(),
            'starts_at' => Carbon::now()->subWeeks(2),
            'ends_at' => Carbon::now()->addWeeks(4),
            'spatial_level' => $this->faker->randomElement(['city', 'center', 'governorate', 'region']),
            'bbox' => [
                $this->faker->randomFloat(3, 25, 30),
                $this->faker->randomFloat(3, 25, 30),
                $this->faker->randomFloat(3, 30, 35),
                $this->faker->randomFloat(3, 30, 35),
            ],
            'status' => 'active',
            'election_id' => Election::factory(),
        ];
    }
}
