<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Candidate;
use App\Models\Election;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class CandidateSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('candidates')) {
            $this->command->warn('⚠️ جدول المرشحين غير موجود، سيتم تخطي CandidateSeeder.');

            return;
        }

        $campaign = Campaign::where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء المرشحين بدون الحملة الرئيسية.');

            return;
        }

        $election = $campaign->election ?: Election::first();

        $candidates = [
            ['name' => 'د. سلمى الشناوي', 'party' => 'تحالف الأمل'],
            ['name' => 'المستشار ياسر الخولي', 'party' => 'حزب النهضة'],
            ['name' => 'م. كريم البدري', 'party' => 'مستقل'],
        ];

        $count = 0;
        foreach ($candidates as $candidateData) {
            Candidate::updateOrCreate(
                [
                    'campaign_id' => $campaign->id,
                    'name' => $candidateData['name'],
                ],
                [
                    'election_id' => $election?->id,
                    'party' => $candidateData['party'],
                    'meta' => [
                        'slogan' => 'مصر أقوى بين إيدينا',
                        'media' => ['facebook' => 'https://facebook.com/' . str_replace(' ', '', $candidateData['name'])],
                    ],
                ]
            );
            $count++;
        }

        $this->command->info('✅ إنشاء المرشحين المرتبطين بالحملة: ' . $count . ' مرشح.');
    }
}
