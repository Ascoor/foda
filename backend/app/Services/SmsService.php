<?php

namespace App\Services;

use App\Models\Sms;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SmsService
{
    public function send(Sms $sms): Sms
    {
        // Integration with actual SMS provider would go here
        $sms->update([
            'status' => 'sent',
            'sent_at' => Carbon::now(),
        ]);

        Log::info('sms.sent', $sms->toArray());

        return $sms;
    }
}
