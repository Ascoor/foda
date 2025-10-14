<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSmsRequest;
use App\Http\Resources\SmsResource;
use App\Models\Sms;
use App\Models\SmsSetting;
use App\Services\SmsService;
use Illuminate\Http\Request;

class SmsController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->authorizeResource(Sms::class, 'sms');
    }

    public function index(Request $request)
    {
        $sms = $this->handleIndex(
            $request,
            Sms::query()->where('user_id', $request->user()->id)->latest(),
            ['message', 'recipient'],
            ['status'],
            ['message', 'recipient'],
            ['created_at'],
            15
        );

        return SmsResource::collection($sms);
    }

    public function store(StoreSmsRequest $request, SmsService $service)
    {
        $data = $request->validated();
        $sms = Sms::create([
            'user_id' => $request->user()->id,
            'message' => $data['message'],
            'recipient' => $data['recipient'],
            'status' => isset($data['scheduled_for']) ? 'scheduled' : 'pending',
            'scheduled_for' => $data['scheduled_for'] ?? null,
        ]);

        if (!$sms->scheduled_for) {
            $service->send($sms);
        }

        return SmsResource::make($sms)->response()->setStatusCode(201);
    }

    public function show(Sms $sms)
    {
        return SmsResource::make($sms);
    }

    public function update(StoreSmsRequest $request, Sms $sms, SmsService $service)
    {
        $data = $request->validated();
        $sms->update($data);

        if ($request->boolean('resend') || (!$sms->scheduled_for && $sms->status !== 'sent')) {
            $service->send($sms);
        }

        return SmsResource::make($sms);
    }

    public function destroy(Sms $sms)
    {
        $sms->delete();

        return response()->noContent();
    }

    public function settings()
    {
        $setting = SmsSetting::first();
        return response()->json(['data' => $setting]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'api_key' => ['nullable', 'string'],
            'sender_id' => ['nullable', 'string'],
        ]);
        $setting = SmsSetting::first();
        if ($setting) {
            $setting->update($data);
        } else {
            $setting = SmsSetting::create($data);
        }
        return response()->json(['data' => $setting]);
    }
}
