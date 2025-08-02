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
            EventSeeder::class,
            FinanceSeeder::class,
            HomeSeeder::class,
            ProfileSeeder::class,
            SettingsSeeder::class,
            SmsSeeder::class,
            SnwSeeder::class,
            TeamSeeder::class,
            VolunteerSeeder::class,
            VoterSeeder::class,
        ]);
    }
}
