<?php

namespace Database\Factories;

use App\Models\Election;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ElectionFactory extends Factory
{
    protected $model = Election::class;

    public function definition(): array
    {
        return [
            'name' => 'Election ' . $this->faker->unique()->year(),
            'start_date' => Carbon::now()->subMonths(2),
            'end_date' => Carbon::now()->addMonths(1),
        ];
    }
}
