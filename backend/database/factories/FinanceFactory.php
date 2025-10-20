<?php

namespace Database\Factories;

use App\Models\ElectionCircle\Campaign;
use App\Models\ExpenseCategory;
use App\Models\Finance;
use App\Models\User;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

class FinanceFactory extends Factory
{
    protected $model = Finance::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $types = ['income', 'expense'];
        $descriptions = [
            'تبرعات من رجال أعمال',
            'مصروفات دعايا في الميادين',
            'إيجار قاعة مؤتمر',
            'شراء لوحات إعلانية',
            'تجهيز سيارات الحملة',
        ];

        return [
            'campaign_id' => Campaign::factory(),
            'category_id' => $this->resolveCategoryId(),
            'type' => $this->faker->randomElement($types),
            'amount' => $this->faker->numberBetween(5000, 250000),
            'currency' => 'EGP',
            'transacted_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'reference' => strtoupper($this->faker->bothify('TX-####')), 
            'description' => $this->faker->randomElement($descriptions),
            'recorded_by' => $this->resolveRecorderId(),
        ];
    }

    protected function resolveCategoryId(): ?int
    {
        return ExpenseCategory::query()->inRandomOrder()->value('id');
    }

    protected function resolveRecorderId(): ?int
    {
        return User::query()->inRandomOrder()->value('id');
    }
}
