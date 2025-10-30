<?php

namespace Database\Factories;

use App\Models\Area;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Area>
 */
class AreaFactory extends Factory
{
    protected $model = Area::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->city(),
            'code' => strtoupper($this->faker->unique()->lexify('AR???')),
            'parent_id' => null,
            'description' => $this->faker->sentence(10),
            'x' => $this->faker->randomFloat(6, 24.5, 31.5),
            'y' => $this->faker->randomFloat(6, 22.0, 32.0),
        ];
    }

    public function childOf(Area $parent): self
    {
        return $this->state(fn () => [
            'parent_id' => $parent->id,
            'code' => strtoupper($this->faker->unique()->lexify($parent->code . '?')),
        ]);
    }
}
