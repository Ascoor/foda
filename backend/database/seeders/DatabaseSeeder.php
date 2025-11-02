<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            GovernoratesAreaSeeder::class,
            ElectionSeeder::class,
            CampaignsSeeder::class,
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
            ECSettingSeeder::class,
            ObservationSeeder::class,
        ]);
    }
}
