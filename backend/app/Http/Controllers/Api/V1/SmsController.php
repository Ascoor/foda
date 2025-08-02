<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSmsRequest;
use App\Http\Resources\SmsResource;
use App\Models\Sms;
use App\Services\SmsService;

class SmsController extends Controller
{
    public function index()
    {
        return SmsResource::collection(Sms::latest()->paginate());
    }

    public function store(StoreSmsRequest $request, SmsService $service)
    {
        $data = $request->validated();
        $sms = Sms::create([
            'user_id' => $request->user()->id ?? null,
            'message' => $data['message'],
            'recipient_phone' => $data['recipient_phone'],
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
}
