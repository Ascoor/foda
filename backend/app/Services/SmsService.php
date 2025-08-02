<?php

namespace App\Services;

use App\Models\Sms;
use Carbon\Carbon;

class SmsService
{
    public function __construct(protected SettingService $settings)
    {
    }

    public function send(Sms $sms): Sms
    {
        $limit = (int) $this->settings->get('SMS_RATE_LIMIT', 0);
        if ($limit > 0) {
            $count = Sms::where('sent_at', '>=', Carbon::now()->subMinute())->count();
            if ($count >= $limit) {
                throw new \RuntimeException('SMS rate limit exceeded');
            }
        }

        // Integration with actual SMS provider would go here
        $sms->update([
            'status' => 'sent',
            'sent_at' => Carbon::now(),
        ]);

        return $sms;
    }
}
