<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Election;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $election = Election::first();
        if (! $election) {
            $this->call(ElectionSeeder::class);
            $election = Election::first();
        }

        Campaign::create([
            'name' => 'حملة التوعية',
            'description' => 'وصف مختصر للحملة',
            'election_id' => $election->id,
            'governorate_id' => 1,
            'district_id' => 101,
            'electoral_circle_id' => 1001,
        ]);
    }
}
