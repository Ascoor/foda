<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            GovernoratesAreaSeeder::class,
            ElectionSeeder::class,
            CampaignSeeder::class,
            TeamSeeder::class,
            EventSeeder::class,
            ExpenseCategorySeeder::class,
            FinanceSeeder::class,
            HomeSeeder::class,
            ProfileSeeder::class,
            SettingSeeder::class,
            SmsSeeder::class,
            SwotSeeder::class,
            VolunteerSeeder::class,
            VoterSeeder::class,
            GeoAreaSeeder::class,
            CommitteeSeeder::class,
            CandidateSeeder::class,
            AgentSeeder::class,
            ObservationSeeder::class,
        ]);
    }
}
