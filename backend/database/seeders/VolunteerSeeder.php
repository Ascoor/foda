<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Volunteer;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class VolunteerSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('volunteers') || ! Schema::hasTable('campaign_volunteer')) {
            $this->command->warn('⚠️ جداول المتطوعين أو الربط بالحملة غير متوفرة، سيتم تخطي VolunteerSeeder.');

            return;
        }

        $campaign = Campaign::with(['teams.area'])->where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء المتطوعين بدون الحملة الرئيسية.');

            return;
        }

        if ($campaign->teams->isEmpty()) {
            $this->command->warn('⚠️ لا توجد فرق متاحة لتوزيع المتطوعين.');

            return;
        }

        $totalVolunteers = 0;
        DB::transaction(function () use ($campaign, &$totalVolunteers) {
            DB::table('campaign_volunteer')->where('campaign_id', $campaign->id)->delete();
            DB::table('volunteers')->where('campaign_id', $campaign->id)->delete();

            foreach ($campaign->teams as $team) {
                $volunteerCount = random_int(5, 12);
                for ($i = 1; $i <= $volunteerCount; $i++) {
                    $name = $this->randArabicName();
                    $email = sprintf('volunteer_%d_%d@eg2025.test', $team->id, $i);

                    $volunteer = Volunteer::updateOrCreate(
                        [
                            'campaign_id' => $campaign->id,
                            'email' => $email,
                        ],
                        [
                            'team_id' => $team->id,
                            'area_id' => $team->area_id,
                            'first_name' => $name['first'],
                            'last_name' => $name['last'],
                            'phone' => $this->egyptianPhone(),
                            'tags' => ['field', 'community'],
                            'meta' => [
                                'availability' => ['weekdays' => ['evening'], 'weekend' => ['morning']],
                            ],
                        ]
                    );

                    DB::table('campaign_volunteer')->updateOrInsert(
                        [
                            'campaign_id' => $campaign->id,
                            'volunteer_id' => $volunteer->id,
                        ],
                        [
                            'assignment' => 'تعبئة ميدانية',
                            'shift' => 'مسائي',
                            'tags' => json_encode(['door_knocking']),
                            'updated_at' => now(),
                            'created_at' => now(),
                        ]
                    );

                    $totalVolunteers++;
                }
            }
        });

        $this->command->info('✅ إنشاء المتطوعين وربطهم بالحملة: ' . $totalVolunteers . ' متطوع.');
    }
}
