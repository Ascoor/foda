<?php

namespace Database\Seeders;

use App\Models\Voter;
use Illuminate\Database\Seeder;

class VoterSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['أحمد علي', 'John Doe', 'فاطمة', 'Jane Smith'];

        foreach ($names as $name) {
            Voter::factory()->create(['name' => $name]);
        }
    }
}
