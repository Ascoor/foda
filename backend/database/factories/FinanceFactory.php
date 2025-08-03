<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Finance> */
class FinanceFactory extends Factory
{
    protected $model = \App\Models\Finance::class;
public function definition(): array
{
    return [
        'amount' => $this->faker->randomFloat(2, 10, 1000),
        'type' => $this->faker->randomElement(['income', 'expense']),
        'date' => $this->faker->date(),
        'description' => $this->faker->sentence(),
        'reference_id' => null,
        'category_id' => \App\Models\ExpenseCategory::inRandomOrder()->first()?->id ?? 1, // أضف هذا السطر
    ];
}
}