<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Event;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('events')) {
            $this->command->warn('⚠️ جدول الفعاليات غير موجود، سيتم تخطي EventSeeder.');

            return;
        }

        $campaign = Campaign::with(['areas', 'teams'])->where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء الفعاليات بدون الحملة الرئيسية.');

            return;
        }

        if ($campaign->teams->isEmpty()) {
            $this->command->warn('⚠️ لا توجد فرق ميدانية لإنشاء فعاليات مرتبطة بها.');

            return;
        }

        $eventsBlueprint = [
            'مؤتمر جماهيري',
            'ندوة شبابية',
            'قافلة توعية',
            'لقاء مع الأهالي',
            'اجتماع منسقين',
            'مؤتمر صحفي مصغر',
        ];

        $totalEvents = 0;
        DB::transaction(function () use ($campaign, $eventsBlueprint, &$totalEvents) {
            DB::table('events')->where('campaign_id', $campaign->id)->delete();

            foreach ($campaign->areas->take(10) as $area) {
                $areaTeams = $campaign->teams->where('area_id', $area->id);
                $team = $areaTeams->isNotEmpty() ? $areaTeams->random() : $campaign->teams->random();

                foreach ($eventsBlueprint as $index => $label) {
                    $start = now()->addDays($totalEvents + $index)->setTime(random_int(10, 18), random_int(0, 1) ? 0 : 30);
                    $title = sprintf('%s في %s', $label, $area->name);

                    Event::updateOrCreate(
                        [
                            'campaign_id' => $campaign->id,
                            'title' => $title,
                            'starts_at' => $start,
                        ],
                        [
                            'area_id' => $area->id,
                            'team_id' => $team->id,
                            'description' => 'فعالية ميدانية لتعزيز التواصل مع الناخبين.',
                            'ends_at' => $start->clone()->addHours(2),
                            'location' => [
                                'address' => 'قاعة الشباب والرياضة - ' . $area->name,
                                'lat' => 30 + random_int(-200, 200) / 1000,
                                'lng' => 31 + random_int(-200, 200) / 1000,
                            ],
                            'meta' => [
                                'expected_attendance' => random_int(80, 250),
                                'speaker' => Str::replace(' ', '، ', $this->randArabicName()['full']),
                            ],
                        ]
                    );

                    $totalEvents++;

                    if ($totalEvents >= 12) {
                        break 2;
                    }
                }
            }
        });

        $this->command->info('✅ إنشاء الفعاليات الحملة: ' . $totalEvents . ' فعالية.');
    }
}
