<?php

namespace App\Services;

use App\Models\Setting;

class SettingService
{
    public function get(string $key, $default = null)
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return $default;
        }

        switch ($setting->type) {
            case 'integer':
                return (int) $setting->value;
            case 'boolean':
                return filter_var($setting->value, FILTER_VALIDATE_BOOLEAN);
            default:
                return $setting->value;
        }
    }
}
