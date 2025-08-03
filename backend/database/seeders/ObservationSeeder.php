<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Committee;
use App\Models\ElectionCircle\Observation;
use Illuminate\Database\Seeder;

class ObservationSeeder extends Seeder
{
    public function run(): void
    {
        if (Committee::count() === 0) {
            $this->call(CommitteeSeeder::class);
        }

        $committee = Committee::first();

        Observation::create([
            'committee_id' => $committee->id,
            'notes' => 'تم تسجيل ملاحظة حول سير العملية الانتخابية.',
            'volunteer_id' => null,
        ]);
    }
}
