<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Campaign, Committee, AgentAssignment, User};

class AgentAssignmentsSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Campaign::all() as $c) {
            $committees = Committee::where('campaign_id',$c->id)->get();
            $agents = $c->users()->wherePivot('role','agent')->get();
            foreach ($committees as $idx => $committee) {
                $agent = $agents[$idx % max(1, $agents->count())] ?? null;
                if ($agent) {
                    AgentAssignment::firstOrCreate([
                        'campaign_id'=>$c->id,
                        'committee_id'=>$committee->id,
                        'user_id'=>$agent->id,
                    ], ['assigned_at'=>now()]);
                }
            }
        }
    }
}
