<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Campaign;
use App\Models\Sms;

class CampaignDashboardController extends Controller
{
    public function show(Campaign $campaign)
    {
        $kpis = [
            'activities_last7' => Activity::query()
                ->where('reported_at', '>=', now()->subDays(7))
                ->count(),
            'sms_today' => Sms::query()
                ->whereDate('sent_at', now()->toDateString())
                ->count(),
        ];

        return response()->json([
            'campaign' => $campaign,
            'kpis' => $kpis,
        ]);
    }
}
