<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Campaign, Event};
use Carbon\Carbon;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Campaign::all() as $c) {
            foreach (range(1,8) as $i) {
                Event::create([
                    'campaign_id' => $c->id,
                    'name' => 'مؤتمر جماهيري '.$i,
                    'description' => 'فعالية توعوية للتواصل مع المواطنين.',
                    'organiser' => 'غرفة عمليات الحملة',
                    'location' => 'قاعة مناسبات / مركز شباب',
                    'date' => Carbon::now()->addDays(rand(-10, 20)),
                ]);
            }
        }
    }
}
