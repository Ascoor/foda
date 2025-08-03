<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Election;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Database\Seeder;

class GeoAreaSeeder extends Seeder
{
    public function run(): void
    {
        $election = Election::first();
        if (! $election) {
            $this->call(ElectionSeeder::class);
            $election = Election::first();
        }

        GeoArea::create([
            'name' => 'الدائرة الأولى',
            'election_id' => $election->id,
        ]);

        GeoArea::create([
            'name' => 'الدائرة الثانية',
            'election_id' => $election->id,
        ]);
    }
}
