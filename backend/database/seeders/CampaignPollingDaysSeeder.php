<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Campaign;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CampaignPollingDaysSeeder extends Seeder
{
    public function run(): void
    {
        // استخدم Schema::hasTable بدلاً من schema()
        if (! Schema::hasTable('campaign_polling_days')) return;

        foreach (Campaign::all() as $c) {
            foreach (range(1, 3) as $i) {
                DB::table('campaign_polling_days')->updateOrInsert([
                    'campaign_id' => $c->id,
                    'date' => now()->addDays($i * 7)->toDateString(),
                ], [
                    'notes' => 'جولة تصويت رقم ' . $i,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
