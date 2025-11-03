<?php

namespace Database\Factories;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<\App\Models\Campaign> */
class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    public function definition(): array
    {
        $name = 'Campaign ' . $this->faker->unique()->words(3, true);
        $startsAt = $this->faker->dateTimeBetween('-2 months', '+1 month');
        $endsAt = (clone $startsAt)->modify('+' . random_int(7, 60) . ' days');
        $lat1 = $this->faker->latitude();
        $lat2 = $this->faker->latitude();
        $lon1 = $this->faker->longitude();
        $lon2 = $this->faker->longitude();

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . $this->faker->unique()->randomNumber(4),
            'description' => $this->faker->paragraph(),
            'timezone' => 'Africa/Cairo',
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'spatial_level' => $this->faker->randomElement(['city', 'center', 'governorate', 'region', 'custom']),
            'admin_areas' => [$this->faker->countryCode()],
            'spatial_extent' => null,
            'bbox' => [
                min($lon1, $lon2),
                min($lat1, $lat2),
                max($lon1, $lon2),
                max($lat1, $lat2),
            ],
            'polling_settings' => ['reminders' => $this->faker->boolean()],
            'status' => $this->faker->randomElement(['draft', 'active', 'archived']),
            'created_by' => User::factory(),
        ];
    }
}
