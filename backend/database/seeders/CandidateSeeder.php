<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Candidate;
use App\Models\Election;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();
        $election = Election::query()->first() ?? Election::factory()->create();

        Candidate::query()->updateOrCreate(
            ['campaign_id' => $campaign->id, 'name' => 'المرشح الأول'],
            [
                'election_id' => $election->id,
                'party' => 'الحزب الأول',
            ]
        );

        Candidate::query()->updateOrCreate(
            ['campaign_id' => $campaign->id, 'name' => 'المرشح الثاني'],
            [
                'election_id' => $election->id,
                'party' => 'الحزب الثاني',
            ]
        );
    }
}
