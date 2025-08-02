<?php

namespace Database\Factories;

use App\Models\Voter;
use App\Models\Area;
use Illuminate\Database\Eloquent\Factories\Factory;

class VoterFactory extends Factory
{
    protected $model = Voter::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'area_id' => Area::factory(),
            'address' => $this->faker->address(),
            'sex' => $this->faker->randomElement(['male', 'female']),
            'birthdate' => $this->faker->date(),
            'age' => $this->faker->numberBetween(18, 90),
            'bloodgroup' => $this->faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'img_url' => $this->faker->imageUrl(),
            'ion_user_id' => $this->faker->randomNumber(),
            'voter_id' => $this->faker->unique()->uuid(),
            'add_date' => $this->faker->date(),
        ];
    }
}
