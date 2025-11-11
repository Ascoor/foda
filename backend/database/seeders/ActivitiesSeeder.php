<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\{Campaign, Activity, Voter, User};

class ActivitiesSeeder extends Seeder
{
    public function run(): void
    {
        $types    = ['call','visit','note','event','other'];
        $statuses = ['open','done','wip'];

        foreach (Campaign::with('users')->get() as $campaign) {

            // 1) ناخد الناخبين داخل الحملة
            $voterIds = Voter::where('campaign_id', $campaign->id)->pluck('id')->all();
            if (empty($voterIds)) {
                $this->command?->warn("⚠️ لا يوجد ناخبين للحملة #{$campaign->id}، تم تخطي ActivitiesSeeder لهذه الحملة.");
                continue;
            }

            // 2) نحدد المؤلفين (أعضاء الحملة)
            $authorIds = $campaign->users->pluck('id')->all();

            // لو مفيش أعضاء للحملة، نجيب أي يوزر أو ننشئ واحد ونربطه بالحملة
            if (empty($authorIds)) {
                $fallback = User::first();
                if (!$fallback) {
                    $fallback = User::create([
                        'name' => 'مشرف عام',
                        'email' => 'admin@example.com',
                        'password' => bcrypt('password'),
                        'status' => 'active',
                    ]);
                }
                $campaign->users()->syncWithoutDetaching([
                    $fallback->id => ['role' => 'campaign_manager', 'status' => 'active']
                ]);
                $authorIds = [$fallback->id];
            }

            // 3) إنشاء أنشطة مع مؤلفين موجودين فعلاً
            DB::transaction(function () use ($campaign, $voterIds, $authorIds, $types, $statuses) {
                for ($i = 1; $i <= 150; $i++) {
                    Activity::create([
                        'campaign_id'   => $campaign->id,
                        'voter_id'      => $voterIds[array_rand($voterIds)],
                        'created_by'    => $authorIds[array_rand($authorIds)],
                        'type'          => $types[array_rand($types)],
                        'status'        => $statuses[array_rand($statuses)],
                        'title'         => "نشاط ميداني رقم {$i}",
                        'description'   => "تفاصيل النشاط الميداني رقم {$i}",
                        'support_score' => rand(1, 5),
                        'reported_at'   => now()->subDays(rand(0, 14)),
                    ]);
                }
            });
        }

        $this->command?->info('✅ تم إنشاء الأنشطة وربط created_by بمستخدمين حقيقيين داخل كل حملة.');
    }
}
