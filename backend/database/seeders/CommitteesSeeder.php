<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\{Campaign, Area, Committee};

class CommitteesSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Campaign::all() as $c) {
            $areas = $c->areas()->pluck('areas.id')->toArray();
            $i=1;
            foreach ($areas as $areaId) {
                foreach (range(1,2) as $k) {
                    Committee::firstOrCreate([
                        'campaign_id' => $c->id,
                        'code' => 'C-'.$c->id.'-'.str_pad($i,3,'0',STR_PAD_LEFT),
                    ], [
                        'area_id' => $areaId,
                        'name' => 'لجنة رقم '.$i,
                        'location' => 'مدرسة/مركز شباب بالمنطقة',
                    ]);
                    $i++;
                }
            }
        }
    }
}
