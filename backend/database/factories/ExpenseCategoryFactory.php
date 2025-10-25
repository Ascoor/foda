<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseCategoryFactory extends Factory
{
    protected function withFaker(): \Faker\Generator
    {
        return \Faker\Factory::create('ar_EG');
    }

    public function definition(): array
    {
        $categories = ['تبرعات مالية', 'مصروفات دعايا', 'تنقلات ميدانية', 'تجهيزات لوجستية', 'دعم إعلامي'];

        return [
            'name' => $this->faker->unique()->randomElement($categories),
        ];
    }
}
