<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Committee;
use App\Models\Voter;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VoterSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('voters')) {
            $this->command->warn('⚠️ جدول الناخبين غير موجود، سيتم تخطي VoterSeeder.');

            return;
        }

        $campaign = Campaign::where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء الناخبين بدون الحملة الرئيسية.');

            return;
        }

        $committees = Committee::with('area')->where('campaign_id', $campaign->id)->get();
        if ($committees->isEmpty()) {
            $this->command->warn('⚠️ لا توجد لجان مرتبطة بالحملة لإنشاء ناخبين.');

            return;
        }

        $totalVoters = 0;
        DB::transaction(function () use ($campaign, $committees, &$totalVoters) {
            DB::table('voters')->where('campaign_id', $campaign->id)->delete();

            foreach ($committees as $committee) {
                $count = random_int(30, 70);
                for ($i = 1; $i <= $count; $i++) {
                    $gender = random_int(0, 1) === 0 ? 'male' : 'female';
                    $name = $this->randArabicName($gender);
                    $birthDate = now()->subYears(random_int(21, 65))->subDays(random_int(0, 364));
                    $govCode = null;
                    if ($committee->area && isset($committee->area->meta['gov_code'])) {
                        $govCode = $committee->area->meta['gov_code'];
                    }

                    $voterUid = sprintf('VOT-%s-%03d', $committee->code, $i);

                    Voter::updateOrCreate(
                        [
                            'campaign_id' => $campaign->id,
                            'voter_uid' => $voterUid,
                        ],
                        [
                            'committee_id' => $committee->id,
                            'area_id' => $committee->area_id,
                            'full_name' => $name['full'],
                            'national_id' => $this->egyptianNationalId($birthDate, $govCode),
                            'gender' => $gender,
                            'dob' => $birthDate->toDateString(),
                            'phone' => $this->egyptianPhone(),
                            'email' => Str::slug($name['full'], '.') . '@voters.eg',
                            'address' => 'شارع ' . Str::random(6) . '، ' . ($committee->area->name ?? 'مصر'),
                            'meta' => [
                                'source' => 'سجل الناخبين 2024',
                                'priority' => random_int(1, 5),
                            ],
                        ]
                    );

                    $totalVoters++;
                }
            }
        });

        $this->command->info('✅ إنشاء الناخبين: ' . $totalVoters . ' ناخب تم توزيعه على اللجان.');
    }
}
