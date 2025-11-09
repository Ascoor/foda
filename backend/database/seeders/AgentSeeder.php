<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Campaign;
use App\Models\Candidate;
use App\Models\Committee;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AgentSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('agents')) {
            $this->command->warn('⚠️ جدول الوكلاء غير موجود، سيتم تخطي AgentSeeder.');

            return;
        }

        $campaign = Campaign::where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء الوكلاء بدون الحملة الرئيسية.');

            return;
        }

        $candidates = Candidate::where('campaign_id', $campaign->id)->get();
        $committees = Committee::where('campaign_id', $campaign->id)->get();

        if ($candidates->isEmpty() || $committees->isEmpty()) {
            $this->command->warn('⚠️ يلزم وجود مرشحين ولجان قبل إنشاء الوكلاء.');

            return;
        }

        $totalAgents = 0;
        DB::transaction(function () use ($campaign, $candidates, $committees, &$totalAgents) {
            DB::table('agents')->where('campaign_id', $campaign->id)->delete();

            foreach ($candidates as $candidate) {
                $agentsCount = random_int(3, 7);
                for ($i = 1; $i <= $agentsCount; $i++) {
                    $committee = $committees->random();
                    $name = $this->randArabicName();

                    Agent::updateOrCreate(
                        [
                            'campaign_id' => $campaign->id,
                            'full_name' => $name['full'],
                            'committee_id' => $committee->id,
                        ],
                        [
                            'candidate_id' => $candidate->id,
                            'phone' => $this->egyptianPhone(),
                            'meta' => [
                                'shift' => random_int(0, 1) ? 'صباحي' : 'مسائي',
                                'notes' => 'يمتلك خبرة في المتابعة الميدانية',
                            ],
                        ]
                    );

                    $totalAgents++;
                }
            }
        });

        $this->command->info('✅ إنشاء الوكلاء المرتبطين بالمرشحين: ' . $totalAgents . ' وكيل.');
    }
}
