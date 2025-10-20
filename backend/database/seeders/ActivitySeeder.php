<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        Volunteer::with('campaign')->each(function (Volunteer $volunteer) {
            $voters = Voter::query()
                ->where('campaign_id', $volunteer->campaign_id)
                ->inRandomOrder()
                ->take(10)
                ->get();

            if ($voters->isEmpty()) {
                return;
            }

            Activity::factory()
                ->count(5)
                ->state(function () use ($volunteer, $voters) {
                    return [
                        'campaign_id' => $volunteer->campaign_id,
                        'volunteer_id' => $volunteer->id,
                        'voter_id' => $voters->random()->id,
                    ];
                })
                ->create();
        });
    }
}
