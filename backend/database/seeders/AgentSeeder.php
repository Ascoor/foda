<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Agent;
use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Candidate;
use App\Models\ElectionCircle\Committee;
use App\Models\Team;
use App\Models\Volunteer;
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
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();
        $team = Team::query()->where('campaign_id', $committee->campaign_id)->first();

        if (! $team) {
            $team = Team::factory()->create([
                'campaign_id' => $committee->campaign_id ?? $campaign->id,
            ]);
        }

        $volunteer = Volunteer::query()->whereHas('team', function ($query) use ($team) {
            $query->where('id', $team->id);
        })->first();

        if (! $volunteer) {
            $volunteer = Volunteer::factory()->create([
                'team_id' => $team->id,
            ]);
        }

        Agent::updateOrCreate(
            [
                'campaign_id' => $committee->campaign_id ?? $campaign->id,
                'person_id' => $volunteer->id,
            ],
            [
                'name' => 'وكيل الحملة',
                'candidate_id' => $candidate->id,
                'committee_id' => $committee->id,
                'active' => true,
                'assigned_at' => now(),
            ]
        );
    }
}
