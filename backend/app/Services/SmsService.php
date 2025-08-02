<?php

namespace App\Services;

use App\Models\Sms;
use Carbon\Carbon;

class SmsService
{
    public function send(Sms $sms): Sms
    {
        // Integration with actual SMS provider would go here
        $sms->update([
            'status' => 'sent',
            'sent_at' => Carbon::now(),
        ]);

        return $sms;
    }
}
