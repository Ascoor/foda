<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Campaign, Notification};

class NotificationsSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Campaign::all() as $c) {
            foreach (range(1,10) as $i) {
                Notification::create([
                    'campaign_id' => $c->id,
                    'user_id' => 1,
                    'type' => 'system',
                    'title' => 'تنبيه إداري رقم '.$i,
                    'message' => 'يرجى مراجعة مهام اليوم وخطة المرور.',
                    'priority' => ['low','normal','high'][array_rand(['low','normal','high'])],
                ]);
            }
        }
    }
}
