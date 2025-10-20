<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use Illuminate\Database\Seeder;

class ExpenseCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'تبرعات مالية',
            'مصروفات دعايا ميدانية',
            'إعلانات رقمية',
            'تنقلات الفرق الميدانية',
            'تجهيز مقرات الحملة',
        ];

        foreach ($categories as $category) {
            ExpenseCategory::query()->firstOrCreate(['name' => $category]);
        }
    }
}
