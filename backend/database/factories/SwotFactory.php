<?php

namespace Database\Factories;

use App\Models\Swot;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Swot>
 */
class SwotFactory extends Factory
{
    protected $model = Swot::class;

    public function definition(): array
    {
        $strengths = $this->faker->randomElement([
            'Strong leadership',
            'دعم مجتمعي قوي',
        ]);

        $weaknesses = $this->faker->randomElement([
            'Limited resources',
            'نقص الخبرة',
        ]);

        $opportunities = $this->faker->randomElement([
            'New partnerships',
            'فرص تمويل جديدة',
        ]);

        $threats = $this->faker->randomElement([
            'Economic downturn',
            'مخاطر سياسية',
        ]);

        return [
            'entity_type' => $this->faker->randomElement(['area', 'team', 'volunteer']),
            'entity_id' => 1,
            'strengths' => $strengths,
            'weaknesses' => $weaknesses,
            'opportunities' => $opportunities,
            'threats' => $threats,
            'created_by' => User::factory(),
        ];
    }
}
