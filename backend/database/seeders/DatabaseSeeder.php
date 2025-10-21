<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class, 
            ExpenseCategorySeeder::class,
            CandidateSeeder::class,
            CampaignSeeder::class,
            AreaSeeder::class,
            CommitteeSeeder::class,
            TeamSeeder::class,
            VolunteerSeeder::class,
            VoterSeeder::class,
            EventSeeder::class,
            FinanceSeeder::class,
            ActivitySeeder::class,
            NotificationSeeder::class,
            AnalyticsSeeder::class,
        ]);
    }
}
