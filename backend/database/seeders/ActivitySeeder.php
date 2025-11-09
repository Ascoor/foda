<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Campaign;
use App\Models\Voter;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ActivitySeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('activities')) {
            $this->command->warn('⚠️ جدول الأنشطة غير موجود، سيتم تخطي ActivitySeeder.');

            return;
        }

        $campaign = Campaign::with(['committees.area', 'users'])->where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء الأنشطة بدون الحملة الرئيسية.');

            return;
        }

        $committees = $campaign->committees;
        if ($committees->isEmpty()) {
            $this->command->warn('⚠️ لا توجد لجان لإنشاء أنشطة ميدانية.');

            return;
        }

        $votersByCommittee = Voter::where('campaign_id', $campaign->id)->get()->groupBy('committee_id');
        $creator = $campaign->users->first()?->id;

        $activityTypes = ['طرق الأبواب', 'اتصال هاتفي', 'متابعة في اللجنة'];

        $totalActivities = 0;
        DB::transaction(function () use ($campaign, $committees, $votersByCommittee, $creator, $activityTypes, &$totalActivities) {
            DB::table('activities')->where('campaign_id', $campaign->id)->delete();

            foreach ($committees->take(15) as $committee) {
                $voters = $votersByCommittee->get($committee->id, collect());

                foreach ($activityTypes as $type) {
                    if ($voters->isEmpty()) {
                        continue;
                    }

                    $reportedAt = now()->subDays(random_int(1, 14))->setTime(random_int(9, 18), random_int(0, 59));
                    $voter = $voters->random();

                    Activity::updateOrCreate(
                        [
                            'campaign_id' => $campaign->id,
                            'committee_id' => $committee->id,
                            'type' => $type,
                            'reported_at' => $reportedAt,
                        ],
                        [
                            'area_id' => $committee->area_id,
                            'voter_id' => $voter->id,
                            'created_by' => $creator,
                            'status' => random_int(0, 1) ? 'مكتمل' : 'متابعة',
                            'location' => [
                                'address' => 'محيط اللجنة - ' . ($committee->area->name ?? 'غير محدد'),
                                'lat' => 30 + random_int(-150, 150) / 1000,
                                'lng' => 31 + random_int(-150, 150) / 1000,
                            ],
                            'support_score' => random_int(1, 5),
                            'payload' => [
                                'notes' => Str::finish('تم التواصل مع ' . $voter->full_name, '.'),
                                'needs_follow_up' => random_int(0, 1) === 1,
                            ],
                        ]
                    );

                    $totalActivities++;
                }
            }
        });

        $this->command->info('✅ تسجيل الأنشطة الميدانية: ' . $totalActivities . ' نشاط.');
    }
}
