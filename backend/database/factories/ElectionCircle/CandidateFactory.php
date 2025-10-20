<?php

namespace Database\Factories\ElectionCircle;

use App\Models\ElectionCircle\Candidate;
use App\Models\ElectionCircle\Election;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CandidateFactory extends Factory
{
    protected $model = Candidate::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $name = $this->faker->unique()->name('male');

        return [
            'user_id' => null,
            'full_name' => $name,
            'slug' => Str::slug($this->faker->unique()->lexify('????')) . '-' . $this->faker->numberBetween(100, 999),
            'party' => $this->faker->randomElement([
                'حزب المصريين الأحرار',
                'حزب مستقبل وطن',
                'حزب الوفد الجديد',
                'مستقل',
            ]),
            'biography' => $this->faker->paragraph(3, true),
            'photo_path' => null,
            'election_id' => $this->resolveElectionId(),
        ];
    }

    protected function resolveElectionId(): ?int
    {
        return Election::query()->inRandomOrder()->value('id');
    }
}
