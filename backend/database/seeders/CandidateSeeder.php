<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Candidate;
use App\Models\ElectionCircle\Election;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        $election = Election::first();
        if (! $election) {
            $this->call(ElectionSeeder::class);
            $election = Election::first();
        }

        Candidate::create([
            'name' => 'المرشح الأول',
            'party' => 'الحزب الأول',
            'election_id' => $election->id,
        ]);

        Candidate::create([
            'name' => 'المرشح الثاني',
            'party' => 'الحزب الثاني',
            'election_id' => $election->id,
        ]);
    }
}
