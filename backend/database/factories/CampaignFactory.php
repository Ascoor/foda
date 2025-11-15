<?php

namespace Database\Factories;

use App\Models\Campaign;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

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
            'status' => 'active',
            'start_date' => Carbon::now()->subWeeks(2)->toDateString(),
            'end_date' => Carbon::now()->addWeeks(4)->toDateString(),
            'poll_date' => Carbon::now()->addWeeks(5)->toDateString(),
            'geographic_strategy' => $this->faker->randomElement(['city', 'center', 'governorate', 'district', 'custom']),
            'geographic_notes' => ['focus' => $this->faker->word()],
            'bbox' => [
                $this->faker->randomFloat(3, 25, 30),
                $this->faker->randomFloat(3, 25, 30),
                $this->faker->randomFloat(3, 30, 35),
                $this->faker->randomFloat(3, 30, 35),
            ],
        ];
    }
}
