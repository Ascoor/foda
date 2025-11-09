<?php

namespace Database\Seeders;

use App\Models\AnalyticsSnapshot;
use App\Models\Campaign;
use App\Models\Swot;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AnalyticsSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('analytics_snapshots') || ! Schema::hasTable('swots')) {
            $this->command->warn('⚠️ جداول التحليلات غير متوفرة، سيتم تخطي AnalyticsSeeder.');

            return;
        }

        $campaign = Campaign::with(['election', 'users'])->where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن تسجيل التحليلات بدون الحملة الرئيسية.');

            return;
        }

        $adminId = $campaign->users->first()?->id;

        $snapshots = [
            ['key' => 'support_trend', 'days' => -14, 'forecast' => 51.2],
            ['key' => 'volunteer_activity', 'days' => -7, 'forecast' => 620],
            ['key' => 'fundraising_progress', 'days' => -1, 'forecast' => 0.72],
        ];

        $swotData = [
            'strengths' => ['انتشار ميداني واسع', 'رسالة إعلامية موحدة'],
            'weaknesses' => ['نقص التمويل في بعض المحافظات'],
            'opportunities' => ['دعم منظمات المجتمع المدني', 'زيادة التسجيل الإلكتروني'],
            'threats' => ['شائعات على مواقع التواصل', 'ازدحام لجان معينة'],
        ];

        DB::transaction(function () use ($campaign, $snapshots, $adminId, $swotData) {
            foreach ($snapshots as $snapshot) {
                $asOf = now()->addDays($snapshot['days'])->toDateString();

                AnalyticsSnapshot::updateOrCreate(
                    [
                        'campaign_id' => $campaign->id,
                        'key' => $snapshot['key'],
                        'as_of_date' => $asOf,
                    ],
                    [
                        'election_id' => $campaign->election?->id,
                        'payload' => ['generated_at' => now()->toDateTimeString()],
                        'forecast_value' => $snapshot['forecast'],
                    ]
                );
            }

            Swot::updateOrCreate(
                [
                    'campaign_id' => $campaign->id,
                    'entity_type' => 'campaign',
                    'entity_id' => $campaign->id,
                ],
                array_merge($swotData, ['created_by' => $adminId])
            );
        });

        $this->command->info('✅ تحديث التحليلات ولوحة SWOT للحملة.');
    }
}
