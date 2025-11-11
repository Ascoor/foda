<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            CampaignsSeeder::class,
            AreasSeeder::class,
            CampaignAreaSeeder::class,
            CampaignUserSeeder::class,
            CommitteesSeeder::class,
            TeamsSeeder::class,
            AgentAssignmentsSeeder::class,
            VotersSeeder::class,
            ActivitiesSeeder::class,
            EventsSeeder::class,
            NotificationsSeeder::class,
            AutomationTasksSeeder::class,
            ElectionsSeeder::class,
            CampaignPollingDaysSeeder::class,
        ]);
    }
}
