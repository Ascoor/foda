<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Campaign;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AreaSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('areas') || ! Schema::hasTable('campaign_area')) {
            $this->command->warn('⚠️ جداول المناطق أو الربط بالحملات غير متوفرة، سيتم تخطي AreaSeeder.');

            return;
        }

        $campaign = Campaign::where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لم يتم العثور على الحملة الرئيسية لتوليد المناطق.');

            return;
        }

        $governorates = $this->governorates();

        DB::transaction(function () use ($governorates, $campaign) {
            DB::table('campaign_area')->where('campaign_id', $campaign->id)->delete();

            $areaIds = [];
            foreach ($governorates as $index => $gov) {
                $code = 'GOV-' . $gov['code'];

                $area = Area::updateOrCreate(
                    ['code' => $code],
                    [
                        'name' => $gov['name'],
                        'level' => 1,
                        'parent_id' => null,
                        'names' => ['ar' => $gov['name']],
                        'meta' => [
                            'type' => 'governorate',
                            'ordinal' => $index + 1,
                            'gov_code' => $gov['code'],
                        ],
                    ]
                );

                $areaIds[] = $area->id;
            }

            $campaign->areas()->sync($areaIds);
        });

        $this->command->info('✅ إنشاء المناطق وربطها بالحملة: ' . count($governorates) . ' محافظة.');
    }
}
