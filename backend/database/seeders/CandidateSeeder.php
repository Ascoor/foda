<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Candidate;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();

        Candidate::query()->updateOrCreate(
            ['campaign_id' => $campaign->id, 'name' => 'المرشح الأول'],
            ['party' => 'الحزب الأول']
        );

        Candidate::query()->updateOrCreate(
            ['campaign_id' => $campaign->id, 'name' => 'المرشح الثاني'],
            ['party' => 'الحزب الثاني']
        );
    }
}
