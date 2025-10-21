<?php

namespace Database\Factories\ElectionCircle;

use App\Models\ElectionCircle\Candidate;
use App\Models\ElectionCircle\Election;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CandidateFactory extends Factory
{
    protected $model = Candidate::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'election_id' => Election::factory(), // optional, if Election factory exists
            'full_name' => $this->faker->name('ar_EG'),
            'slug' => Str::slug($this->faker->unique()->name),
            'party' => $this->faker->randomElement(['مستقل', 'حزب مستقبل وطن', 'حزب المصريين الأحرار']),
            'biography' => $this->faker->paragraph(3, true),
            'photo_path' => null,
        ];
    }
}
