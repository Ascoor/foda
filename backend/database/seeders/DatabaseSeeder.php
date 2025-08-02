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
            AreaSeeder::class,
            TeamSeeder::class,
            EventSeeder::class,
            FinanceSeeder::class,
            HomeSeeder::class,
            ProfileSeeder::class,
            SettingSeeder::class,
            SmsSeeder::class, 
            SwotSeeder::class,
            VolunteerSeeder::class,
            VoterSeeder::class,
        ]);
    }
}
