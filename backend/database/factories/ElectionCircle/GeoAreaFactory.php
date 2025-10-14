<?php

namespace Database\Factories\ElectionCircle;

use App\Models\ElectionCircle\Election;
use App\Models\ElectionCircle\GeoArea;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class GeoAreaFactory extends Factory
{
    protected $model = GeoArea::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $districts = [
            'الدائرة الشمالية',
            'الدائرة الجنوبية',
            'الدائرة الشرقية',
            'الدائرة الغربية',
            'دائرة وسط المدينة',
            'الدائرة الساحلية',
            'دائرة الواحة',
        ];

        return [
            'name' => $this->faker->unique()->randomElement($districts) . ' ' . $this->faker->randomElement(['أ', 'ب', 'ج', 'د']),
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
