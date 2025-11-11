<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Campaign, Committee, Voter, Area};

class VotersSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Campaign::all() as $c) {
            $committees = Committee::where('campaign_id',$c->id)->pluck('id')->toArray();
            $areas = $c->areas()->pluck('areas.id')->toArray();
            if (empty($committees) || empty($areas)) continue;

            for ($i=1; $i<=200; $i++) {
                $fullName = 'مواطن ' . $i;
                Voter::create([
                    'campaign_id' => $c->id,
                    'committee_id' => $committees[array_rand($committees)],
                    'area_id' => $areas[array_rand($areas)],
                    'full_name' => $fullName,
                    'phone' => '01'.rand(0,9).rand(100000000,999999999),
                    'address' => 'عنوان مواطن رقم '.$i,
                    'gender' => (rand(0,1) ? 'male' : 'female'),
                ]);
            }
        }
    }
}
