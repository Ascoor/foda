<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Election;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CampaignSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('campaigns')) {
            $this->command->warn('⚠️ جدول الحملات غير موجود، سيتم تخطي CampaignSeeder.');

            return;
        }

        $election = Election::firstOrCreate(
            ['name' => 'الانتخابات العامة 2025'],
            [
                'election_date' => now()->addMonths(2)->toDateString(),
                'meta' => ['country' => 'EG', 'locale' => 'ar_EG'],
            ]
        );

        $campaign = Campaign::updateOrCreate(
            ['slug' => 'eg-2025-main'],
            [
                'name' => 'حملة مصر 2025',
                'description' => 'بيانات تجريبية بالعربية المصرية لحملة انتخابية وطنية.',
                'election_id' => $election->id,
                'starts_at' => now()->subMonth(),
                'ends_at' => now()->addMonths(3),
                'spatial_level' => 'national',
                'bbox' => [
                    'minLng' => 24.7,
                    'minLat' => 21.7,
                    'maxLng' => 36.9,
                    'maxLat' => 31.7,
                ],
                'status' => 'active',
                'settings' => [
                    'locale' => 'ar_EG',
                    'branding' => [
                        'primary_color' => '#d32f2f',
                        'secondary_color' => '#f9a825',
                    ],
                ],
            ]
        );

        $this->command->info('✅ الحملة الرئيسية: ' . $campaign->name . ' (' . Str::upper($campaign->status) . ')');
    }
}
