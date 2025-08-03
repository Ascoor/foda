<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Agent;
use App\Models\ElectionCircle\Candidate;
use App\Models\ElectionCircle\Committee;
use Illuminate\Database\Seeder;

class AgentSeeder extends Seeder
{
    public function run(): void
    {
        if (Candidate::count() === 0) {
            $this->call(CandidateSeeder::class);
        }
        if (Committee::count() === 0) {
            $this->call(CommitteeSeeder::class);
        }

        $candidate = Candidate::first();
        $committee = Committee::first();

        Agent::create([
            'name' => 'وكيل الحملة',
            'candidate_id' => $candidate->id,
            'committee_id' => $committee->id,
        ]);
    }
}
