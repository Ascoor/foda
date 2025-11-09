<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Observation;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ObservationSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('observations')) {
            $this->command->warn('⚠️ جدول الملاحظات غير موجود، سيتم تخطي ObservationSeeder.');

            return;
        }

        $campaign = Campaign::with(['committees', 'volunteers'])->where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن تسجيل الملاحظات بدون الحملة الرئيسية.');

            return;
        }

        if ($campaign->committees->isEmpty() || $campaign->volunteers->isEmpty()) {
            $this->command->warn('⚠️ يجب توفر لجان ومتطوعين لتسجيل الملاحظات.');

            return;
        }

        $totalObservations = 0;
        DB::transaction(function () use ($campaign, &$totalObservations) {
            DB::table('observations')->where('campaign_id', $campaign->id)->delete();

            foreach ($campaign->committees->take(20) as $committee) {
                $volunteer = $campaign->volunteers->random();

                Observation::updateOrCreate(
                    [
                        'campaign_id' => $campaign->id,
                        'committee_id' => $committee->id,
                        'volunteer_id' => $volunteer->id,
                        'recorded_at' => now()->subDays(random_int(0, 7))->setTime(random_int(8, 17), random_int(0, 59)),
                    ],
                    [
                        'meta' => [
                            'turnout' => random_int(45, 90),
                            'incidents' => random_int(0, 3),
                        ],
                        'notes' => 'تم رصد الحالة العامة للجنة وتوثيق الانطباعات حول سير العملية.',
                    ]
                );

                $totalObservations++;
            }
        });

        $this->command->info('✅ تسجيل الملاحظات الميدانية: ' . $totalObservations . ' ملاحظة.');
    }
}
