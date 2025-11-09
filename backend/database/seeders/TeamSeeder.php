<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Team;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TeamSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('teams')) {
            $this->command->warn('⚠️ جدول الفرق غير موجود، سيتم تخطي TeamSeeder.');

            return;
        }

        $campaign = Campaign::with(['areas', 'users'])->where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء الفرق بدون الحملة الرئيسية.');

            return;
        }

        $supervisors = $campaign->users->filter(function ($user) {
            return $user->pivot && $user->pivot->role === 'supervisor';
        });

        if ($supervisors->isEmpty()) {
            $this->command->warn('⚠️ لا يوجد مشرفون مرتبطون بالحملة لتعيينهم على الفرق.');

            return;
        }

        $totalTeams = 0;
        DB::transaction(function () use ($campaign, $supervisors, &$totalTeams) {
            DB::table('teams')->where('campaign_id', $campaign->id)->delete();

            foreach ($campaign->areas as $area) {
                $teamsCount = random_int(1, 3);
                for ($i = 1; $i <= $teamsCount; $i++) {
                    $supervisor = $supervisors->random();
                    Team::updateOrCreate(
                        [
                            'campaign_id' => $campaign->id,
                            'name' => sprintf('فريق %s - %d', $area->name, $i),
                        ],
                        [
                            'area_id' => $area->id,
                            'supervisor_id' => $supervisor->id,
                            'meta' => [
                                'contact_phone' => $this->egyptianPhone(),
                                'focus' => 'تنظيم ميداني',
                            ],
                        ]
                    );

                    $totalTeams++;
                }
            }
        });

        $this->command->info('✅ إنشاء الفرق الميدانية: ' . $totalTeams . ' فريق.');
    }
}
