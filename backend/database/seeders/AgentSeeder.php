<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Campaign;
use App\Models\Candidate;
use App\Models\Committee;
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

        $candidate = Candidate::query()->first();
        $committee = Committee::query()->first();
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();

        $team = Team::query()->where('campaign_id', $committee?->campaign_id ?? $campaign->id)->first();
        if (! $team) {
            $team = Team::factory()->create([
                'campaign_id' => $committee?->campaign_id ?? $campaign->id,
            ]);
        }

        $volunteer = Volunteer::query()
            ->where('campaign_id', $team->campaign_id)
            ->first();

        if (! $volunteer) {
            $volunteer = Volunteer::factory()->create([
                'campaign_id' => $team->campaign_id,
                'team_id' => $team->id,
            ]);
        }

        Agent::query()->updateOrCreate(
            [
                'campaign_id' => $committee?->campaign_id ?? $campaign->id,
                'person_id' => $volunteer->id,
            ],
            [
                'name' => 'وكيل الحملة',
                'candidate_id' => $candidate?->id,
                'committee_id' => $committee?->id,
                'active' => true,
                'assigned_at' => now(),
            ]
        );
    }
}
