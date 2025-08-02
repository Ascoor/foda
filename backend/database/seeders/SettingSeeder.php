<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'APP_NAME',
                'value' => 'Foda',
                'description' => 'Application name',
                'type' => 'string',
            ],
            [
                'key' => 'SMS_RATE_LIMIT',
                'value' => '60',
                'description' => 'SMS per minute',
                'type' => 'integer',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
