<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\ECSetting;
use App\Models\ElectionCircle\Election;
use Illuminate\Database\Seeder;

class ECSettingSeeder extends Seeder
{
    public function run(): void
    {
        $election = Election::first();
        if (! $election) {
            $this->call(ElectionSeeder::class);
            $election = Election::first();
        }

        ECSetting::create([
            'key' => 'شعار',
            'value' => 'التغيير للأفضل',
            'election_id' => $election->id,
        ]);
    }
}
