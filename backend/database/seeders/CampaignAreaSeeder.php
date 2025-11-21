<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Campaign, Area};

class CampaignAreaSeeder extends Seeder
{
    public function run(): void
    {
        $cairo = Campaign::where('slug','cairo-campaign')->first();
        $alex = Campaign::where('slug','alex-campaign')->first();
        if (!$cairo || !$alex) return;

        $cairoAreas = Area::whereIn('name', ['القاهرة', 'مدينة نصر', 'المعادي'])->pluck('id')->toArray();
        $alexAreas = Area::whereIn('name', ['الإسكندرية', 'سيدي جابر', 'العجمي'])->pluck('id')->toArray();

        $cairo->areas()->syncWithoutDetaching(array_fill_keys($cairoAreas, ['alias'=>null,'local_code'=>null]));
        $alex->areas()->syncWithoutDetaching(array_fill_keys($alexAreas, ['alias'=>null,'local_code'=>null]));
    }
}
