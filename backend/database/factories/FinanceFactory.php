<?php

namespace Database\Factories;

use App\Models\ExpenseCategory;
use App\Models\Finance;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Finance> */
class FinanceFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Finance::class;

    public function definition(): array
    {
        return [
            'campaign_id' => $this->resolveCampaignId(),
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'type' => $this->faker->randomElement(['income', 'expense']),
            'date' => $this->faker->date(),
            'description' => $this->faker->sentence(),
            'reference_id' => null,
            'category_id' => $this->resolveCategoryId(),
        ];
    }

    protected function resolveCategoryId(): int
    {
        $existing = ExpenseCategory::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return ExpenseCategory::factory()->create()->id;
    }
}
