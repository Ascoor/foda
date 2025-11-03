<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::first() ?? User::factory()->create();

        $startsAt = Carbon::now()->startOfMonth();
        $endsAt = Carbon::now()->endOfMonth();

        Campaign::query()->updateOrCreate(
            ['slug' => 'awareness-campaign'],
            [
                'name' => 'حملة التوعية الوطنية',
                'description' => 'حملة توعوية افتراضية لتهيئة النظام على المستوى الوطني.',
                'timezone' => 'Africa/Cairo',
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'spatial_level' => 'governorate',
                'admin_areas' => ['EG-01', 'EG-02'],
                'bbox' => [29.0, 30.0, 31.0, 32.0],
                'polling_settings' => ['sms_reminders' => true],
                'status' => 'active',
                'created_by' => $owner->getKey(),
            ]
        )->members()->syncWithoutDetaching([
            $owner->getKey() => ['role' => 'owner', 'status' => 'active'],
        ]);
    }
}
