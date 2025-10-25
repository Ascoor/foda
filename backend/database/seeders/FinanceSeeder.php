<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\ExpenseCategory;
use App\Models\Finance;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    public function run(): void
    {
        $faker = FakerFactory::create('ar_EG');
        $categories = ExpenseCategory::all();

        if ($categories->isEmpty()) {
            $categories = collect([
                ExpenseCategory::query()->create(['name' => 'تبرعات مالية']),
                ExpenseCategory::query()->create(['name' => 'مصروفات دعايا']),
                ExpenseCategory::query()->create(['name' => 'تنقلات']),
            ]);
        }

        Campaign::all()->each(function (Campaign $campaign) use ($faker, $categories) {
            foreach (range(1, 6) as $index) {
                Finance::factory()->create([
                    'campaign_id' => $campaign->id,
                    'category_id' => $categories->random()->id,
                    'type' => $index % 3 === 0 ? 'income' : 'expense',
                    'amount' => $index % 3 === 0
                        ? $faker->numberBetween(150_000, 600_000)
                        : $faker->numberBetween(15_000, 120_000),
                    'transacted_at' => now()->subDays($faker->numberBetween(1, 40)),
                    'description' => $index % 3 === 0
                        ? 'تبرع من رجل أعمال في ' . $campaign->geoArea?->name
                        : $faker->randomElement([
                            'حملة ملصقات في شوارع ' . $campaign->geoArea?->name,
                            'إيجار قاعة مؤتمر في مركز الشباب',
                            'مصروفات إعداد سرادقات الجولة الميدانية',
                        ]),
                ]);
            }
        });
    }
}
