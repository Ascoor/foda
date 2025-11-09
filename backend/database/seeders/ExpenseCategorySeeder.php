<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ExpenseCategorySeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('expense_categories')) {
            $this->command->warn('⚠️ جدول بنود الصرف غير موجود، سيتم تخطي ExpenseCategorySeeder.');

            return;
        }

        $categories = [
            ['name' => 'دعاية وإعلانات', 'code' => 'ADV'],
            ['name' => 'تنظيم فعاليات', 'code' => 'EVT'],
            ['name' => 'مصاريف تشغيل', 'code' => 'OPS'],
            ['name' => 'نقل ولوجستيات', 'code' => 'LOG'],
            ['name' => 'تدريب المتطوعين', 'code' => 'TRN'],
            ['name' => 'تبرعات واردة', 'code' => 'DON'],
        ];

        foreach ($categories as $category) {
            ExpenseCategory::updateOrCreate(
                ['code' => $category['code']],
                ['name' => $category['name']]
            );
        }

        $this->command->info('✅ ضبط بنود الصرف والإيرادات الأساسية.');
    }
}
