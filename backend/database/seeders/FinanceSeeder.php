<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\ExpenseCategory;
use App\Models\Finance;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FinanceSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('finances')) {
            $this->command->warn('⚠️ جدول المعاملات المالية غير موجود، سيتم تخطي FinanceSeeder.');

            return;
        }

        $campaign = Campaign::where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء معاملات مالية بدون الحملة الرئيسية.');

            return;
        }

        $categories = ExpenseCategory::all()->keyBy('code');
        if ($categories->isEmpty()) {
            $this->command->warn('⚠️ يرجى تشغيل ExpenseCategorySeeder أولاً قبل FinanceSeeder.');

            return;
        }

        $transactions = [
            ['amount' => 75000, 'type' => 'income', 'code' => 'DON', 'desc' => 'تبرع رجال أعمال لدعم الحملة', 'days' => -20],
            ['amount' => 18500, 'type' => 'expense', 'code' => 'ADV', 'desc' => 'طباعة لافتات وشاشات عرض', 'days' => -15],
            ['amount' => 9200, 'type' => 'expense', 'code' => 'EVT', 'desc' => 'تجهيز مؤتمر جماهيري بمحافظة القاهرة', 'days' => -10],
            ['amount' => 4800, 'type' => 'expense', 'code' => 'OPS', 'desc' => 'مصروفات مكتب الحملة الشهرية', 'days' => -5],
            ['amount' => 3600, 'type' => 'expense', 'code' => 'LOG', 'desc' => 'تأجير حافلات لنقل المتطوعين', 'days' => -3],
            ['amount' => 5400, 'type' => 'expense', 'code' => 'TRN', 'desc' => 'برنامج تدريب المتطوعين على التواصل المجتمعي', 'days' => -2],
            ['amount' => 25000, 'type' => 'income', 'code' => 'DON', 'desc' => 'تحويل دعم من منظمة مجتمع مدني', 'days' => -1],
        ];

        $total = 0;
        DB::transaction(function () use ($campaign, $categories, $transactions, &$total) {
            DB::table('finances')->where('campaign_id', $campaign->id)->delete();

            foreach ($transactions as $transaction) {
                $date = now()->addDays($transaction['days']);
                $category = $categories->get($transaction['code']);

                Finance::updateOrCreate(
                    [
                        'campaign_id' => $campaign->id,
                        'description' => $transaction['desc'],
                        'txn_date' => $date->toDateString(),
                        'amount' => $transaction['amount'],
                    ],
                    [
                        'category_id' => $category?->id,
                        'type' => $transaction['type'],
                        'external_ref' => 'TRX-' . $date->format('Ymd') . '-' . $total,
                        'meta' => [
                            'recorded_by' => 'Seeder',
                            'payment_method' => $transaction['type'] === 'income' ? 'تحويل بنكي' : 'نقدي',
                        ],
                    ]
                );

                $total++;
            }
        });

        $this->command->info('✅ تسجيل المعاملات المالية: ' . $total . ' عملية.');
    }
}
