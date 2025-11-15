<?php

namespace Database\Factories;

use App\Models\Expense;
use Database\Factories\Concerns\ResolvesCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Expense> */
class ExpenseFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Expense::class;

    public function definition(): array
    {
        $campaign = $this->resolveCampaign();
        $category = ExpenseCategoryFactory::new()->state(['campaign_id' => $campaign->id])->create();

        return [
            'campaign_id' => $campaign->id,
            'category_id' => $category->id,
            'vendor_name' => $this->faker->company(),
            'amount' => $this->faker->randomFloat(2, 50, 3000),
            'spent_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'reference' => strtoupper($this->faker->lexify('EX-????')),
            'description' => $this->faker->sentence(),
            'meta' => ['method' => $this->faker->randomElement(['cash', 'transfer', 'cheque'])],
        ];
    }
}
