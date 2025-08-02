<?php

namespace App\Services;

use App\Models\Sms;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

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

        $sid = config('services.twilio.sid', 'sid');
        $token = config('services.twilio.token', 'token');
        $from = config('services.twilio.from', 'from');

        try {
            Http::withBasicAuth($sid, $token)
                ->asForm()
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'From' => $from,
                    'To' => $sms->recipient,
                    'Body' => $sms->message,
                ])->throw();

            $sms->update([
                'status' => 'sent',
                'sent_at' => Carbon::now(),
            ]);

            Log::info('sms.sent', $sms->toArray());
        } catch (\Throwable $e) {
            $sms->update(['status' => 'failed']);
            Log::error('sms.failed', ['id' => $sms->id, 'error' => $e->getMessage()]);
        }

        return $sms;
    }
}
