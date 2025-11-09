<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ElectionSeeder::class,
            CampaignSeeder::class,
            AreaSeeder::class,
            CommitteeSeeder::class,
            UserSeeder::class,
            TeamSeeder::class,
            VolunteerSeeder::class,
            VoterSeeder::class,
            CandidateSeeder::class,
            AgentSeeder::class,
            EventSeeder::class,
            ActivitySeeder::class,
            ObservationSeeder::class,
            ExpenseCategorySeeder::class,
            FinanceSeeder::class,
            AutomationSeeder::class,
            AnalyticsSeeder::class,
        ]);
    }
}
