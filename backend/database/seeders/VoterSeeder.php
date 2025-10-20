<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Committee;
use App\Models\Voter;
use Illuminate\Database\Seeder;

class VoterSeeder extends Seeder
{
    public function run(): void
    {
        Campaign::with('committees')->each(function (Campaign $campaign) {
            $committees = Committee::query()->where('campaign_id', $campaign->id)->get();

            if ($committees->isEmpty()) {
                return;
            }

            $committees->each(function (Committee $committee) use ($campaign) {
                Voter::factory()
                    ->count(rand(35, 55))
                    ->create([
                        'campaign_id' => $campaign->id,
                        'committee_id' => $committee->id,
                        'geo_area_id' => $committee->geo_area_id,
                    ]);
            });
        });
    }
}
