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
            UserSeeder::class,
            AuthSeeder::class,
            AreaSeeder::class,
            TeamSeeder::class,
            EventSeeder::class,
            FinanceSeeder::class,
            HomeSeeder::class,
            ProfileSeeder::class,
            SettingsSeeder::class,
            SmsSeeder::class, 
            SwotSeeder::class,
            TeamSeeder::class, 
            SnwSeeder::class, 
            VolunteerSeeder::class,
            VoterSeeder::class,
        ]);
    }
}
