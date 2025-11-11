<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Campaign, User};

class CampaignUserSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch the admin user once
        $admin = User::where('email', 'admin@example.com')->first();
        
        // Check if admin exists
        if (!$admin) {
            $this->command->info('Admin user not found!');
            return;
        }

        // Fetch all campaigns
        $campaigns = Campaign::all();

        // Fetch all volunteer users once to avoid multiple queries inside the loop
        $volunteers = User::where('email', 'like', 'vol%')->limit(10)->get();

        if ($campaigns->isEmpty()) {
            $this->command->info('No campaigns found!');
            return;
        }

        // Loop through each campaign
        foreach ($campaigns as $c) {
            // Link the admin user to the campaign as a campaign manager
            $c->users()->syncWithoutDetaching([
                $admin->id => ['role' => 'campaign_manager', 'status' => 'active']
            ]);

            // Link the first 10 volunteer users as agents/volunteers to the campaign
            foreach ($volunteers as $i => $u) {
                $role = $i < 5 ? 'agent' : 'volunteer'; // Assign 'agent' for first 5, 'volunteer' for the next 5
                $c->users()->syncWithoutDetaching([
                    $u->id => ['role' => $role, 'status' => 'active']
                ]);
            }
        }

        $this->command->info('Campaigns and users have been linked successfully!');
    }
}
