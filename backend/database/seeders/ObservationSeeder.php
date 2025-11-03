<?php

namespace Database\Seeders;

use App\Models\Committee;
use App\Models\Observation;
use App\Models\Volunteer;
use Illuminate\Database\Seeder;

class ObservationSeeder extends Seeder
{
    public function run(): void
    {
        if (Committee::count() === 0) {
            $this->call(CommitteeSeeder::class);
        }

        $committee = Committee::query()->first();
        $campaignId = $committee?->campaign_id;

        $volunteer = Volunteer::query()->where('campaign_id', $campaignId)->first();
        if (! $volunteer) {
            $volunteer = Volunteer::factory()->create([
                'campaign_id' => $campaignId,
            ]);
        }

        Observation::query()->updateOrCreate(
            [
                'campaign_id' => $campaignId,
                'committee_id' => $committee?->id,
            ],
            [
                'volunteer_id' => $volunteer->id,
                'notes' => 'تم تسجيل ملاحظة حول سير العملية الانتخابية.',
            ]
        );
    }
}
