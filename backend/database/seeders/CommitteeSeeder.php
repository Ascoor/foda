<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Committee;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CommitteeSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('committees')) {
            $this->command->warn('⚠️ جدول اللجان غير موجود، سيتم تخطي CommitteeSeeder.');

            return;
        }

        $campaign = Campaign::with('areas')->where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء لجان بدون الحملة الرئيسية.');

            return;
        }

        if ($campaign->areas->isEmpty()) {
            $this->command->warn('⚠️ لا توجد مناطق مرتبطة بالحملة لإنشاء لجان.');

            return;
        }

        $total = 0;
        DB::transaction(function () use ($campaign, &$total) {
            DB::table('committees')->where('campaign_id', $campaign->id)->delete();

            foreach ($campaign->areas as $area) {
                $count = random_int(3, 8);
                for ($i = 1; $i <= $count; $i++) {
                    $code = sprintf('COM-%s-%03d', str_pad((string) $area->id, 2, '0', STR_PAD_LEFT), $i);
                    Committee::updateOrCreate(
                        [
                            'campaign_id' => $campaign->id,
                            'code' => $code,
                        ],
                        [
                            'area_id' => $area->id,
                            'name' => sprintf('لجنة %s رقم %d', $area->name, $i),
                            'meta' => [
                                'location_hint' => 'مدرسة ' . $area->name,
                                'expected_voters' => random_int(850, 1500),
                            ],
                        ]
                    );

                    $total++;
                }
            }
        });

        $this->command->info('✅ إنشاء اللجان: ' . $total . ' لجنة.');
    }
}
